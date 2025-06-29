import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { ExampleFormModel } from './example-form.model';
import { equalValues } from './example-form.validators';

@Component({
  selector: 'app-example-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './example-form.component.html',
  styleUrls: ['./example-form.component.css'],
})
export class ExampleFormComponent {
  exampleForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),

    passwords: new FormGroup(
      {
        password: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      { validators: [equalValues] }
    ),

    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder'>(
      'student',
      {
        nonNullable: true,
        validators: [Validators.required],
      }
    ),

    source: new FormArray<FormControl<boolean>>([
      new FormControl<boolean>(false, { nonNullable: true }),
      new FormControl<boolean>(false, { nonNullable: true }),
      new FormControl<boolean>(false, { nonNullable: true }),
    ]),

    agree: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onResetExampleForm() {
    this.exampleForm.reset();
  }

  onSubmitExampleForm() {
    if (this.exampleForm.invalid) {
      return;
    }
    
    const formValue: ExampleFormModel = this.exampleForm.getRawValue();
    console.log('Submitted Form Value:', formValue);

  }
}
