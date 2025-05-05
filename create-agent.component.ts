import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-agent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="create-agent-container fade-in">
      <div class="header">
        <button class="back-button" (click)="onCancel.emit()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        <h2>Create Agent</h2>
      </div>

      <form [formGroup]="agentForm" (ngSubmit)="submitForm()" class="slide-up">
        <div class="form-field">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            formControlName="name" 
            placeholder="E.g., Research Assistant"
            [class.error]="isFieldInvalid('name')"
          >
          <p class="error-message" *ngIf="isFieldInvalid('name')">Name is required</p>
        </div>

        <div class="form-field">
          <label for="systemPrompt">System prompt</label>
          <textarea 
            id="systemPrompt" 
            formControlName="systemPrompt" 
            rows="5" 
            placeholder="Describe what your agent should do..."
            [class.error]="isFieldInvalid('systemPrompt')"
          ></textarea>
          <p class="error-message" *ngIf="isFieldInvalid('systemPrompt')">System prompt is required</p>
        </div>

        <div class="form-field">
          <label for="model">Model</label>
          <select 
            id="model" 
            formControlName="model"
            [class.error]="isFieldInvalid('model')"
          >
            <option value="">Select a model</option>
            <option value="GPT-4">GPT-4</option>
            <option value="GPT-3.5">GPT-3.5</option>
            <option value="Claude-3">Claude-3</option>
            <option value="Llama-3">Llama-3</option>
          </select>
          <p class="error-message" *ngIf="isFieldInvalid('model')">Model is required</p>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" (click)="onCancel.emit()">Cancel</button>
          <button type="submit" class="submit-button" [disabled]="agentForm.invalid">Create Agent</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .create-agent-container {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: var(--space-8);
      max-width: 650px;
      width: 100%;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: var(--space-6);
      position: relative;
    }

    .header h2 {
      margin: 0 auto;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: transparent;
      color: var(--neutral-600);
      font-size: 0.875rem;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      position: absolute;
      left: 0;
      transition: background-color 0.2s;
    }

    .back-button:hover {
      background-color: var(--neutral-100);
      color: var(--neutral-800);
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-field {
      margin-bottom: var(--space-6);
    }

    .error {
      border-color: var(--error-500);
    }

    .error-message {
      color: var(--error-500);
      font-size: 0.875rem;
      margin-top: var(--space-2);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-4);
    }

    .cancel-button {
      background-color: var(--neutral-100);
      color: var(--neutral-700);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .cancel-button:hover {
      background-color: var(--neutral-200);
    }

    .submit-button {
      background-color: var(--primary-600);
      color: white;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .submit-button:hover:not(:disabled) {
      background-color: var(--primary-700);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAgentComponent {
  agentForm: FormGroup;
  @Output() onSubmit = new EventEmitter<{name: string, systemPrompt: string, model: string}>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.agentForm = this.fb.group({
      name: ['', [Validators.required]],
      systemPrompt: ['', [Validators.required]],
      model: ['', [Validators.required]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.agentForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submitForm(): void {
    if (this.agentForm.valid) {
      this.onSubmit.emit(this.agentForm.value);
      this.agentForm.reset();
    } else {
      this.agentForm.markAllAsTouched();
    }
  }
}