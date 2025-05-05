import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Agent } from '../../models/agent.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="agent-card slide-up">
      <div class="agent-card-header">
        <h3>{{ agent.name }}</h3>
        <span class="agent-model">{{ agent.model }}</span>
      </div>
      <p class="agent-prompt">{{ truncatePrompt(agent.systemPrompt) }}</p>
      <div class="agent-footer">
        <span class="agent-date">Created {{ formatDate(agent.createdAt) }}</span>
        <button class="delete-button" (click)="onDelete.emit(agent.id)">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    .agent-card {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: var(--space-6);
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .agent-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    
    .agent-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }
    
    .agent-model {
      font-size: 0.875rem;
      color: var(--primary-600);
      background-color: var(--primary-50);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-weight: 500;
    }
    
    .agent-prompt {
      color: var(--neutral-600);
      margin-bottom: var(--space-4);
      flex: 1;
    }
    
    .agent-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-4);
      font-size: 0.875rem;
    }
    
    .agent-date {
      color: var(--neutral-500);
    }
    
    .delete-button {
      background-color: transparent;
      color: var(--error-500);
      font-size: 0.875rem;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      transition: background-color 0.2s;
    }
    
    .delete-button:hover {
      background-color: var(--neutral-100);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentCardComponent {
  @Input() agent!: Agent;
  @Output() onDelete = new EventEmitter<string>();

  truncatePrompt(prompt: string): string {
    return prompt.length > 120 ? prompt.substring(0, 120) + '...' : prompt;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  }
}