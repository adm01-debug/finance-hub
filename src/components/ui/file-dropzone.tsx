import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  File,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileArchive,
  X,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface FileWithPreview extends File {
  preview?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface FileDropzoneProps {
  /** Arquivos aceitos (ex: '.pdf,.xlsx') ou MIME (ex: 'image/*') */
  accept?: string;
  /** Múltiplos arquivos */
  multiple?: boolean;
  /** Tamanho máximo em bytes */
  maxSize?: number;
  /** Máximo de arquivos */
  maxFiles?: number;
  /** Callback ao selecionar arquivos */
  onFilesSelected?: (files: File[]) => void;
  /** Callback ao remover arquivo */
  onFileRemoved?: (file: File, index: number) => void;
  /** Callback de upload */
  onUpload?: (file: File) => Promise<void>;
  /** Arquivos atuais */
  files?: FileWithPreview[];
  /** Disabled */
  disabled?: boolean;
  /** Variante */
  variant?: 'default' | 'compact' | 'inline';
  /** Classes adicionais */
  className?: string;
}

// =============================================================================
// FILE DROPZONE
// =============================================================================

export function FileDropzone({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  onFilesSelected,
  onFileRemoved,
  onUpload,
  files = [],
  disabled = false,
  variant = 'default',
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFiles = (fileList: FileList): File[] => {
    const validFiles: File[] = [];
    let errorMsg: string | null = null;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Check max files
      if (files.length + validFiles.length >= maxFiles) {
        errorMsg = `Máximo de ${maxFiles} arquivos`;
        break;
      }

      // Check size
      if (file.size > maxSize) {
        errorMsg = `Arquivo muito grande. Máximo: ${formatFileSize(maxSize)}`;
        continue;
      }

      // Check type if accept is specified
      if (accept) {
        const acceptTypes = accept.split(',').map((t) => t.trim());
        const isValid = acceptTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', ''));
          }
          return file.type === type;
        });

        if (!isValid) {
          errorMsg = 'Tipo de arquivo não permitido';
          continue;
        }
      }

      validFiles.push(file);
    }

    setError(errorMsg);
    return validFiles;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const validFiles = validateFiles(e.dataTransfer.files);
    if (validFiles.length > 0) {
      onFilesSelected?.(validFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        onFilesSelected?.(validFiles);
      }
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={className}>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={handleClick}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Selecionar arquivo
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((file, index) => (
              <FileItem
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => onFileRemoved?.(file, index)}
                compact
              />
            ))}
          </div>
        )}
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={handleClick}
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        {files.length > 0 && (
          <Badge variant="secondary">{files.length} arquivo(s)</Badge>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? 'hsl(var(--primary))' : 'hsl(var(--border))',
          backgroundColor: isDragging ? 'hsl(var(--primary) / 0.05)' : 'transparent',
        }}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          'hover:border-primary hover:bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4"
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
        </motion.div>

        <p className="text-sm font-medium">
          Arraste arquivos aqui ou <span className="text-primary">clique para selecionar</span>
        </p>

        <p className="text-xs text-muted-foreground mt-2">
          {accept ? `Formatos aceitos: ${accept}` : 'Qualquer formato'}
          {maxSize && ` · Máximo ${formatFileSize(maxSize)}`}
          {multiple && maxFiles && ` · Até ${maxFiles} arquivos`}
        </p>

        {error && (
          <p className="text-xs text-destructive mt-2 flex items-center justify-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <FileItem
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => onFileRemoved?.(file, index)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// FILE ITEM
// =============================================================================

function FileItem({
  file,
  onRemove,
  compact = false,
}: {
  file: FileWithPreview;
  onRemove: () => void;
  compact?: boolean;
}) {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage;
    if (type.startsWith('video/')) return FileVideo;
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return FileSpreadsheet;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileText;
    if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return FileArchive;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const FileIcon = getFileIcon(file.type);
  const isUploading = file.status === 'uploading';
  const isComplete = file.status === 'complete';
  const isError = file.status === 'error';

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="truncate flex-1">{file.name}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 p-3 border rounded-lg bg-card"
    >
      {/* Preview or Icon */}
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
        {file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <FileIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>

        {/* Progress bar */}
        {isUploading && file.progress !== undefined && (
          <Progress value={file.progress} className="h-1 mt-1" />
        )}

        {/* Error message */}
        {isError && file.error && (
          <p className="text-xs text-destructive mt-1">{file.error}</p>
        )}
      </div>

      {/* Status/Actions */}
      <div className="shrink-0 flex items-center gap-2">
        {isUploading && (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        )}
        {isComplete && (
          <Check className="h-4 w-4 text-success" />
        )}
        {isError && (
          <AlertCircle className="h-4 w-4 text-destructive" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// =============================================================================
// IMAGE DROPZONE (with preview)
// =============================================================================

export function ImageDropzone({
  value,
  onChange,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  aspectRatio = 'square',
  className,
}: {
  value?: string;
  onChange: (file: File | null, preview: string | null) => void;
  accept?: string;
  maxSize?: number;
  aspectRatio?: 'square' | 'video' | 'banner';
  className?: string;
}) {
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[3/1]',
  };

  const handleFile = (file: File) => {
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onChange(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg overflow-hidden',
        aspectClasses[aspectRatio],
        isDragging && 'border-primary bg-primary/5',
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              Trocar
            </Button>
            <Button size="sm" variant="destructive" onClick={handleRemove}>
              Remover
            </Button>
          </div>
        </>
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Clique ou arraste uma imagem
          </p>
          {error && (
            <p className="text-xs text-destructive mt-1">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
