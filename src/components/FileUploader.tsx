
import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, File } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileUpload: (file: File, parsedContent?: any) => void;
  accept?: string;
  maxSize?: number; // in MB
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload, 
  accept = '.docx,.txt', 
  maxSize = 10 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };
  
  const processFile = async (file: File) => {
    // Reset states
    setError(null);
    setIsSuccess(false);
    
    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!fileType || !accept.includes(`.${fileType}`)) {
      setError(`Invalid file type. Please upload ${accept} files only.`);
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      return;
    }
    
    // Set the file and begin upload simulation
    setFile(file);
    simulateUpload(file);
  };
  
  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setIsSuccess(true);
            onFileUpload(file);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  return (
    <div className="w-full">
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-all duration-200 text-center cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50",
          error ? "border-destructive/50 bg-destructive/5" : "",
          isSuccess ? "border-green-500/50 bg-green-500/5" : ""
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input 
          id="file-input"
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isSuccess ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : error ? (
            <AlertCircle className="h-16 w-16 text-destructive" />
          ) : file ? (
            <File className="h-16 w-16 text-primary" />
          ) : (
            <UploadCloud className="h-16 w-16 text-muted-foreground" />
          )}
          
          <div className="space-y-2">
            {isSuccess ? (
              <p className="text-lg font-medium text-green-600">File uploaded successfully!</p>
            ) : error ? (
              <p className="text-lg font-medium text-destructive">{error}</p>
            ) : file ? (
              <p className="text-lg font-medium">{file.name}</p>
            ) : (
              <>
                <p className="text-lg font-medium">
                  Drag and drop your file here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports {accept.replace(/\./g, '')} (Max {maxSize}MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {isUploading && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Uploading...</span>
            <span className="text-sm font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      {file && !isUploading && !error && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{file.name}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
