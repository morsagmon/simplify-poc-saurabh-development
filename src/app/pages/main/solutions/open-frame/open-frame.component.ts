import {ChangeDetectorRef, Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import {CSHelper} from '../../../../helpers';
import {DomSanitizer} from '@angular/platform-browser';
import {Storage} from '@capacitor/storage';
import {Browser} from '@capacitor/browser';
import {ApiService} from '../../../../api.service';
import {ActivatedRoute} from '@angular/router';
import {AngularFireDatabase} from "@angular/fire/database";

declare const DailyIframe: any;

@Component({
    selector: 'app-open-frame',
    templateUrl: './open-frame.component.html',
    styleUrls: ['./open-frame.component.scss'],
})
export class OpenFrameComponent implements OnInit, DoCheck {

    callFrame;
    limnu = '';
    boardURL;
    userName;
    isopened = false;
    customClass = 'h-0';
    callWrapper;

    // Message
    messages: any = []
    currentUser;
    newMsg;
    @ViewChild('content') content: any;

    constructor(public helper: CSHelper,
                private api: ApiService,
                private activateRoute: ActivatedRoute,
                private db: AngularFireDatabase,
                private cdr: ChangeDetectorRef,
                public domSanitizer: DomSanitizer) {
    }

    ionViewWillEnter() {
        Storage.get({key: 'userName'}).then((response) => {
            this.currentUser = response.value;
        });
        this.db.list('/chat/').valueChanges().subscribe(data => {
            this.messages = data;
            this.cdr.detectChanges();
            console.log(data);
        });
        this.activateRoute.queryParams.subscribe((res) => {
            if (res?.boardURL && res?.imageURL && res?.boardId) {
                this.boardURL = res.boardURL;
                console.log(res, 'ress will enter 39');
                Storage.get({key: 'base64'}).then((re: any) => {
                    if (re.value) {
                        if (!re?.value?.match('data:image/jpeg;base64,')) {
                            re.value = 'data:image/jpeg;base64,' + re.value;
                        }
                        this.imageUpload({
                            apiKey: 'K_1fDC75ImTqKFS9LFZpF1hwqV9rOFgR',
                            boardId: res?.boardId,
                            contentType: 'image/jpg',
                            data_base64: re.value
                        });
                    }
                });
            } else {
                this.helper.helperNotification.subscribe(r => {
                    console.log(r, 'ress will enter 47');
                    const notification = JSON.parse(r);
                    this.boardURL = notification.limnuBoardUrl;
                });
            }
        });
    }

    sendMessage() {
        if (this.newMsg) {
            const data = {
                user: this.currentUser,
                msg: this.newMsg
            }
            this.api.sendMessage(data).then(r => {
                console.log(r);
                this.newMsg = '';
                this.cdr.detectChanges();
            });
        }
    }

    ngOnInit() {
        // this.getBoardUrl();
    }

    imageUpload(data) {
        this.api.boardImageFileUpload(data).subscribe((re) => {
            console.log(re);
        });
    }

    getBrowser(url) {
        const openCapacitorSite = async () => {
            await Browser.open({url});
        };
        return openCapacitorSite();
    }

    ngDoCheck() {
        /*if (this.isopened) {
            window.callFrame.on('leave',  (r) => {
                console.log(r);
            })
        }*/
    }

    showEvent(e) {
        if (e.action === 'left-meeting') {
            this.isopened = false;
            this.customClass = 'h-0';
        }
    }
}
