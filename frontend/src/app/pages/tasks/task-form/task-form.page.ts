import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskStatus } from '../../../models/task';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-form-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './task-form.page.html',
  styleUrl: './task-form.page.scss'
})
export class TaskFormPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tasksApi = inject(TaskService);
  private readonly snack = inject(MatSnackBar);

  readonly isSubmitting = signal(false);
  readonly isLoading = signal(false);

  readonly taskId = signal<number | null>(null);

  readonly statuses: TaskStatus[] = ['TO_DO', 'IN_PROGRESS', 'DONE'];

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(2000)]],
    status: this.fb.nonNullable.control<TaskStatus>('TO_DO', [Validators.required])
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!Number.isNaN(id)) {
        this.taskId.set(id);
        void this.load(id);
      }
    }
  }

  get isEdit(): boolean {
    return this.taskId() !== null;
  }

  async load(id: number) {
    this.isLoading.set(true);
    try {
      const task = await this.tasksApi.getById(id);
      this.form.patchValue({
        title: task.title,
        description: task.description ?? '',
        status: task.status
      });
    } catch (e: unknown) {
      this.snack.open(e instanceof Error ? e.message : 'Failed to load task', 'Close', {
        duration: 4000
      });
      await this.router.navigateByUrl('/tasks');
    } finally {
      this.isLoading.set(false);
    }
  }

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    try {
      const { title, description, status } = this.form.getRawValue();
      const payload = {
        title: title.trim(),
        description: description?.trim() ? description.trim() : null,
        status
      };

      if (this.isEdit) {
        await this.tasksApi.update(this.taskId()!, payload);
        this.snack.open('Task updated', 'Close', { duration: 2000 });
      } else {
        await this.tasksApi.create(payload);
        this.snack.open('Task created', 'Close', { duration: 2000 });
      }

      await this.router.navigateByUrl('/tasks');
    } catch (e: unknown) {
      this.snack.open(e instanceof Error ? e.message : 'Save failed', 'Close', { duration: 4000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

