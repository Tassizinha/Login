import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegistroUsuariosComponent } from './registro-usuarios/registro-usuarios.component';

export const routes: Routes = [
    { path: 'register', component: RegistroUsuariosComponent},
    //add as rotas
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class appConfig { }
