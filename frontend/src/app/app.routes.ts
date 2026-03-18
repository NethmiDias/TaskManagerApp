import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/task-list/task-list.page').then((m) => m.TaskListPage)
  },
  {
    path: 'tasks/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/task-form/task-form.page').then((m) => m.TaskFormPage)
  },
  {
    path: 'tasks/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/task-form/task-form.page').then((m) => m.TaskFormPage)
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
];
