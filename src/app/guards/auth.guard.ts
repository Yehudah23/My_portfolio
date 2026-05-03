import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ApiService } from '../services/api.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  return apiService.checkAuth().pipe(
    map((response) => {
      if (response.authenticated) {
        return true;
      } else {
        router.navigate(['/admin/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/admin/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return of(false);
    })
  );
};
