import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  uid: string | undefined = '';
  constructor(private firestore: AngularFirestore, private firebaseAuth: Auth) {
    authState(this.firebaseAuth).subscribe((response) => {
      // console.log(response);
      this.uid = response?.uid;
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
}
