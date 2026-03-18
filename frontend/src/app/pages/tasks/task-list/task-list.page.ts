import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task, TaskStatus } from '../../../models/task';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './task-list.page.html',
  styleUrl: './task-list.page.scss'
})
export class TaskListPage {
  private readonly tasksApi = inject(TaskService);
  private readonly snack = inject(MatSnackBar);

  readonly isLoading = signal(false);
  readonly tasks = signal<Task[]>([]);
  readonly statusFilter = signal<TaskStatus | 'ALL'>('ALL');

  readonly filteredTasks = computed(() => {
    const filter = this.statusFilter();
    const all = this.tasks();
    return filter === 'ALL' ? all : all.filter((t) => t.status === filter);
  });

  readonly displayedColumns = ['title', 'status', 'createdAt', 'actions'];

  constructor() {
    void this.load();
  }

  async load() {
    this.isLoading.set(true);
    try {
      const data = await this.tasksApi.getAll();
      // newest first
      this.tasks.set([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e: unknown) {
      this.snack.open(e instanceof Error ? e.message : 'Failed to load tasks', 'Close', {
        duration: 4000
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteTask(task: Task) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    try {
      await this.tasksApi.delete(task.id);
      this.tasks.set(this.tasks().filter((t) => t.id !== task.id));
      this.snack.open('Task deleted', 'Close', { duration: 2000 });
    } catch (e: unknown) {
      this.snack.open(e instanceof Error ? e.message : 'Failed to delete task', 'Close', {
        duration: 4000
      });
    }
  }
}

