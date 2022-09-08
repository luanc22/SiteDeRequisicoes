import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartamentoComponent } from '../departamentos/departamento.component';
import { FuncionarioComponent } from './funcionario.component';

const routes: Routes = [
  {path:"", component: FuncionarioComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionarioRoutingModule { }
