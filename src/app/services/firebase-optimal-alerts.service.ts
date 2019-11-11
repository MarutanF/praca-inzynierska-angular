import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface OptimalAlert {
  documentId?: string;
  userId?: string;
  currencyCode?: string;
  expireDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseOptimalAlertsService {

  constructor(
    public authService: AuthService,
    public db: AngularFirestore
  ) { }

  getAllAlerts() {
    let alert$: Observable<OptimalAlert[]> = this.db
      .collection<OptimalAlert>('optimalAlerts')
      .valueChanges();
    return alert$;
  }

  getUserAlerts() {
    let user = this.authService.getUser().uid;
    let alert$ = this.db
      .collection<OptimalAlert>('optimalAlerts', ref => ref.where('userId', '==', user))
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as OptimalAlert;
          const documentId = a.payload.doc.id;
          return { documentId, ...data };
        });
      }));
    return alert$;
  }

  addAlert(alert: OptimalAlert) {
    alert.userId = this.authService.getUser().uid;
    this.db
      .collection<OptimalAlert>('optimalAlerts')
      .add(alert);
  }

  deleteAlert(alert: OptimalAlert) {
    let docId = alert.documentId;
    this.db
      .collection<OptimalAlert>('optimalAlerts').doc(docId).delete();
  }

  addTestAlertToCurrentUser() {
    let testAlert1: OptimalAlert = { currencyCode: 'PLN' };
    this.addAlert(testAlert1);
    let testAlert2: OptimalAlert = { currencyCode: 'EUR' };
    this.addAlert(testAlert2);
  }

}
