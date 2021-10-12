import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders,} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AlertController, LoadingController, Platform} from '@ionic/angular';
import {Storage} from '@capacitor/storage';
import {PhotoService} from './services/photo.service';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private httpOptions: any;
    mathPixBaseUrl = 'https://api.mathpix.com/v3/text';
    firebaseBaseUrl = 'https://simplify-poc-default-rtdb.firebaseio.com';
    userId;
    private helperPath = '/HelpersInvitations';
    private chatPath = '/chat';
    private helperResponsePath = '/HelpersResponses';
    private sessionInvitationPath = '/SessionsInvitations';
    private tokensPath = '/Tokens';
    helperRef: AngularFireList<any> = null;
    helperResponseRef: AngularFireList<any> = null;
    sessionInvitationRef: AngularFireList<any> = null;
    tokenRef: AngularFireList<any> = null;
    token = '';
    notificationSource = new BehaviorSubject(null);
    notificationToken = this.notificationSource.asObservable();

    constructor(private http: HttpClient,
                private route: Router,
                private photoSer: PhotoService,
                private platform: Platform,
                private db: AngularFireDatabase,
                private alertCtrl: AlertController,
                public loadingController: LoadingController,
                private fireAuth: AngularFireAuth,
                private database: AngularFirestore) {
        this.helperRef = db.list(this.helperPath);
        this.tokenRef = db.list(this.tokensPath);
        this.helperResponseRef = db.list(this.helperResponsePath);
        this.sessionInvitationRef = db.list(this.sessionInvitationPath);
    }

    emitToken(val) {
        this.notificationSource.next(val);
    }

    getToken(): any {
        this.httpOptions = {
            headers: new HttpHeaders({
                'content-type': 'application/json',
                app_id: 'info_skillblaster_com_6aa86b_408261',
                app_key: '97af423783221352866e255b591cca66f814e83c0104850a0f5fdab7cb1a7a7e'
            }),
        };
        return this.httpOptions;
    }

    basicHeader(): any {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
            }),
        };
        return this.httpOptions;
    }

    renderImage(data): Observable<any> {
        return this.http.post(`${this.mathPixBaseUrl}`, data, this.getToken()).pipe(
            catchError((err) => {
                console.error(err, 'Errors');
                return throwError(err);
            }));
    }

    login(token): Promise<any> {
        return this.fireAuth
            .signInAnonymously()
            .then(res => {
                    this.userId = ''
                    this.userId = res.user.uid;
                    Storage.remove({key: 'uid'})
                    Storage.set({
                        key: 'uid',
                        value: JSON.stringify(this.userId),
                    });
                    console.log(this.token, 'addTokenRDB 115 line');
                    // this.addTokenRDB(res.user.uid, this.token);
                    this.setDeviceTokens(res.user.uid, token);
                    return true;
                },
                (err) => {
                    return false;
                }
            );
    }

    loadingStart() {
        this.loadingController.create({
            spinner: null,
            message: `<div class="custom-spinner-container">
            <img class="loading" src="assets/images/home-main.png" alt="">
            <img class="rotate" width="120px" height="120px" src="assets/images/spinner.png" />
            </div>`
        }).then((res) => {
            res.present();
        });
    }

    loadingStopped() {
        setTimeout(() => {
            this.loadingController.dismiss();
        }, 100);
    }

    setDeviceTokens(userId, token) {
        console.log('130 line log');
        this.database.collection('tokens').add({user: userId, device_token: token}).then((re) => {
            console.log('132 line log');
            console.log(re);
        })
    }

    setBoardUrl(url?, boardId?) {
        this.database.collection('boardUrl').add({url: url, boardId: boardId}).then((re) => {
            console.log(re);
        })
    }

    boardImageFileUpload(data) {
        return this.http.post(`https://api.apix.limnu.com/v1/boardImageFileUpload`, data, this.basicHeader()).pipe(
            catchError((err) => {
                console.error(err, 'Errors');
                return throwError(err);
            }));
    }

    boardImageFileUploadURL(data) {
        return this.http.post(`https://api.apix.limnu.com/v1/boardImageURLUpload`, data, this.basicHeader()).pipe(
            catchError((err) => {
                console.error(err, 'Errors');
                return throwError(err);
            }));
    }

    userCreate(data) {
        return this.http.post(`https://api.apix.limnu.com/v1/userCreate`, data, this.basicHeader()).pipe(
            catchError((err) => {
                console.error(err, 'Errors');
                return throwError(err);
            }));
    }

    boardCreate(data) {
        return this.http.post(`https://api.apix.limnu.com/v1/boardCreate`, data, this.basicHeader()).pipe(
            catchError((err) => {
                console.error(err, 'Errors');
                return throwError(err);
            }));
    }

    boardDelete(data) {
        return this.http.post(`https://api.apix.limnu.com/v1/boardDelete`, data, this.basicHeader()).pipe(
            catchError((err) => {
                console.error(err, 'Errors');
                return throwError(err);
            }));
    }

    getAPIToken(): any {
        this.httpOptions = {
            headers: new HttpHeaders({
                authorization: `Bearer 980856144d03f6076f889008a30f53510ec9b95592a696c81eae2f183756c401`
            }),
        };
        return this.httpOptions;
    }

    addHelperRDB(data) {
        this.db.database.ref(this.helperPath + '/' + data.helperId).set(data).then((re) => {
            Storage.set({key: 'isSent', value: 'true'});
        });
    }

    addHelperResRDB(data) {
        return this.db.database.ref(this.helperResponsePath + '/' + data.studentId).set(data);
    }

    addSessionRDB(data) {
        return this.db.database.ref(this.sessionInvitationPath + '/' + data.helperId).set(data);
    }

    removeHelperInvitation(): Promise<any> {
        return this.db.database.ref(this.helperPath).remove();
    }

    removeHelperResponseInvitation(): Promise<any> {
        return this.db.database.ref(this.helperResponsePath).remove();
    }

    removeSessionInvitation(): Promise<any> {
        return this.db.database.ref(this.sessionInvitationPath).remove();
    }

    removeChatSession(): Promise<any> {
        return this.db.database.ref(this.chatPath).remove();
    }

    sendMessage(data) {
        return this.db.list('/chat').push(data);
    }

    addTokenRDB(userId, token) {
        console.log(token, 'addTokenRDB 241 line');
        this.db.database.ref(this.tokensPath + '/' + userId).set({UserID: userId, Token: token});
    }

    dailyCoInit(): Observable<any> {
        return this.http.get(`https://api.daily.co/v1/meeting-tokens/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyIjoibmV3LXByZWJ1aWx0LXRlc3QiLCJlanQiOnRydWUsImQiOiIyNDZlNGYxMi0wZWI2LTQxZmEtYjg5MC0wYjZiNzk0MDQ0NDUiLCJpYXQiOjE2MjQ1MTgwNzd9.qCPtbdCjgK57L6G4Opklfi5YVZi_lJwVtYEpisYuZCM`, this.getAPIToken()).pipe(
            catchError((err) => {
                console.error(err, 'Errors');
                return throwError(err);
            }));
    }

    dailyConfig(): Observable<any> {
        let data = {
            'properties': {
                'enable_prejoin_ui': false,
                'enable_network_ui': false,
                'hide_daily_branding': false,
                'redirect_on_meeting_exit': 'http://localhost:8100/found-solution/1/test-connection'
            }
        }
        return this.http.post(`https://api.daily.co/v1/`, data, this.getAPIToken()).pipe(
            catchError((err) => {
                console.error(err, 'Errors');
                return throwError(err);
            }));
    }
}
