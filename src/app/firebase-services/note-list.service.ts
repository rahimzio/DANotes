import { Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { inject } from '@angular/core';
import { Firestore, collectionData, collection ,doc, onSnapshot, updateDoc,getDoc, deleteDoc} from '@angular/fire/firestore';
import { addDoc } from '@angular/fire/firestore';
import { Observable, Subscriber } from 'rxjs';
import { NoteComponent } from '../note-list/note/note.component';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  [x: string]: any;

  firestore: Firestore = inject(Firestore);
  trashNotes:Note[] = [];
  normalNotes:Note[] = [];
  //items$;
  //items;
  unsubTrah;
  unsubNotes;

    constructor() {
    //this.items$ = collectionData(this.getTrash());
    //this.items = this.items$.subscribe((list)=>{
      //list.forEach(note =>{
      //  console.log(note)
     // })
   // });
    
    this.unsubTrah = this.subTrash();
    this.unsubNotes = this.subNotes();
    console.log(this.trashNotes)
   }

   subTrash(){
    return onSnapshot(this.getTrash(), (list) => {
      this.trashNotes = [];
        list.forEach((note) => this.trashNotes.push((this.setNoteObject(note.data(), note.id)))
        );
      });
    };

   subNotes(){
    return onSnapshot(this.getNotes(), (list) => {
      this.normalNotes = [];
      list.forEach((note) => this.normalNotes.push(this.setNoteObject(note.data(), note.id))
      );
    });
   }

   async updateNotes(note:Note){
    if(note.id){
      let docRef = this.getSingleDocRef(this.getNoteId(note),note.id);
      let JsonNote = this.getCleanJson(note);
      let doc = await getDoc(docRef);
    
    if (doc.exists()) {
    await updateDoc( docRef,JsonNote).catch(
   (err)=> console.log(err)
)      }
    }
   }

   getCleanJson(note:Note):{}{
    return {
      type: note.type,
      title:note.title,
      content:note.content,
      marked: note.marked,
    }
   }
   
   getNoteId(note:Note){
      if(note.type == "note"){
        return 'note'
      }else{
        return 'trash'
      }
   }

   async deleteNote(callId:"note"| "trash", docId:string){
    await deleteDoc(this.getSingleDocRef(callId, docId)).catch(
      (err) =>  console.log(err)
        )
   }

  async addNote(note:Note,noteId:"note"|'trash'){
    await addDoc(this.getNotes(),note).catch(
      (err) => console.error(err)
    ).then(
     (docRef) => console.log(docRef)
    );
  }

   ngonDestroy(){
    //this.items.unsubscribe()
    this.unsubTrah();
    this.unsubNotes();
   }

   getTrash(){
    console.log(collection(this.firestore ,'trash'))
    return collection(this.firestore ,'trash');
   }

   getNotes(){
    console.log(collection(this.firestore ,'notes'))
    return collection(this.firestore ,'notes');
   }

   getSingleDocRef(callId:string, docId:string){
    return doc(collection(this.firestore, callId),docId );
   }

   setNoteObject(obj:any ,id:string):Note{
    return {
    id: id || "",
    type: obj.type ||  "trash",
    title: obj.title || "",
    content: obj.content || "",
    //marked: obj.marked || false'
    marked: true
    }
   }
}
