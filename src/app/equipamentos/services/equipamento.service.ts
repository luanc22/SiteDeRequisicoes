import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from '../models/equipamentos.model';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {

  private registros: AngularFirestoreCollection<Equipamento>;

  constructor(private firestore: AngularFirestore, private toastr: ToastrService) {
    this.registros = this.firestore.collection<Equipamento>("equipamentos");
  }

  public async inserir(registro: Equipamento): Promise<any>{

    if(!registro)
      return Promise.reject("Item invalido");//caso nao retorne nenhum registro, a promise vai ser rejeitada

    const res = await this.registros.add(registro);
    registro.id = res.id;
    this.registros.doc(res.id).set(registro); // o método "doc" é basicamente um selecionar por Id, para passar o id para a nossa memoria
  }

public async editar(registro: Equipamento):Promise<void>{
  return this.registros.doc(registro.id).set(registro); // set é o método que ira inserir um elemento dentro de um objeto já existente.(ou seja editando o próprio objeto)
}
public excluir(registro: Equipamento):Promise<void>{
  return this.registros.doc(registro.id).delete();
}
  public selecionarTodos(): Observable<Equipamento[]>{
    return this.registros.valueChanges();
  }
}
