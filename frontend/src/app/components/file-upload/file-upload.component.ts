import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RagApiService } from '../../services/rag-api.service';
import { UploadProgress } from '../../models';

interface UploadedFile {
  name: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
  timestamp: Date;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  isDragover = false;
  uploadedFiles: UploadedFile[] = [];
  isUploading = false;
  totalUploadProgress = 0;

  constructor(private ragApiService: RagApiService) {
    this.ragApiService.getUploadProgress$().subscribe((progress: UploadProgress) => {
      this.totalUploadProgress = progress.percentage;
    });
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(files: FileList): void {
    const validFiles: File[] = [];
    const supportedTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (supportedTypes.includes(file.type) || this.isValidFileType(file.name)) {
        validFiles.push(file);
      } else {
        this.addUploadedFile(file.name, 'error', 0, 'Unsupported file type');
      }
    }

    validFiles.forEach(file => this.uploadFile(file));
  }

  private isValidFileType(filename: string): boolean {
    const extensions = ['.pdf', '.txt', '.docx', '.doc'];
    return extensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  private uploadFile(file: File): void {
    const fileRecord = this.addUploadedFile(file.name, 'pending');
    this.isUploading = true;

    this.ragApiService.uploadFile(file).subscribe({
      next: (event: any) => {
        if (event.percentage !== undefined) {
          fileRecord.progress = event.percentage;
        } else if (event.message) {
          fileRecord.status = 'success';
          fileRecord.progress = 100;
          setTimeout(() => {
            this.isUploading = false;
          }, 1000);
        }
      },
      error: (error) => {
        fileRecord.status = 'error';
        fileRecord.error = error?.error?.detail || 'Upload failed';
        this.isUploading = false;
      }
    });
  }

  private addUploadedFile(
    name: string,
    status: 'pending' | 'uploading' | 'success' | 'error',
    progress: number = 0,
    error?: string
  ): UploadedFile {
    const file: UploadedFile = {
      name,
      status,
      progress,
      error,
      timestamp: new Date()
    };
    this.uploadedFiles.unshift(file);
    return file;
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  clearAll(): void {
    this.uploadedFiles = [];
    this.totalUploadProgress = 0;
  }

  getSuccessfulCount(): number {
    return this.uploadedFiles.filter(f => f.status === 'success').length;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getStatusIcon(status: string, progress?: number): string {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'uploading':
      case 'pending':
        return '⏳';
      default:
        return '';
    }
  }
}
