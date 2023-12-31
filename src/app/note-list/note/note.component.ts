import { Component, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { NoteListService } from '../../firebase-services/note-list.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent {
  @Input() note!:Note;
  edit = false;
  hovered = false;

  
  ngAfterViewInit() {
    console.log(this.note);
  }
  
  constructor(private noteService: NoteListService){}

  changeMarkedStatus(){
    if(this.note.marked != undefined){
    this.note.marked = !this.note.marked;
    this.saveNote();
    }
  }

  deleteHovered(){
    if(!this.edit){
      this.hovered = false;
    }
  }

  openEdit(){
    this.edit = true;
  }

  closeEdit(){
    if(this.note){
      this.edit = false;
      this.saveNote();
    }
      }

  moveToTrash(){
    if(this.note.id){
    this.note.type = 'trash';
    let docId = this.note.id;
    delete this.note.id;
    this.noteService.addNote(this.note,"trash");
    this.noteService.deleteNote("note",docId);
    }
  }

  moveToNotes(){
    if(this.note.id){
      this.note.type = 'note';
      let docId = this.note.id;
      delete this.note.id;
      this.noteService.addNote(this.note,"note");
      this.noteService.deleteNote("trash",docId);
      }
  }

  deleteNote(){
    if(this.note.id){
      this.noteService.deleteNote("trash",this.note.id);
      }
  }

  saveNote(){
    this.noteService.updateNotes(this.note);
  }

}
