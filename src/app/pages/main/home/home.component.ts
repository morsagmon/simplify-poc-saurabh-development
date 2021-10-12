import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PhotoService, UserPhoto} from '../../../services/photo.service';
import {ActionSheetController} from '@ionic/angular';
import {CSHelper} from '../../../helpers';
import {ApiService} from '../../../api.service';
import {AngularFireStorage} from "@angular/fire/storage";
import {Storage} from "@capacitor/storage";

declare const window: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    callWrapper = document.getElementById('wrapper');
    callFrame;
    boardURL;
    isSentInvitation: any;

    constructor(public photoService: PhotoService,
                public helper: CSHelper,
                private cdr: ChangeDetectorRef,
                private api: ApiService,
                private storage: AngularFireStorage,
                public actionSheetController: ActionSheetController) {

    }

    async ngOnInit() {
        // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
        //     result => console.log('Has permission?',result.hasPermission),
        //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
        // );
        await this.photoService.loadSaved();
    }

    ionViewWillEnter() {
        this.helper.emitHelperNotification(null);
        this.helper.emitNotification(null);
        this.api.removeChatSession().then(r => {
            console.log(r);
            this.cdr.detectChanges();
        }).catch(err => {
            console.log(err);
            this.cdr.detectChanges();
        });
        Storage.get({key: 'isSent'}).then(r => {
            this.isSentInvitation = r.value;
            this.cdr.detectChanges();
        })
        const storageRef = this.storage.ref('/Images');
        storageRef.listAll().subscribe(r => {
            const promises = r.items.map((item) => {
                return item.delete();
            });
            Promise.all(promises).then(re => {
                console.log(re);
            });
            this.cdr.detectChanges();
        });
    }

    public async showActionSheet(photo: UserPhoto, position: number) {
        const actionSheet = await this.actionSheetController.create({
            header: 'Photos',
            buttons: [{
                text: 'Delete',
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    this.photoService.deletePicture(photo, position);
                }
            }, {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    // Nothing to do, action sheet is automatically closed
                }
            }]
        });
        await actionSheet.present();
    }

    openVideoCall() {
        window.callFrame = window.DailyIframe.createFrame({
            iframeStyle: {
                position: 'fixed',
                border: 0,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            },
        });
        window.callFrame.join({
            url: 'https://simplifypoc.daily.co/new-prebuilt-test', showFullscreenButton: true,
            showLeaveButton: true,
            iframeStyle: {
                position: 'relative',
                width: '100%',
                height: '100%'
            }
        })
    }


    // topVideoFrame = 'partner-video';
    // userId: string;
    // partnerId: string;
    // myEl: HTMLMediaElement;
    // partnerEl: HTMLMediaElement;
    //
    // constructor(
    //     public webRTC: WebrtcService,
    //     public elRef: ElementRef,
    //     public photoService: PhotoService,
    //     public helper: CSHelper,
    //     private api: ApiService,
    //     public actionSheetController: ActionSheetController
    // ) {
    // }
    //
    // ngOnInit() {
    // }
    //
    // init(val) {
    //     this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    //     this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');
    //     this.webRTC.init(val, this.myEl, this.partnerEl);
    // }
    //
    // call(val) {
    //     this.webRTC.call(val);
    //     this.swapVideo('my-video');
    // }
    //
    // swapVideo(topVideo: string) {
    //     this.topVideoFrame = topVideo;
    // }
    clearHelper() {
        Storage.remove({key: 'isSent'}).then(() => {
            this.isSentInvitation = null;
        });
    }
}
