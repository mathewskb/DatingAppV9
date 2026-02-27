import { Component, inject, output, signal } from '@angular/core';
import { RegisterCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private accountService = inject(AccountService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  protected validatationErrors = signal<string[]>([]);


  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  
  constructor() {

    this.credentialsForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        displayName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmPassword: ['', [Validators.required, this.matchValues('password')]]
      });

    this.profileForm = this.formBuilder.group(
      {
        gender: ['male', Validators.required],
        dateOfBirth: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
      });

    // check validation if password changes again after confirm password is entered
      this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    });

  }

  getMaxDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prev => prev + 1);
    }
  }

  prevStep() {
    this.currentStep.update(prev => prev - 1);
  }

  cancel() {
    console.log('cancel called from register component');
    this.cancelRegister.emit(false);
  }

  matchValues(matchTo: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    }
  }


  register() {

    if (this.credentialsForm.valid && this.profileForm.valid) {

      const formData = {
        ...this.credentialsForm.value,
        ...this.profileForm.value
      };
      // console.log('Form Data : ', formData);

      this.accountService.register(formData).subscribe({
        next: response => {
          // console.log(response);
          this.router.navigateByUrl('/members');
          // this.cancel();
        },
        error: error => {
          console.log(error);
          this.validatationErrors.set(error);
        }
      });

    }

  }
}