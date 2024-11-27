import { Routes } from '@angular/router';
import { GestionComponent } from './pages/gestion/gestion.component';
import { VerificacionComponent } from './pages/verificacion/verificacion.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LoginComponent } from './pages/login/login.component';
import { MsalGuard } from '@azure/msal-angular';
import { AsistenciaComponent } from './pages/asistencia/asistencia.component';
import { TrabajadoresComponent } from './pages/trabajadores/trabajadores.component';
import { IngresoComponent } from './pages/ingreso/ingreso.component';
import { SalidaComponent } from './pages/salida/salida.component';
import { PersonalEmpresaComponent } from './pages/personal-empresa/personal-empresa.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: SidenavComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: 'gestion',
        component: GestionComponent,
        canActivate: [MsalGuard],
      },
      {
        path: 'verificacion',
        component: VerificacionComponent,
        canActivate: [MsalGuard],
      },
      {
        path: 'registro',
        component: RegistroComponent,
        canActivate: [MsalGuard],
      },
      {
        path: 'reportes',
        component: ReportesComponent,
        canActivate: [MsalGuard],
      },
      {
        path: 'asistencia',
        component: PersonalEmpresaComponent,
        canActivate: [MsalGuard],
      },
      {
         path: 'personal',
         component: PersonalEmpresaComponent,
         canActivate: [MsalGuard],
       },
      {
        path: 'ingreso',
        component: IngresoComponent,
      },
      {
        path: 'salida',
        component: SalidaComponent,
      },

      {
        path: 'trabajadores/:idFaena',
        component: TrabajadoresComponent,
        canActivate: [MsalGuard],
      },
    ],
  },
];
