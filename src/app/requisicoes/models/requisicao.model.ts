import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";

export class Requisicao{
  id:string;
  descricao:string;
  dataAbertura: any;

  equipamentoId?:string | null;
  equipamento?:Equipamento;

  departamentoId: string;
  departamento?: Departamento;

  funcionarioId:string;
  funcionario?: Funcionario;

}
