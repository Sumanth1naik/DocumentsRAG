import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models';
import { RagApiService } from '../../services/rag-api.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [];
  userInput: string = '';
  sessionId: string = '';
  isLoading = false;
  showSources = false;
  selectedMessage: Message | null = null;
  shouldScroll = false;

  constructor(private ragApiService: RagApiService) {
    this.sessionId = UtilService.generateId();
  }

  ngOnInit(): void {
    this.addSystemMessage('👋 Welcome to DocumentsRAG Chat! Upload documents and start asking questions.');
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) {
      return;
    }

    const userMessage = this.userInput.trim();
    this.userInput = '';

    // Add user message to chat
    this.addMessage(userMessage, 'user');
    this.shouldScroll = true;

    // Add loading indicator
    const loadingMessage: Message = {
      id: UtilService.generateId(),
      text: '',
      sender: 'assistant',
      timestamp: new Date(),
      isLoading: true
    };
    this.messages.push(loadingMessage);
    this.isLoading = true;
    this.shouldScroll = true;

    // Send to API
    this.ragApiService.chat(this.sessionId, userMessage).subscribe({
      next: (response) => {
        // Remove loading message
        const loadingIndex = this.messages.findIndex(m => m.isLoading);
        if (loadingIndex !== -1) {
          this.messages.splice(loadingIndex, 1);
        }

        // Add assistant message
        this.addMessage(response.answer, 'assistant', response.sources);
        this.isLoading = false;
        this.shouldScroll = true;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        const loadingIndex = this.messages.findIndex(m => m.isLoading);
        if (loadingIndex !== -1) {
          this.messages.splice(loadingIndex, 1);
        }

        const errorMessage = error?.error?.detail || 'Error sending message. Please try again.';
        this.addMessage(`❌ ${errorMessage}`, 'assistant');
        this.isLoading = false;
        this.shouldScroll = true;
      }
    });
  }

  private addMessage(text: string, sender: 'user' | 'assistant', sources?: any[]): void {
    const message: Message = {
      id: UtilService.generateId(),
      text,
      sender,
      timestamp: new Date(),
      sources: sources || []
    };
    this.messages.push(message);
  }

  private addSystemMessage(text: string): void {
    this.addMessage(text, 'assistant');
  }

  toggleSources(message: Message): void {
    if (this.selectedMessage?.id === message.id) {
      this.selectedMessage = null;
    } else {
      this.selectedMessage = message;
    }
  }

  clearChat(): void {
    if (confirm('Clear all messages?')) {
      this.messages = [];
      this.sessionId = UtilService.generateId();
      this.addSystemMessage('Chat cleared. Start a new conversation!');
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
