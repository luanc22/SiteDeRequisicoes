import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
})
export class FuncionarioComponent implements OnInit {

  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(private funcionarioService: FuncionarioService, private departamentoService: DepartamentoService,
    private router:Router,
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();

    this.form = this.fb.group({
      funcionario: new FormGroup({
      id: new FormControl(""),
      nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      funcao: new FormControl("", [Validators.required, Validators.minLength(3)]),
      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl("")
      }),
      senha: new FormControl("")
    })
  }
  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }
  get id(): AbstractControl | null {
    return this.form.get("funcionario.id");
  }
  get nome(): AbstractControl | null {
    return this.form.get("funcionario.nome");
  }
  get email(): AbstractControl | null {
    return this.form.get("funcionario.email");
  }

  get funcao(): AbstractControl | null {
    return this.form.get("funcionario.funcao");
  }
  get departamentoId(): AbstractControl | null {
    return this.form.get("funcionario.departamentoId");
  }

  get senha(): AbstractControl | null {
    return this.form.get("senha");
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {

    this.form.reset();

    if (funcionario)
    {
      const departamento = funcionario.departamento ? funcionario.departamento : null;
      const funcionarioCompleto = {
        ...funcionario,
        departamento
      }
      this.form.get("funcionario")?.setValue(funcionarioCompleto);
    }

    try {
      await this.modalService.open(modal).result;


      if (this.form.dirty && this.form.valid) {
        if (funcionario) {
          await this.funcionarioService.editar(this.form.get("funcionario")?.value);
          this.toastrService.success('O funcionario foi editado com Sucesso!', 'Funcionario: ' + funcionario.nome + '!', {
            timeOut: 6000,
            progressBar: true,
            positionClass: 'toast-bottom-right'
          });
        }
        else {


          let originalLogin = this.authService.getUsuario();

          await this.authService.cadastrar(this.email?.value,this.senha?.value);
          await this.funcionarioService.inserir(this.form.get("funcionario")?.value)


          this.authService.atualizarUsuario(await originalLogin);



          this.toastrService.success('O funcionario foi salvo com Sucesso!', 'Novo Funcionario'+ this.form.value.nome + '!', {
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

  public async excluir(modalExcluir: TemplateRef<any>, funcionario: Funcionario) {
    this.form.get("funcionario")?.setValue(funcionario);

    try {
      await this.modalService.open(modalExcluir).result;


      await this.funcionarioService.excluir(funcionario);

      this.toastrService.info('O funcionario foi excluido com Sucesso!', 'Funcionario: ' + funcionario.nome + '!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error('Houve um erro ao excluir o funcionário: ' + funcionario.nome + '!', 'Falha ao Excluir!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    }

  }



}
