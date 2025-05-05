import { Component } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="logo">AgentCraft</div>
        <nav class="main-nav">
          <a href="#" class="nav-link active">Agents</a>
          <a href="#" class="nav-link">Documentation</a>
          <a href="#" class="nav-link">Settings</a>
        </nav>
      </header>
      
      <main>
        <app-home></app-home>
      </main>
      
      <footer class="app-footer">
        <p>© 2025 AgentCraft. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) var(--space-6);
      background-color: white;
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .logo {
      font-weight: 600;
      font-size: 1.25rem;
      color: var(--primary-600);
    }
    
    .main-nav {
      display: flex;
      gap: var(--space-6);
    }
    
    .nav-link {
      color: var(--neutral-600);
      text-decoration: none;
      font-weight: 500;
      padding: var(--space-2) var(--space-1);
      border-radius: var(--radius-md);
      transition: color 0.2s;
    }
    
    .nav-link:hover {
      color: var(--primary-600);
    }
    
    .nav-link.active {
      color: var(--primary-600);
      position: relative;
    }
    
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--primary-600);
      border-radius: 2px;
    }
    
    main {
      flex: 1;
    }
    
    .app-footer {
      background-color: white;
      border-top: 1px solid var(--neutral-200);
      padding: var(--space-4) var(--space-6);
      text-align: center;
      color: var(--neutral-500);
      font-size: 0.875rem;
    }
    
    @media (max-width: 768px) {
      .app-header {
        flex-direction: column;
        gap: var(--space-4);
        padding: var(--space-4);
      }
      
      .main-nav {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class App {
  name = 'AgentCraft';
}