import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

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
    const alert$: Observable<OptimalAlert[]> = this.db
      .collection<OptimalAlert>('optimalAlerts')
      .valueChanges();
    return alert$;
  }

  getUserAlerts() {
    const user = this.authService.getUser().uid;
    const alert$ = this.db
      .collection<OptimalAlert>('optimalAlerts', ref => ref.where('userId', '==', user))
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as OptimalAlert;
          data.expireDate = (a.payload.doc.data() as any).expireDate.toDate();
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
    const docId = alert.documentId;
    this.db
      .collection<OptimalAlert>('optimalAlerts').doc(docId).delete();
  }

  updateAlert(alert: OptimalAlert) {
    const docId = alert.documentId;
    this.db
      .collection<OptimalAlert>('optimalAlerts').doc(docId).update(alert);
  }

  addTestAlertToCurrentUser() {
    const testAlert1: OptimalAlert = { currencyCode: 'PLN' };
    this.addAlert(testAlert1);
    const testAlert2: OptimalAlert = { currencyCode: 'EUR' };
    this.addAlert(testAlert2);
    const testAlert3: OptimalAlert = { currencyCode: 'EUR', expireDate: new Date('2020-01-10') };
    this.addAlert(testAlert3);
  }

}
