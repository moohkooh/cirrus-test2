import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class FirebaseService {
    constructor(private fireStore: AngularFireDatabaseModule) {

    }
    storeValue(value: string) {
    }
}
