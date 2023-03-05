import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-allnotes',
  templateUrl: './allnotes.component.html',
  styleUrls: ['./allnotes.component.css'],
})
export class AllnotesComponent implements OnInit {
  private subscription: any;
  uid: any = '';
  searchTerm: string | undefined = '';
  // data: Array<{
  //   title: string;
  //   scribble: string;
  //   category: string;
  //   owner: string;
  // }> = [];

  data: Array<any> = [];
  templates: Array<any> = [];

  constructor(
    private router: Router,
    private sanitized: DomSanitizer,
    private firebaseAuth: Auth,
    private firestore: AngularFirestore,
    private dataService: DataService
  ) {
    authState(this.firebaseAuth).subscribe((response) => {
      // console.log(response);
      this.uid = response?.uid;
      this.loadScribblesFromDatabase('');
      this.loadTemplatesFromDatabase();
    });
  }
  ngOnInit(): void {
    this.subscription = this.dataService.search_term.subscribe(
      (searchTerm: string) => {
        this.loadScribblesFromDatabase(searchTerm);
      }
    );
  }
  public onDestroy(): void {
    // you need this in order to avoid a memory leak
    this.subscription.unsubscribe();
  }
  newScribble() {
    this.router.navigate(['/scribble', 'new']);
  }
  openScribble(scribbleId: string) {
    this.router.navigate(['/scribble', scribbleId]);
  }

  loadScribblesFromDatabase(search_term: string) {
    this.data = [];
    this.firestore
      .collection('users')
      .doc(this.uid)
      .collection('notes', (ref) =>
        ref
          .orderBy('title')
          .startAt(search_term)
          .endAt(search_term + '\uf8ff')
      )
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
  loadTemplatesFromDatabase() {
    this.firestore
      .collection('templates')
      .get()
      .subscribe((ss) => {
        ss.docs.forEach((doc) => {
          this.templates.push(doc.data());
          this.templates[this.templates.length - 1]['id'] = doc.id;
          this.templates[this.templates.length - 1]['Styledscribble'] =
            this.sanitized.bypassSecurityTrustHtml(
              this.templates[this.templates.length - 1]['scribble']
            );
        });
        console.log(this.templates);
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
  loadTemplate(title: string, scribble: string, id: string) {
    // this.dataService.checkWhetherSpaceExistsAndCreateSpace(this.spaceTitle);
    this.firestore
      .collection('users')
      .doc(this.uid)
      .collection('notes')
      .add({
        title: title,
        scribble: scribble,
        spaceTitle: 'Untitled',
        owner: this.uid,
        lastUpdated: '',
      })
      .then((res) => {
        this.router.navigate(['/scribble', res.id]);
      })
      .catch((e) => {
        // console.log(e);
      });
  }
}
