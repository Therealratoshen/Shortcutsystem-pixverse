import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { v4 as generate } from 'uuid';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

function extractInsightsFromText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  let category = 'top';
  if (text.includes('shoe') || text.includes('sandal') || text.includes('boot') || text.includes('sneaker')) category = 'shoes';
  else if (text.includes('bag') || text.includes('purse') || text.includes('wallet')) category = 'bag';
  else if (text.includes('dress') || text.includes('gown')) category = 'dress';
  else if (text.includes('pant') || text.includes('skirt') || text.includes('jean')) category = 'bottom';
  else if (text.includes('watch') || text.includes('jewelry') || text.includes('sunglasses')) category = 'accessories';

  let style = 'casual';
  if (text.includes('luxury') || text.includes('elegant') || text.includes('premium')) style = 'luxury';
  else if (text.includes('sport') || text.includes('athletic')) style = 'sporty';
  else if (text.includes('classic') || text.includes('vintage')) style = 'classic';
  else if (text.includes('modern') || text.includes('contemporary')) style = 'modern';
  else if (text.includes('formal')) style = 'formal';

  let colors = ['neutral'];
  const colorMatch = text.match(/color[s]?\s*[:\-]?\s*([^\n,.]+)/i);
  if (colorMatch) {
    colors = colorMatch[1].split(/[,;]/).map(c => c.trim()).filter(c => c && c.length < 20);
  }

  let materials = ['fabric'];
  const materialMatch = text.match(/material[s]?\s*[:\-]?\s*([^\n,.]+)/i);
  if (materialMatch) {
    materials = materialMatch[1].split(/[,;]/).map(m => m.trim()).filter(m => m && m.length < 30);
  }

  let productName = 'fashion item';
  const productMatch = text.match(/product\s*(is\s+|:\s*)?([^\n,]+)/i);
  if (productMatch) {
    productName = productMatch[2].replace(/[*_]/g, '').trim();
  } else {
    const nounMatch = text.match(/\b(sandal|bag|dress|shoe|boot|shirt|pant|skirt|watch|jacket|coat|hat|scarf|bracelet|necklace|ring|earring)\b/gi);
    if (nounMatch && nounMatch.length > 0) {
      productName = nounMatch.slice(0, 3).join(' ').toLowerCase();
      productName = productName.charAt(0).toUpperCase() + productName.slice(1);
    }
  }

  const features = [];
  if (text.includes('comfortable')) features.push('comfortable');
  if (text.includes('stylish') || text.includes('fashion')) features.push('stylish');
  if (text.includes('versatile')) features.push('versatile');
  if (text.includes('durable') || text.includes('quality')) features.push('durable');
  if (features.length === 0) features.push('stylish');

  const keywords = [productName.toLowerCase()];
  colors.forEach(c => keywords.push(c.toLowerCase()));
  materials.forEach(m => keywords.push(m.toLowerCase()));
  keywords.push(category);

  return {
    productName,
    category,
    color: colors.slice(0, 3),
    material: materials.slice(0, 3),
    style: [style],
    features: features.slice(0, 4),
    keywords: keywords.slice(0, 6)
  };
}

