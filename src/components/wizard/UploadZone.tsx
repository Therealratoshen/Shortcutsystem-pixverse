import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import type { UploadedImage } from '../../types';

interface UploadZoneProps {
  onUpload: (image: UploadedImage) => void;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);

      const image: UploadedImage = {
        id: crypto.randomUUID(),
        url,
        file,
        name: file.name,
        size: file.size,
        timestamp: Date.now(),
      };
      onUpload(image);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        id="file-upload"
      />
      
      {!preview ? (
        <label
          htmlFor="file-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center w-full aspect-[4/3] rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            isDragging
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50 hover:bg-white/5'
          }`}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className={`w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 ${
              isDragging ? 'animate-bounce' : ''
            }`}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-accent' : 'text-text-muted'}`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {isDragging ? 'Drop your image here' : 'Upload Product Image'}
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Drag and drop or click to browse
            </p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <ImageIcon className="w-4 h-4" />
              <span>JPG, PNG, WebP • Max 10MB • Recommended: 1024×1024px</span>
            </div>
          </div>
        </label>
      ) : (
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full aspect-[4/3] object-cover"
          />
          <label
            htmlFor="file-upload"
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-white mx-auto mb-2" />
              <span className="text-white font-medium">Change Image</span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
