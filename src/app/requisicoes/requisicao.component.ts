import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable} from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
})
export class RequisicaoComponent implements OnInit {

  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public funcionarioLogado: Funcionario;
  public form: FormGroup;

  constructor(private requisicaoService: RequisicaoService, private departamentoService: DepartamentoService, private equipamentoService: EquipamentoService, private funcionarioService: FuncionarioService,
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.requisicoes$ = this.requisicaoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.obterFuncionarioLogado();

    this.form = this.fb.group({

      id: new FormControl(""),
      descricao: new FormControl(""),
      dataAbertura: new FormControl(""),
      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),
      departamentoId: new FormControl(""),
      departamento: new FormControl(""),
      equipamentoId: new FormControl(""),
      equipamento: new FormControl(""),

    })




  }
  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }
  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get descricao(): AbstractControl | null {
    return this.form.get("descricao");
  }

  get dataAbertura(): AbstractControl | null {
    return this.form.get("dataAbertura");
  }
  get solicitanteId(): AbstractControl | null {
    return this.form.get("solicitanteId");
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get("departamentoId");
  }
  get equipamentoId(): AbstractControl | null {
    return this.form.get("equipamentoId");
  }


  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {

    this.form.reset();

    if (requisicao)
    {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;
      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento
      }
      this.form.get("requisicao")?.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (requisicao) {
          await this.requisicaoService.editar(this.form.get("requisicao")?.value);
          this.toastrService.success('Requisicao!', 'Requisicao!', {
            timeOut: 6000,
            progressBar: true,
            positionClass: 'toast-bottom-right'
          });
        }
        else {


          console.log(this.funcionarioLogado);
          this.form.get("dataAbertura")?.setValue(new Date(Date.now()).toDateString());
          this.form.get("funcionario")?.setValue(this.funcionarioLogado);
          this.form.get("funcionarioId")?.setValue(this.funcionarioLogado.id);

          await this.requisicaoService.inserir(this.form.value) // caso contrario, é inserido um departamento novo

          this.toastrService.success('O requisicao foi salvo com Sucesso!', 'Nova requisicao'+ this.form.value.nome + '!', {
            timeOut: 6000,
            progressBar: true,
            positionClass: 'toast-bottom-right'
          });
        }
      }else{
        this.toastrService.error('O Formulario deve ser preenchido!', 'Falha ao Inserir Novo Funcionario!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });

      }


    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error('Houve um erro ao inserir um novo Funcionario!', 'Falha ao Inserir Novo Funcionario!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    }
  }

  public async excluir(modalExcluir: TemplateRef<any>, requisicao: Requisicao) {
    if (requisicao)
    {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;
      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento
      }
      this.form.get("requisicao")?.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modalExcluir).result;


      await this.requisicaoService.excluir(requisicao);

      this.toastrService.info('O requisicao foi excluido com Sucesso!', 'requisicao!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error('Houve um erro ao excluir a requisicao!', 'Falha ao Excluir!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    }

  }


  private obterFuncionarioLogado(){
    this.authService.usuarioLogado
      .subscribe(dados =>{
        this.funcionarioService.selecionarFuncionarioLogado(dados?.email!) 
          .subscribe(funcionario => {
            this.funcionarioLogado = funcionario;
          })
      })
  }


 private obterRequisiçõesFuncionario(){
    this.requisicoes$ = this.requisicaoService.selecionarTodos()
      .pipe(
        map(requisicoes =>{
          return requisicoes.filter(r => r.funcionario?.email === this.funcionarioLogado.email);
        })
      )

  }

}
