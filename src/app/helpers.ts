import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {BehaviorSubject, Subject} from 'rxjs';
import {LoadingController, NavController} from '@ionic/angular';
import {ApiService} from "./api.service";
import {AngularFirestore} from "@angular/fire/firestore";
import {Storage} from "@capacitor/storage";

declare const window: any;

@Injectable({
    providedIn: 'root'
})
export class CSHelper {

    showNavbar = true;
    currentUrl;
    isCamera;
    isNavAndSide = true;
    isLanding = true;
    public defaultBanner = 'assets/images/campaign/default_campaign_logo.jpeg';
    selectedTab = `tab-${0}`;
    private socket: any;
    public data: any;

    private messageSource = new BehaviorSubject(null);
    private helperMessageSource = new BehaviorSubject(null);
    studentNotification = this.messageSource.asObservable();
    helperNotification = this.helperMessageSource.asObservable();

    localName = new Subject<any>();
    public boardURL;

    constructor(private router: Router,
                private api: ApiService,
                private database: AngularFirestore,
                private location: NavController,
                public sanitizer: DomSanitizer,
                public loadingController: LoadingController,
                public pageTitle: Title) {
    }

    getMathData(text, id) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathpix-markdown-it@1.0.40/es5/bundle.js';
        document.head.append(script);
        script.onload = () => {
            const isLoaded = window.loadMathJax();
            if (isLoaded) {
                console.log('Styles loaded!');
            }
            const el = window.document.getElementById(id);
            if (el) {
                const options = {
                    htmlTags: true
                };
                this.loadingStopped();
                const html = window.render(text, options);
                el.innerHTML = html;
                console.log('oder stopped');
            } else {
                console.log('err loder stopped');
                this.loadingStopped();
            }
        };
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

    back() {
        this.location.back();
    }

    getBoardUrl() {
        let userName = '';
        Storage.get({key: 'userName'}).then((response) => {
            if (response?.value) {
                userName = response.value;
                let data = {apiKey: 'K_1fDC75ImTqKFS9LFZpF1hwqV9rOFgR', displayName: userName};
                this.api.userCreate(data).subscribe((re: any) => {
                    this.api.boardCreate({
                        "apiKey": "K_1fDC75ImTqKFS9LFZpF1hwqV9rOFgR",
                        "boardName": "Jane's Board"
                    }).subscribe((res: any) => {
                        this.api.setBoardUrl(res.boardUrl, res.boardId)
                        res.boardUrl = res.boardUrl + 't=' + re.token;
                        this.boardURL = res.boardUrl;
                        this.loadingStopped()
                    })
                });
            }
        });
    }

    openURL() {
        if (this.boardURL) {
            console.log(this.boardURL);
            return this.sanitizer.bypassSecurityTrustResourceUrl(this.boardURL);
        }
    }

    deleteLimnuBoard() {
        this.database.collection('boardUrl').get().subscribe((data: any) => {
            if (data.docs.length > 0) {
                this.api.boardDelete({
                    "apiKey": "K_1fDC75ImTqKFS9LFZpF1hwqV9rOFgR",
                    "boardId": data.docs[0].data().boardId
                }).subscribe((r: any) => {
                    this.database.collection('boardUrl').doc(data.docs[0].id).delete()
                    console.log('Board Deleted');
                });
            }
        });
    }

    emitNotification(value) {
        this.messageSource.next(value);
    }

    emitHelperNotification(value) {
        this.helperMessageSource.next(value);
    }
}

