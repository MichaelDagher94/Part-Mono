export interface ExampleFormModel {
    email: string;
    passwords: {
      password: string;
      confirmPassword: string;
    };
    firstName: string;
    lastName: string;
    role: 'student' | 'teacher' | 'employee' | 'founder';
    source: boolean[];
    agree: boolean;
  }
  