app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    await ensureDirectories();
    const timestamp = Date.now();
    const filename = `analyze_${timestamp}.jpg`;
    const imagePath = path.join(UPLOAD_DIR, filename);

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(imagePath, buffer);

    console.log('[MiniMax] Analyzing local image:', imagePath);

    const prompt = `Analyze this fashion product image and describe it in detail. Focus on: 1) What product is it (specific name), 2) What category (bag/shoes/dress/top/bottom/accessories), 3) What colors are visible, 4) What materials appear to be used, 5) What style does it have (luxury/casual/sporty/classic/modern/bohemian/formal), 6) What are the key features, 7) What keywords would you use to search for this product.`;

    console.log('[MiniMax] Calling mmx vision...');
    const command = `mmx vision --prompt "${prompt.replace(/"/g, '\\"')}" --image "${imagePath}"`;

    const { stdout, stderr } = await execAsync(command, { maxBuffer: 1024 * 1024 * 10 });

    console.log('[MiniMax] Response:', stdout);
    if (stderr) {
      console.error('[MiniMax] Stderr:', stderr);
    }

    let result;
    try {
      const parsed = JSON.parse(stdout);

      if (parsed.content) {
        result = extractInsightsFromText(parsed.content);
      } else if (parsed.error) {
        console.error('[MiniMax] API Error:', parsed.error);
        return res.status(500).json({
          error: 'MiniMax API error',
          details: parsed.error
        });
      } else {
        result = parsed;
      }
    } catch (parseError) {
      console.error('[MiniMax] Failed to parse response:', parseError);
      return res.status(500).json({
        error: 'Failed to parse MiniMax response',
        details: stdout
      });
    }

    res.json({
      success: true,
      insights: result
    });
  } catch (error) {
    console.error('[MiniMax] Error:', error);
    res.status(500).json({
      error: 'Failed to analyze image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/upload-image', async (req, res) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const detectedFormat = validateImageFormat(imageData);
    
    if (!detectedFormat) {
      return res.status(400).json({ 
        error: 'Invalid image format',
        message: 'Only JPEG, PNG, and WebP images are supported'
      });
    }

    await ensureDirectories();

    const timestamp = Date.now();
    const extension = detectedFormat.split('/')[1];
    const filename = `image_${timestamp}.${extension}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(base64Data, 'base64');

    await fs.writeFile(filepath, buffer);

    console.log('Image uploaded:', filepath);

    res.json({
      success: true,
      path: filepath,
      filename,
      format: detectedFormat
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      error: 'Failed to upload image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const OUTPUT_DIR = path.join(__dirname, 'generated-videos');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const TASKS_FILE = path.join(__dirname, 'tasks.json');

async function ensureDirectories() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

function validateImageFormat(base64Data) {
  const signatures = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/webp': [0x52, 0x49, 0x46, 0x46],
  };

  const base64Signature = base64Data.substring(0, 50);
  
  for (const [mimeType, sig] of Object.entries(signatures)) {
    const hexSignature = sig.map(b => b.toString(16).padStart(2, '0')).join('');
    if (base64Signature.includes(hexSignature) || 
        base64Data.startsWith(`data:${mimeType}`)) {
      return mimeType;
    }
  }
  
  return null;
}

async function loadTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function saveTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

async function pollTaskStatus(taskId, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const { stdout } = await execAsync(`pixverse task status ${taskId} --json`);
      const result = JSON.parse(stdout);
      const task = Array.isArray(result) ? result[0] : result;

      if (task) {
        if (task.status === 'Success' || task.status === 'success' || task.status_code === 1) {
          return { status: 'completed', task };
        } else if (task.status === 'Failed' || task.status === 'failed' || task.status === 'Error' || task.status_code === 8) {
          return { status: 'failed', task, error: task.error || 'Generation failed' };
        } else if (task.status === 'Generating' || task.status === 'processing' || task.status === 'Pending' || task.status === 'pending' || task.status_code === 10) {
          console.log(`Task ${taskId} status: ${task.status} (${i + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          console.log(`Task ${taskId} status: ${task.status} (${i + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    } catch (error) {
      console.error('Error polling task status:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  return { status: 'timeout', error: 'Task polling timeout' };
}

app.post('/api/generate-video', async (req, res) => {
  try {
    const { settings } = req.body;
    const {
      prompt,
      duration = 6,
      model = 'v6',
      quality = '720p',
      aspectRatio = '9:16',
      imagePath = null,
      imageData = null
    } = settings;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    await ensureDirectories();

    let finalImagePath = imagePath;

    if (imageData && !imagePath) {
      const detectedFormat = validateImageFormat(imageData);
      
      if (!detectedFormat) {
        return res.status(400).json({ 
          error: 'Invalid image format',
          message: 'Only JPEG, PNG, and WebP images are supported'
        });
      }
      
      const timestamp = Date.now();
      const extension = detectedFormat.split('/')[1];
      const filename = `image_${timestamp}.${extension}`;
      finalImagePath = path.join(UPLOAD_DIR, filename);
      
      try {
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(finalImagePath, buffer);
        console.log('Image saved for generation:', finalImagePath);
      } catch (error) {
        console.error('Failed to save image:', error);
        return res.status(500).json({ 
          error: 'Failed to save image',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const taskId = generate();
    const timestamp = Date.now();
    const outputPath = path.join(OUTPUT_DIR, `video_${timestamp}.mp4`);

    let command = `pixverse create video --prompt "${prompt}" --duration ${duration} --model ${model} --quality ${quality} --aspect-ratio ${aspectRatio} --no-wait --json`;

    if (finalImagePath) {
      command += ` --image "${finalImagePath}"`;
      console.log('Using image:', finalImagePath);
    }

    console.log('Starting video generation...');
    console.log('Command:', command);

    const { stdout, stderr } = await execAsync(command, { maxBuffer: 1024 * 1024 * 10 });

    let taskInfo;
    let taskIdentifier;
    
    try {
      taskInfo = JSON.parse(stdout);
      taskIdentifier = taskInfo.video_id || taskInfo.id;
      console.log('Video ID extracted:', taskIdentifier);
    } catch (e) {
      console.error('Failed to parse JSON output:', e);
      const match = stdout.match(/video_id:\s*(\d+)/);
      if (match) {
        taskIdentifier = match[1];
        taskInfo = { video_id: taskIdentifier };
      } else {
        throw new Error('Could not extract video_id from output');
      }
    }

    const tasks = await loadTasks();
    tasks[taskId] = {
      id: taskId,
      taskIdentifier,
      status: 'processing',
      prompt,
      duration,
      model,
      quality,
      aspectRatio,
      imagePath,
      outputPath,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    await saveTasks(tasks);

    console.log('Task created:', taskId);
    console.log('PixVerse Task ID:', taskIdentifier);

    res.json({
      success: true,
      taskId,
      message: 'Video generation started',
      statusUrl: `/api/video-status/${taskId}`
    });

  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({
      error: 'Failed to start video generation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/video-status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const tasks = await loadTasks();
    const task = tasks[taskId];

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status === 'processing') {
      const statusResult = await pollTaskStatus(task.taskIdentifier);

      if (statusResult.status === 'completed') {
        task.status = 'completed';
        
        if (statusResult.task.video_url) {
          task.videoUrl = statusResult.task.video_url;
          task.outputPath = statusResult.task.video_url;
        } else {
          task.outputPath = statusResult.task.url || task.outputPath;
        }
        
        task.completedAt = Date.now();
        await saveTasks(tasks);
        
        console.log(`Task ${taskId} completed! Video URL: ${task.videoUrl || task.outputPath}`);
      } else if (statusResult.status === 'failed') {
        task.status = 'failed';
        task.error = statusResult.error;
        await saveTasks(tasks);
      }
    }

    res.json({
      taskId,
      status: task.status,
      outputPath: task.outputPath,
      videoUrl: task.videoUrl || task.outputPath,
      error: task.error,
      prompt: task.prompt,
      createdAt: task.createdAt,
      completedAt: task.completedAt
    });

  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({
      error: 'Failed to check status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/video/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const tasks = await loadTasks();
    const task = tasks[taskId];

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status !== 'completed') {
      return res.status(400).json({ error: 'Video not ready', status: task.status });
    }

    res.json({
      success: true,
      videoUrl: task.outputPath,
      taskId,
      prompt: task.prompt
    });

  } catch (error) {
    console.error('Error retrieving video:', error);
    res.status(500).json({
      error: 'Failed to retrieve video',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await loadTasks();
    const taskList = Object.values(tasks).sort((a, b) => b.createdAt - a.createdAt);
    res.json({ tasks: taskList });
  } catch (error) {
    console.error('Error listing tasks:', error);
    res.status(500).json({ error: 'Failed to list tasks' });
  }
});

app.delete('/api/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const tasks = await loadTasks();

    if (tasks[taskId]) {
      const task = tasks[taskId];
      if (task.outputPath) {
        try {
          await fs.unlink(task.outputPath);
        } catch (e) {
          console.log('Could not delete file:', task.outputPath);
        }
      }
      delete tasks[taskId];
      await saveTasks(tasks);
    }

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    version: '1.0.0',
    pixverseAuth: true
  });
});

async function startServer() {
  await ensureDirectories();
  app.listen(PORT, () => {
    console.log(`\n🚀 Local PixVerse Server running on http://localhost:${PORT}`);
    console.log(`📁 Videos will be saved to: ${OUTPUT_DIR}`);
    console.log(`\nAPI Endpoints:`);
    console.log(`  POST /api/generate-video  - Start video generation`);
    console.log(`  GET  /api/video-status/:id - Check generation status`);
    console.log(`  GET  /api/video/:id       - Get generated video`);
    console.log(`  GET  /api/tasks           - List all tasks`);
    console.log(`  GET  /api/health          - Health check`);
    console.log(`\n`);
  });
}

startServer().catch(console.error);
