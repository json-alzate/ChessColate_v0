// core and third party libraries
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import '@codetrix-studio/capacitor-google-auth';
import  firebase  from 'firebase/app';

import { Platform } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

// rxjs
import { from, Observable } from 'rxjs';

// states


// actions


// selectors

// models
import { Profile } from '@models/profile.model';

// services

// components


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private angularFireAuth: AngularFireAuth,
    private readonly angularFirestore: AngularFirestore,
    private platform: Platform
  ) { }


  getAuthState() {
    return this.angularFireAuth.authState;
  }


  loginGoogle(): Observable<firebase.auth.UserCredential> {
    if (this.platform.is('capacitor')) {
      const toReturn = this.capacitorLoginGoogle();
      return from(toReturn);
    } else {
      const toReturn = this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      return from(toReturn);
    }
  }


  async capacitorLoginGoogle() {
    const answer = await Plugins.GoogleAuth.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(answer.authentication.idToken);
    return this.angularFireAuth.signInWithCredential(credential);
  }


  createDocumentUser(profile: Profile) {
    const toReturn = this.angularFirestore.collection('Users').doc(profile.uid).set({
      ...profile
    });
    return from(toReturn);
  }


  updateProfile(profile: Profile): Observable<Profile> {
    const toReturn = this.angularFirestore.doc(`Users/${profile.uid}`).update({
      ...profile
    });
    return from<Promise<Profile>>(toReturn as unknown as Promise<Profile>);
  }


  setPersistence() {
    const toReturn = this.angularFireAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return from(toReturn);
  }


  logout() {
    const toReturn = this.angularFireAuth.signOut();
    return from(toReturn);
  }


}