
import React, { useState, useRef } from 'react';
import { Upload, FileIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  accept?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, accept = '*' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    setError(null);
    setIsUploading(true);
    
    // Validate file type if accept is provided
    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.name.substring(file.name.lastIndexOf('.'));
      
      if (!acceptedTypes.some(type => file.type.includes(type) || fileType.includes(type))) {
        setError(`Invalid file type. Please upload ${accept} files.`);
        setIsUploading(false);
        return;
      }
    }
    
    try {
      onFileUpload(file);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('An error occurred while processing the file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="flex justify-center">
          {isUploading ? (
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          ) : error ? (
            <AlertCircle className="h-12 w-12 text-destructive" />
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        
        {error ? (
          <div className="space-y-2">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-sm text-muted-foreground">
              Try again with a different file.
            </p>
          </div>
        ) : isUploading ? (
          <div className="space-y-2">
            <p className="font-medium">Processing file...</p>
            <p className="text-sm text-muted-foreground">
              This might take a moment.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-medium">
              Drop your file here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              {accept === '*' 
                ? 'Upload any file type' 
                : `Supports ${accept.split(',').join(', ')} files`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
