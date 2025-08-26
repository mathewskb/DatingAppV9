import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  
  const accountService = inject(AccountService);
  const toast = inject(ToastService);

  if (accountService.currentUser()) return true;
  else {
    toast.error('You are not allowed to navigate this link');
    return false;
  }

};
