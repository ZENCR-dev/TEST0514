import React, { useState, useRef } from 'react';
import { Upload, X, FileIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateFile } from '@/services/fileUploadService';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  error?: string;
  value?: File | null;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = "image/jpeg,image/png,application/pdf",
  maxSizeMB = 5,
  label = "选择文件",
  error,
  value,
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(value || null);
  const [fileError, setFileError] = useState<string | null>(error || null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  // 验证文件并设置
  const validateAndSetFile = (file: File) => {
    // 执行文件验证
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setFileError(validation.error ?? null);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }
    
    setFileError(null);
    setSelectedFile(file);
    onFileSelect(file);
  };

  // 移除选中文件
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // 处理拖动事件
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // 处理拖放事件
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // 处理点击上传区域
  const handleClick = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.click();
    }
  };

  // 获取文件图标和类型文本
  const getFileTypeDisplay = () => {
    if (!selectedFile) return { icon: <FileIcon />, text: '' };
    
    if (selectedFile.type.startsWith('image/')) {
      return { 
        icon: (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={URL.createObjectURL(selectedFile)} 
            alt="Preview" 
            className="w-8 h-8 object-cover rounded" 
          />
        ),
        text: '图片'
      };
    }
    
    if (selectedFile.type === 'application/pdf') {
      return { icon: <FileIcon className="text-red-500" />, text: 'PDF' };
    }
    
    return { icon: <FileIcon />, text: '文件' };
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const fileTypeDisplay = getFileTypeDisplay();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
        />
        
        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {fileTypeDisplay.icon}
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {fileTypeDisplay.text} • {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="text-gray-500 hover:text-gray-700"
              disabled={disabled}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-primary/10 rounded-full p-3 mb-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">
              拖放文件到此处或点击上传
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              支持 {accept.split(',').map(type => type.split('/')[1]).join(', ')} 格式，最大 {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      
      {(fileError || error) && (
        <p className="mt-1 text-xs text-red-500">{fileError || error}</p>
      )}
      
      {selectedFile && !fileError && (
        <div className="mt-1 flex items-center text-xs text-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          <span>文件已选择</span>
        </div>
      )}
    </div>
  );
} 