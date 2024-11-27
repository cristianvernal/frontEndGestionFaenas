import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { MenuItemComponent } from '../menu-item/menu-item.component';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
  subItems?: MenuItem[];
};

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MenuItemComponent,
  ],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.css',
})
export class CustomSidenavComponent {
  constructor(private route: Router, private authService: MsalService) {}

  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'extension',
      label: 'Gestión',
      route: 'gestion',
    },
    {
      icon: 'mail',
      label: 'Verificación',
      route: 'verificacion',
    },
    {
      icon: 'person_add',
      label: 'Registro',
      route: 'registro',
    },
    {
      icon: 'skip_next',
      label: 'Ingreso Faena',
      route: 'ingreso',
    },
    {
      icon: 'skip_previous',
      label: 'Salida Faena',
      route: 'salida',
    },
    {
      icon: 'assignment',
      label: 'Reportes',
      route: 'reportes',
    },
    {
      icon: 'person_pin',
      label: 'Trabajadores',
      route: 'personal',
    },
  ]);

  profilePicSize = computed(() => (this.sideNavCollapsed() ? '30' : '100'));

  logout() {
    this.authService.logoutPopup({
      mainWindowRedirectUri: 'login',
    });
  }
}
