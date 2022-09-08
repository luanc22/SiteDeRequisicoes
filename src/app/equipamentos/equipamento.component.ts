import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamentos.model';
import { EquipamentoService } from './services/equipamento.service';
import { ValidatorDate } from './date.validador';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html'
})
export class EquipamentoComponent implements OnInit {

  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(private equipamentoService: EquipamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      numeroSerie: new FormControl("", [Validators.required, Validators.minLength(6)]),
      nomeEquipamento: new FormControl("", [Validators.required, Validators.minLength(3)]),
      preco: new FormControl("", [Validators.required]),
      dataFabricacao: new FormControl("", [ValidatorDate(), Validators.required])
    })
  }
  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get nomeString(): string {
    return this.nomeEquipamento?.value;
  }
  get id() {
    return this.form.get("id");
  }

  get numeroSerie() {
    return this.form.get("numeroSerie");
  }

  get nomeEquipamento() {
    return this.form.get("nomeEquipamento");
  }
  get preco() {
    return this.form.get("preco");
  }
  get dataFabricacao() {
    return this.form.get("dataFabricacao")
  }

  public async gravar(modal: TemplateRef<any>) {

    this.form.reset();

    try {
      await this.modalService.open(modal).result;
      if (this.form.dirty && this.form.valid) {
        await this.equipamentoService.inserir(this.form.value)
        this.toastrService.success('O equipamento foi salvo com Sucesso!', 'Novo Equipamento', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
      } else {
        this.toastrService.error('O Formulario deve ser preenchido!', 'Falha ao Inserir Novo Equipamento!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });

      }


    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error('Houve um erro ao inserir um novo Equipamento!', 'Falha ao Inserir Novo Equipamento!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
    }
  }

  public async gravarEditar(modalEditar: TemplateRef<any>, equipamento: Equipamento) {

    this.form.reset();

    this.form.setValue(equipamento);


    try {
      await this.modalService.open(modalEditar).result;
      if (this.form.dirty && this.form.valid) {
        await this.equipamentoService.editar(this.form.value);
        this.toastrService.success('O equipamento foi editado com Sucesso!', 'Equipamento: ' + equipamento.nomeEquipamento + '!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
      } else {
        this.toastrService.error('O Formulario deve ser preenchido!', 'Falha ao Inserir Novo Equipamento!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });

      }
    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error('Houve um erro ao editar o equipamento: ' + equipamento.nomeEquipamento + '!', 'Falha ao Editar!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
    }
  }


  public async excluir(modalExcluir: TemplateRef<any>, equipamento: Equipamento) {
    this.form.setValue(equipamento);

    try {
      await this.modalService.open(modalExcluir).result;
      await this.equipamentoService.excluir(equipamento);
      this.toastrService.info('O equipamento foi excluido com Sucesso!', 'Equipamento: ' + equipamento.nomeEquipamento + '!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error('Houve um erro ao excluir o equipamento: ' + equipamento.nomeEquipamento + '!', 'Falha ao Excluir!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
    }
  }
}
