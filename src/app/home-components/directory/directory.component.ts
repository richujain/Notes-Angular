import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { DataService } from 'src/app/shared/data.service';
import { ModalComponent } from 'src/app/reusable-components/modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css'],
})
export class DirectoryComponent implements OnInit {
  modalRef: MdbModalRef<ModalComponent> | null = null;

  uid: any = '';
  spaces: Array<any> = [];
  data: Array<any> = [];

  constructor(
    private router: Router,
    private firebaseAuth: Auth,
    private firestore: AngularFirestore,
    private dataService: DataService,
    private modalService: MdbModalService,
    private sanitized: DomSanitizer
  ) {
    authState(this.firebaseAuth).subscribe((response) => {
      // console.log(response);
      this.uid = response?.uid;
      this.spaces = this.dataService.getAllSpace(this.uid);
      console.log(this.spaces);
    });
  }
  ngOnInit(): void {
    authState(this.firebaseAuth).subscribe((response) => {
      // console.log(response);
      this.uid = response?.uid;
      this.loadScribblesFromDatabase();
    });
  }
  openSpace(spaceTitle: string) {
    this.router.navigate(['/home/allnotes', spaceTitle]);
  }
  openModal() {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: { title: 'Create Space' },
    });
    this.modalRef.onClose.subscribe((spaceTitle: any) => {
      // console.log(spaceTitle);
      this.dataService.checkWhetherSpaceExistsAndCreateSpace(spaceTitle);
      this.spaces = this.dataService.getAllSpace(this.uid);
    });
  }
  openScribble(scribbleId: string) {
    this.router.navigate(['/scribble', scribbleId]);
  }
  deleteSpace(spaceId: string | undefined) {
    this.dataService.deleteSpaceFromDatabase(spaceId);
    var i = this.spaces.length;
    while (i--) {
      if (this.spaces[i]['id'] == spaceId) {
        this.spaces.splice(i, 1);
      }
    }
    // this.spaces = this.dataService.getAllSpace(this.uid);
  }
  loadScribblesFromDatabase() {
    this.data = [];
    this.firestore
      .collection('users')
      .doc(this.uid)
      .collection('notes', (ref) => ref.orderBy('lastUpdated').limitToLast(5))
      .get()
      .subscribe((ss) => {
        ss.docs.forEach((doc) => {
          this.data.push(doc.data());
          this.data[this.data.length - 1]['id'] = doc.id;
          this.data[this.data.length - 1]['Styledscribble'] =
            this.sanitized.bypassSecurityTrustHtml(
              this.data[this.data.length - 1]['scribble']
            );

          // console.log(this.data);
          // console.log(typeof this.data);
          // {owner: 'IiqXhN4lMcc8tXkx7DqjOZQFsuD3', scribble: '<h3 style="text-align: center;">This is a sample</…gn: center;">Hi there, this is a sample test.</p>', title: 'Sample Title Name', category: 'All'}
        });
      });
  }
  deleteScribbleFromDatabase(scribbleId: string) {
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
    var i = this.data.length;
    while (i--) {
      if (this.data[i]['id'] == scribbleId) {
        this.data.splice(i, 1);
      }
    }
  }
}
