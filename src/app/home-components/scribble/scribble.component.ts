import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import tinymce from 'tinymce';
import * as moment from 'moment';
import { ModalComponent } from 'src/app/reusable-components/modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-scribble',
  templateUrl: './scribble.component.html',
  styleUrls: ['./scribble.component.css'],
})
export class ScribbleComponent implements OnInit {
  modalRef: MdbModalRef<ModalComponent> | null = null;

  uid: string | undefined = '';
  scribbleId: string | undefined = '';
  scribble: any = '';
  title: any = '';
  lastUpdated: string = new Date().toDateString();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private firestore: AngularFirestore,
    private firebaseAuth: Auth,
    private modalService: MdbModalService,
    private dataService: DataService
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
    this.lastUpdated = moment().format('MMMM Do YYYY, h:mm:ss a');
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
      .update({
        title: this.title,
        scribble: this.scribble,
        lastUpdated: this.lastUpdated,
      });
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
          lastUpdated: this.lastUpdated,
        })
        .then((res) => {
          // console.log(res);
        })
        .catch((e) => {
          // console.log(e);
        });
  }
  onSave() {
    this.lastUpdated = moment().format('MMMM Do YYYY, h:mm:ss a');
    if (this.scribbleId !== 'new') this.updateScribble();
    else this.createScribble();
    this.loadScribble();
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
        this.lastUpdated = scribble.exists
          ? scribble?.data()?.['lastUpdated']
          : '';
      });
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: { title: 'Create Space' },
    });
    this.modalRef.onClose.subscribe((spaceTitle: any) => {
      // console.log(spaceTitle);
      this.dataService.createSpace(spaceTitle);
    });
  }
}
