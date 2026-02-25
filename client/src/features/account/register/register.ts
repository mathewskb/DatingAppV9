import { Component, inject, OnInit, output } from '@angular/core';
import { RegisterCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected registerForm: FormGroup = new FormGroup({});

  initializeForm() {
    this.registerForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        displayName: new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
        confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
      })
  }

  ngOnInit(): void {
    this.initializeForm();

    // check validation if password changes again after confirm password is entered
    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
    
  }

  matchValues(matchTo: string) : ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      
      const parent = control.parent;

      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;

      return control.value === matchValue ? null : { passwordMismatch : false };
    }
  }


register() {
  console.log(this.registerForm.value);

  // this.accountService.register(this.creds).subscribe({
  //   next: response => {
  //     console.log(response);
  //     this.cancel();
  //   },
  //   error: error => console.log(error)
  // })
}

cancel() {
  console.log('cancel called from register component');
  this.cancelRegister.emit(false);
}
}
