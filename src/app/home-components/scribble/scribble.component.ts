import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import tinymce from 'tinymce';

@Component({
  selector: 'app-scribble',
  templateUrl: './scribble.component.html',
  styleUrls: ['./scribble.component.css'],
})
export class ScribbleComponent implements OnInit {
  uid: string | undefined = '';
  scribbleId: string | undefined = '';
  scribble: any = '';
  title: any = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private firestore: AngularFirestore,
    private firebaseAuth: Auth
  ) {
    // authState(this.firebaseAuth).subscribe((response) => {
    //   this.uid = response?.uid;
    // });
  }
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => (this.scribbleId = params['scribbleId'])
    );
    authState(this.firebaseAuth).subscribe((response) => {
      // console.log(response);
      this.uid = response?.uid;
      if (this.scribbleId) this.loadScribble();
    });
  }

  goBack() {
    this.onSave();

    this.location.back();
  }
  updateScribble() {
    this.scribble = tinymce.activeEditor?.getContent();
    if (this.scribble == '' && this.title == '') {
      this.deleteScribbleFromDatabase(this.scribbleId);
    }
    if (this.title == '') {
      this.title = 'Untitled';
    }
    this.firestore
      .collection('users')
      .doc(this.uid)
      .collection('notes')
      .doc(this.scribbleId)
      .update({ title: this.title, scribble: this.scribble });
  }
  deleteScribbleFromDatabase(scribbleId: string | undefined) {
    this.firestore
      .collection('users')
      .doc(this.uid)
      .collection('notes')
      .doc(scribbleId)
      .delete()
      .then((res) => {
        console.log(scribbleId + ' deleted');
      })
      .catch((err) => {
        console.log(scribbleId + ' not deleted. Reason: ' + err);
      });
  }
  createScribble() {
    if (this.title == '') {
      this.title = 'Untitled';
    }
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
          // console.log(res);
        })
        .catch((e) => {
          // console.log(e);
        });
  }
  onSave() {
    if (this.scribbleId !== 'new') this.updateScribble();
    else this.createScribble();
  }
  loadScribble() {
    // console.log('Params' + this.scribbleId);
    this.firestore
      .collection('users')
      .doc(this.uid)
      .collection('notes')
      .doc(this.scribbleId)
      .get()
      .forEach((scribble) => {
        this.title = scribble.exists ? scribble?.data()?.['title'] : '';
        this.scribble = scribble.exists ? scribble?.data()?.['scribble'] : '';
      });
  }
}
