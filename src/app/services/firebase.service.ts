import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public db: AngularFirestore,
    private http: HttpClient
  ) { }

  checkFirebaseStatus() {
    return this.http.get<any>(`https://firebase.google.com/`).toPromise().then(
      (value) => {
        return true;
      },
      (err) => {
        console.log(err);
        if (err.status === 0) {
          return true;
        }
        return false;
      }
    );
  }
}
