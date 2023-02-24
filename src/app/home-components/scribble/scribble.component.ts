import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import tinymce from 'tinymce';

@Component({
  selector: 'app-scribble',
  templateUrl: './scribble.component.html',
  styleUrls: ['./scribble.component.css'],
})
export class ScribbleComponent {
  uid: any = '';
  scribble: any = '';
  title: any = 'Untitled';

  constructor(
    private location: Location,
    private firestore: AngularFirestore,
    private firebaseAuth: Auth
  ) {
    authState(this.firebaseAuth).subscribe((response) => {
      console.log(response);
      this.uid = response?.uid;
    });
  }

  goBack() {
    this.onSave();
    this.location.back();
  }
  onSave() {
    this.scribble = tinymce.activeEditor?.getContent();
    if (this.scribble !== '')
      this.firestore
        .collection('users')
        .doc(this.uid)
        .collection('notes')
        .add({
          title: this.title,
          scribble: this.scribble,
          category: 'All',
          owner: this.uid,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
  }
}
