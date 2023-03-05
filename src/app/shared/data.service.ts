import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  uid: string | undefined = '';
  spaces: Array<any> = [];
  public search_term = new Subject<any>();

  constructor(private firestore: AngularFirestore, private firebaseAuth: Auth) {
    authState(this.firebaseAuth).subscribe((response) => {
      // console.log(response?.uid);
      this.uid = response?.uid;
    });
  }
  onSearchClicked(search_term: string) {
    this.search_term.next(search_term);
    // return this.search_term;
  }

  checkWhetherSpaceExistsAndCreateSpace(spaceTitle: string) {
    this.firestore
      .collection('users')
      .doc(this.uid)
      .collection('spaces', (ref) =>
        ref.where('title', '==', spaceTitle).limit(1)
      )
      .get()
      .subscribe((ss) => {
        if (ss.docs.length == 0) this.createSpace(spaceTitle);
      });
  }

  createSpace(spaceTitle: string) {
    this.firestore
      .collection('users')
      .doc(this.uid)
      .collection('spaces')
      .add({
        title: spaceTitle,
      })
      .then((res) => {
        // console.log(res);
      })
      .catch((e) => {
        // console.log(e);
      });
  }

  getAllSpace(uid: string | undefined): any {
    this.spaces = [];
    if (uid)
      this.firestore
        .collection('users')
        .doc(this.uid)
        .collection('spaces')
        .get()
        .subscribe((ss) => {
          ss.docs.forEach((doc) => {
            // this.spaces.push(doc.data()['title']);
            this.spaces.push(doc.data());
          });
          // console.log('spaces: ' + this.spaces);
          return this.spaces;
        });
    return this.spaces;
  }
}
