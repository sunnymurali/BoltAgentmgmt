import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './app/components/home/home.component';
import { AgentChatComponent } from './app/components/agent-chat/agent-chat.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'agent/:id', component: AgentChatComponent }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(ReactiveFormsModule)
  ]
}).catch(err => console.error(err));
