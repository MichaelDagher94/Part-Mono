import { Component, input, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'lib-layout-header',
  standalone: true,
  imports: [
    MatToolbarModule
  ],
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.css']
})
export class HeaderLayoutComponent {
  title=signal('');
  constructor() {    
  }
}
