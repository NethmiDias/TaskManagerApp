import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const message =
          (typeof err.error === 'object' && err.error?.message) ||
          (typeof err.error === 'string' && err.error) ||
          err.message ||
          'Request failed';
        return throwError(() => new Error(message));
      }
      return throwError(() => new Error('Request failed'));
    })
  );

