import { useState, useRef } from 'react';
import { Upload, Video, X, Check } from 'lucide-react';

interface VideoUploadProps {
  onUpload: (videoBlob: Blob, thumbnail?: string) => void;
  onSkip?: () => void;
}

export default function VideoUpload({ onUpload, onSkip }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm'))) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadedFile(file);

    if (file.type.startsWith('video/')) {
      const thumbnail = await generateThumbnail(file);
      setThumbnailPreview(thumbnail);
    }

    setIsUploading(false);
  };

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      
      video.onloadeddata = () => {
        video.currentTime = 1;
      };
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
          URL.revokeObjectURL(video.src);
          resolve(thumbnailUrl);
        } else {
          resolve('');
        }
      };
      
      video.onerror = () => {
        resolve('');
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = () => {
    if (uploadedFile) {
      onUpload(uploadedFile, thumbnailPreview || undefined);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Upload Your Generated Video</h2>
        <p className="text-text-secondary">
          Upload the video you generated using PixVerse CLI
        </p>
      </div>

      {/* Upload Zone */}
      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50 hover:bg-secondary'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,.mp4,.webm"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Drop your video here</h3>
          <p className="text-sm text-text-muted mb-4">
            or click to browse
          </p>
          <div className="inline-block px-4 py-2 rounded-lg bg-accent/10 text-sm text-accent">
            MP4, WebM • Max 100MB
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden bg-primary border border-border">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Video thumbnail"
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="w-full aspect-video bg-secondary flex items-center justify-center">
                <Video className="w-16 h-16 text-text-muted" />
              </div>
            )}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-3 py-1 rounded bg-black/70 text-sm text-white">
              {uploadedFile.name}
            </div>
          </div>

          {/* File Info */}
          <div className="p-4 rounded-xl bg-secondary border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">File name</span>
              <span className="text-sm font-medium truncate max-w-[200px]">{uploadedFile.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Size</span>
              <span className="text-sm font-medium">
                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!uploadedFile || isUploading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            'Processing...'
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save Video
            </>
          )}
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
        <h4 className="font-semibold mb-2 text-sm">How to generate a video:</h4>
        <ol className="space-y-1 text-sm text-text-secondary list-decimal list-inside">
          <li>Copy the CLI commands from the previous step</li>
          <li>Run the commands in your terminal locally</li>
          <li>Upload the generated .mp4 file here</li>
        </ol>
      </div>
    </div>
  );
}
