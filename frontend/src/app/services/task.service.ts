import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG } from '../core/config/app-config';
import { Task, TaskCreateRequest, TaskUpdateRequest } from '../models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);

  getAll(): Promise<Task[]> {
    return firstValueFrom(this.http.get<Task[]>(`${APP_CONFIG.apiBaseUrl}/tasks`));
  }

  getById(id: number): Promise<Task> {
    return firstValueFrom(this.http.get<Task>(`${APP_CONFIG.apiBaseUrl}/tasks/${id}`));
  }

  create(req: TaskCreateRequest): Promise<Task> {
    return firstValueFrom(this.http.post<Task>(`${APP_CONFIG.apiBaseUrl}/tasks`, req));
  }

  update(id: number, req: TaskUpdateRequest): Promise<Task> {
    return firstValueFrom(this.http.put<Task>(`${APP_CONFIG.apiBaseUrl}/tasks/${id}`, req));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${APP_CONFIG.apiBaseUrl}/tasks/${id}`));
  }
}

