import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getAuth, sendEmailVerification } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private router: Router) {}

  // login method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (res: any) => {
        if (res.user?.emailVerified == true) {
          localStorage.setItem('token', 'true');
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['/verify-email']);
          // alert('Please verify your email to login');
        }
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/login']);
      }
    );
  }

  // register method
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        // alert('Account Created!');
        this.router.navigate(['/verify-email']);
        this.sendEmailForVerification(res.user);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/register']);
      }
    );
  }

  // signout method
  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  // forgot password
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(
      () => {
        // this.router.navigate(['/verify-email']);
        alert('A link to reset your password has been sent to your email.');
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  // Verification Email
  sendEmailForVerification(user: any) {
    this.fireauth.currentUser.then((user) =>
      user?.sendEmailVerification().then(
        (res: any) => {
          alert('A verification email has been sent to you. Please verify it.');
        },
        (err: any) => {
          alert('Something went wrong!');
        }
      )
    );
  }
}
