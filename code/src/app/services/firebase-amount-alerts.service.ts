import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export interface AmountAlert {
  documentId?: string;
  userId?: string;
  currencyCode?: string;
  expireDate?: Date;
  amount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAmountAlertsService {

  constructor(
    public authService: AuthService,
    public db: AngularFirestore
  ) { }

  getAllAlerts() {
    const alert$: Observable<AmountAlert[]> = this.db
      .collection<AmountAlert>('amountAlert')
      .valueChanges();
    return alert$;
  }

  getUserAlerts() {
    const user = this.authService.getUser().uid;
    const alert$ = this.db
      .collection<AmountAlert>('amountAlert', ref => ref.where('userId', '==', user))
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as AmountAlert;
          data.expireDate = (a.payload.doc.data() as any).expireDate.toDate();
          const documentId = a.payload.doc.id;
          return { documentId, ...data };
        });
      }));
    return alert$;
  }

  addAlert(alert: AmountAlert) {
    alert.userId = this.authService.getUser().uid;
    this.db
      .collection<AmountAlert>('amountAlert')
      .add(alert);
  }

  deleteAlert(alert: AmountAlert) {
    const docId = alert.documentId;
    this.db
      .collection<AmountAlert>('amountAlert').doc(docId).delete();
  }

  updateAlert(alert: AmountAlert) {
    const docId = alert.documentId;
    this.db
      .collection<AmountAlert>('amountAlert').doc(docId).update(alert);
  }

  addTestAlertToCurrentUser() {
    const testAlert1: AmountAlert = { currencyCode: 'GPD', expireDate: new Date('2020-02-10'), amount: 5 };
    this.addAlert(testAlert1);
    const testAlert2: AmountAlert = { currencyCode: 'EUR', expireDate: new Date('2020-01-15'), amount: 5.0 };
    this.addAlert(testAlert2);
    const testAlert3: AmountAlert = { currencyCode: 'EUR', expireDate: new Date('2020-07-10'), amount: 4.1 };
    this.addAlert(testAlert3);
  }
}
