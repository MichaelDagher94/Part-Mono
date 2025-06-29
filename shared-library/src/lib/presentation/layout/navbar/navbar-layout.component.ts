import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  standalone: true,
  selector: 'lib-layout-navbar',
  imports: [MatTabsModule,RouterLink, RouterLinkActive],
  templateUrl: './navbar-layout.component.html',
  styleUrls: ['./navbar-layout.component.scss']
})
export class NavbarLayoutComponent {
  @Input() navLinks: NavLink[] = [
    { label: 'Home', path: '/home' },
    { label: 'Logs', path: '/logs' },
    { label: 'Users', path: '/users' }
  ];
  title = 'App';
}
