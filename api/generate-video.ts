import type { VercelRequest, VercelResponse } from '@vercel/node';

interface VideoSettings {
  prompt: string;
  duration: number;
  model: string;
  quality: string;
  aspectRatio: string;
  imageUrl?: string;
  templateId?: string;
  templateName?: string;
}

interface GenerationRequest {
  settings: VideoSettings;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { settings } = req.body as GenerationRequest;

    if (!settings || !settings.prompt) {
      return res.status(400).json({ error: 'Settings with prompt is required' });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.GITHUB_REPO_OWNER || 'Therealratoshen';
    const repoName = process.env.GITHUB_REPO_NAME || 'Shortcutsystem-pixverse';

    if (!githubToken) {
      return res.status(500).json({
        error: 'GitHub token not configured',
        message: 'Please set GITHUB_TOKEN in Vercel environment variables'
      });
    }

    const workflowId = 'pixverse-generate.yml';

    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowId}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            settings: JSON.stringify({
              prompt: settings.prompt,
              duration: settings.duration || 6,
              model: settings.model || 'v6',
              quality: settings.quality || '720p',
              aspectRatio: settings.aspectRatio || '9:16',
              imageUrl: settings.imageUrl || null,
              templateId: settings.templateId || null,
              templateName: settings.templateName || null,
            }),
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error:', response.status, errorText);
      
      return res.status(response.status).json({
        error: 'Failed to trigger workflow',
        message: errorText,
      });
    }

    const jobId = `${Date.now()}`;

    return res.status(200).json({
      success: true,
      jobId,
      message: 'Video generation started. Check GitHub Actions for status.',
      statusUrl: `https://github.com/${repoOwner}/${repoName}/actions`,
    });

  } catch (error) {
    console.error('Error triggering workflow:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
