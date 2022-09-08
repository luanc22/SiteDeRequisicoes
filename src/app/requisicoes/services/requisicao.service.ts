import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, take } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Requisicao } from '../models/requisicao.model';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {

  private registros: AngularFirestoreCollection<Requisicao>;

  constructor(private firestore: AngularFirestore) {
    this.registros = this.firestore.collection<Requisicao>("requisicoes");
  }

  public async inserir(registro: Requisicao): Promise<any> {
    if (!registro)
      return Promise.reject("Item invalido");//caso nao retorne nenhum registro, a promise vai ser rejeitada

    const res = await this.registros.add(registro);
    registro.id = res.id;
    this.registros.doc(res.id).set(registro); // o método "doc" é basicamente um selecionar por Id, para passar o id para a nossa memoria
  }
  public async editar(registro: Requisicao): Promise<void> {
    return this.registros.doc(registro.id).set(registro); // set é o método que ira inserir um elemento dentro de um objeto já existente.(ou seja editando o próprio objeto)
  }
  public excluir(registro: Requisicao): Promise<void> {
    return this.registros.doc(registro.id).delete();
  }
  public selecionarTodos(): Observable<Requisicao[]> {
    return this.registros.valueChanges()
      .pipe(
        map((requisicoes: Requisicao[]) => {
          requisicoes.forEach(requisicao => {
            this.firestore
              .collection<Departamento>("departamentos")
              .doc(requisicao.departamentoId)
              .valueChanges()
              .subscribe(x => requisicao.departamento = x)
          });
          return requisicoes;
        }),
        map((requisicoes: Requisicao[]) => {
          requisicoes.forEach(requisicao => {
            this.firestore
              .collection<Equipamento>("equipamentos")
              .doc(requisicao.equipamentoId!)
              .valueChanges()
              .subscribe(x => requisicao.equipamento = x)
          });
          return requisicoes;
        })
      );
  }



}
