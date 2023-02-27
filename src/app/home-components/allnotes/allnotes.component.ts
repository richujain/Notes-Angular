import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth, authState } from '@angular/fire/auth';
import tinymce from 'tinymce';

@Component({
  selector: 'app-allnotes',
  templateUrl: './allnotes.component.html',
  styleUrls: ['./allnotes.component.css'],
})
export class AllnotesComponent implements OnInit {
  uid: any = '';
  // data: Array<{
  //   title: string;
  //   scribble: string;
  //   category: string;
  //   owner: string;
  // }> = [];

  data: Array<any> = [];

  constructor(
    private router: Router,
    // private firestore: AngularFirestore,
    // private auth: AuthService,
    private firebaseAuth: Auth,
    private firestore: AngularFirestore
  ) {
    authState(this.firebaseAuth).subscribe((response) => {
      // console.log(response);
      this.uid = response?.uid;
      this.loadScribblesFromDatabase();
    });
  }
  ngOnInit(): void {}
  newScribble() {
    this.router.navigate(['/scribble', 'new']);
  }
  openScribble(scribbleId: string) {
    this.router.navigate(['/scribble', scribbleId]);
  }
  loadScribblesFromDatabase() {
    this.firestore
      .collection('users')
      .doc(this.uid)
      .collection('notes')
      .get()
      .subscribe((ss) => {
        ss.docs.forEach((doc) => {
          this.data.push(doc.data());
          this.data[this.data.length - 1]['id'] = doc.id;

          console.log(this.data);
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
