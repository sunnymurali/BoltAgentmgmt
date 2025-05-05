import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentCardComponent } from '../agent-card/agent-card.component';
import { CreateAgentComponent } from '../create-agent/create-agent.component';
import { AgentService } from '../../services/agent.service';
import { Agent } from '../../models/agent.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AgentCardComponent, CreateAgentComponent],
  template: `
    <div class="home-container">
      <div *ngIf="!isCreatingAgent" class="agents-view fade-in">
        <div class="header">
          <h1>Your Agents</h1>
          <button class="create-button" (click)="showCreateAgent()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Create Agent
          </button>
        </div>
        
        <ng-container *ngIf="agents$ | async as agents">
          <div *ngIf="agents.length > 0" class="agents-grid">
            <app-agent-card 
              *ngFor="let agent of agents" 
              [agent]="agent"
              (onDelete)="deleteAgent($event)"
            ></app-agent-card>
          </div>
          
          <div *ngIf="agents.length === 0" class="empty-state">
            <div class="empty-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="12" fill="var(--primary-100)"/>
                <path d="M12 8V16M8 12H16" stroke="var(--primary-600)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h3>No agents created yet</h3>
              <p>Create your first agent to get started</p>
              <button class="create-empty-button" (click)="showCreateAgent()">Create Agent</button>
            </div>
          </div>
        </ng-container>
      </div>

      <app-create-agent 
        *ngIf="isCreatingAgent"
        (onSubmit)="createAgent($event)"
        (onCancel)="hideCreateAgent()"
      ></app-create-agent>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-6);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-8);
    }
    
    .create-button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background-color: var(--primary-600);
      color: white;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .create-button:hover {
      background-color: var(--primary-700);
    }
    
    .agents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
    
    .empty-content {
      text-align: center;
      max-width: 400px;
    }
    
    .empty-content h3 {
      margin: var(--space-4) 0 var(--space-2);
    }
    
    .empty-content p {
      color: var(--neutral-500);
      margin-bottom: var(--space-6);
    }
    
    .create-empty-button {
      background-color: var(--primary-600);
      color: white;
      padding: var(--space-3) var(--space-6);
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: background-color 0.2s;
      display: inline-block;
    }
    
    .create-empty-button:hover {
      background-color: var(--primary-700);
    }
    
    @media (max-width: 768px) {
      .agents-grid {
        grid-template-columns: 1fr;
      }
      
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-4);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  agents$!: Observable<Agent[]>;
  isCreatingAgent = false;

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.agents$ = this.agentService.getAgents();
  }

  showCreateAgent(): void {
    this.isCreatingAgent = true;
  }

  hideCreateAgent(): void {
    this.isCreatingAgent = false;
  }

  createAgent(agentData: {name: string, systemPrompt: string, model: string}): void {
    this.agentService.addAgent(agentData);
    this.hideCreateAgent();
  }

  deleteAgent(id: string): void {
    this.agentService.deleteAgent(id);
  }
}