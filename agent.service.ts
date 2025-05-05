import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Agent } from '../models/agent.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private agents: Agent[] = [
    {
      id: '1',
      name: 'Research Assistant',
      systemPrompt: 'You are a helpful research assistant. Provide accurate information and cite sources.',
      model: 'GPT-4',
      createdAt: new Date('2023-09-15')
    },
    {
      id: '2',
      name: 'Code Helper',
      systemPrompt: 'You are a coding assistant. Help with programming questions and provide code examples.',
      model: 'Claude-3',
      createdAt: new Date('2023-10-20')
    },
    {
      id: '3',
      name: 'Travel Planner',
      systemPrompt: 'You are a travel planning assistant. Help users plan their trips with recommendations.',
      model: 'GPT-4',
      createdAt: new Date('2023-11-05')
    }
  ];

  private agentsSubject = new BehaviorSubject<Agent[]>(this.agents);

  getAgents(): Observable<Agent[]> {
    return this.agentsSubject.asObservable();
  }

  addAgent(agent: Omit<Agent, 'id' | 'createdAt'>): void {
    const newAgent: Agent = {
      ...agent,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    this.agents = [...this.agents, newAgent];
    this.agentsSubject.next(this.agents);
  }

  deleteAgent(id: string): void {
    this.agents = this.agents.filter(agent => agent.id !== id);
    this.agentsSubject.next(this.agents);
  }
}