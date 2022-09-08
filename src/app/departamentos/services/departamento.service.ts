import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Departamento } from '../models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private registros: AngularFirestoreCollection<Departamento>;

  constructor(private firestore: AngularFirestore) {
    this.registros = this.firestore.collection<Departamento>("departamentos");
  }

  public async inserir(registro: Departamento): Promise<any>{
    if(!registro)
      return Promise.reject("Item invalido");//caso nao retorne nenhum registro, a promise vai ser rejeitada

    const res = await this.registros.add(registro);
    registro.id = res.id;
    this.registros.doc(res.id).set(registro); // o método "doc" é basicamente um selecionar por Id, para passar o id para a nossa memoria
  }

public async editar(registro: Departamento):Promise<void>{
  return this.registros.doc(registro.id).set(registro); // set é o método que ira inserir um elemento dentro de um objeto já existente.(ou seja editando o próprio objeto)
}
public excluir(registro: Departamento):Promise<void>{
  return this.registros.doc(registro.id).delete();
}
  public selecionarTodos(): Observable<Departamento[]>{
    return this.registros.valueChanges();
  }
}
