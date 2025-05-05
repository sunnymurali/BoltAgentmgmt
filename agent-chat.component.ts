import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../services/agent.service';
import { Agent } from '../../models/agent.model';

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="sidebar">
        <div class="documents-section">
          <h3>Documents</h3>
          <div class="upload-area" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
            <input
              type="file"
              #fileInput
              (change)="onFileSelected($event)"
              style="display: none"
              multiple
            >
            <button class="upload-button" (click)="fileInput.click()">
              Upload Documents
            </button>
            <p class="upload-text">or drag and drop files here</p>
          </div>
          <div class="document-list">
            <div *ngFor="let doc of documents" class="document-item">
              <span>{{ doc.name }}</span>
              <button class="delete-doc" (click)="removeDocument(doc)">×</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-main">
        <div class="chat-header">
          <h2>{{ agent?.name }}</h2>
          <span class="model-badge">{{ agent?.model }}</span>
        </div>
        
        <div class="messages-container" #messagesContainer>
          <div *ngFor="let message of messages" class="message" [ngClass]="message.sender">
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
        
        <div class="chat-input">
          <textarea
            [(ngModel)]="currentMessage"
            (keydown.enter)="sendMessage($event as KeyboardEvent)"
            placeholder="Type your message..."
            rows="3"
          ></textarea>
          <button class="send-button" (click)="sendMessage()">Send</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      height: calc(100vh - 65px);
      background-color: white;
    }
    
    .sidebar {
      width: 300px;
      border-right: 1px solid var(--neutral-200);
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
    }
    
    .documents-section {
      margin-bottom: var(--space-6);
    }
    
    .documents-section h3 {
      margin-bottom: var(--space-4);
    }
    
    .upload-area {
      border: 2px dashed var(--neutral-300);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      text-align: center;
      margin-bottom: var(--space-4);
      transition: border-color 0.2s;
    }
    
    .upload-area.drag-over {
      border-color: var(--primary-500);
      background-color: var(--primary-50);
    }
    
    .upload-button {
      background-color: var(--primary-600);
      color: white;
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-2);
    }
    
    .upload-text {
      color: var(--neutral-500);
      font-size: 0.875rem;
    }
    
    .document-list {
      margin-top: var(--space-4);
    }
    
    .document-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-2) var(--space-3);
      background-color: var(--neutral-50);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-2);
      font-size: 0.875rem;
    }
    
    .delete-doc {
      color: var(--error-500);
      background: none;
      padding: var(--space-1);
    }
    
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .chat-header {
      padding: var(--space-4);
      border-bottom: 1px solid var(--neutral-200);
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    
    .model-badge {
      background-color: var(--primary-50);
      color: var(--primary-600);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .messages-container {
      flex: 1;
      padding: var(--space-4);
      overflow-y: auto;
    }
    
    .message {
      margin-bottom: var(--space-4);
      max-width: 80%;
    }
    
    .message.user {
      margin-left: auto;
    }
    
    .message-content {
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      background-color: var(--neutral-100);
    }
    
    .message.user .message-content {
      background-color: var(--primary-600);
      color: white;
    }
    
    .chat-input {
      padding: var(--space-4);
      border-top: 1px solid var(--neutral-200);
      display: flex;
      gap: var(--space-3);
    }
    
    .chat-input textarea {
      flex: 1;
      resize: none;
      padding: var(--space-3);
    }
    
    .send-button {
      background-color: var(--primary-600);
      color: white;
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      align-self: flex-end;
    }
    
    .send-button:hover {
      background-color: var(--primary-700);
    }
  `]
})
export class AgentChatComponent implements OnInit {
  agent: Agent | undefined;
  currentMessage = '';
  messages: Array<{content: string, sender: 'user' | 'agent'}> = [];
  documents: Array<{name: string, content: string}> = [];

  constructor(
    private route: ActivatedRoute,
    private agentService: AgentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.agentService.getAgents().subscribe(agents => {
        this.agent = agents.find(a => a.id === id);
      });
    }
  }

  sendMessage(event?: KeyboardEvent) {
    if (event) {
      event.preventDefault();
    }
    
    if (this.currentMessage.trim()) {
      this.messages.push({
        content: this.currentMessage,
        sender: 'user'
      });
      
      // Simulate agent response
      setTimeout(() => {
        this.messages.push({
          content: 'This is a simulated response from the agent.',
          sender: 'agent'
        });
      }, 1000);
      
      this.currentMessage = '';
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.target as HTMLElement;
