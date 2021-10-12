import {ChangeDetectorRef, Component} from '@angular/core';
import {CSHelper} from '../../../helpers';
import {PhotoService} from '../../../services/photo.service';
import {ApiService} from '../../../api.service';
import {Storage} from '@capacitor/storage';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
    selector: 'app-helper-home',
    templateUrl: './helper-home.component.html',
    styleUrls: ['./helper-home.component.scss'],
})
export class HelperHomeComponent {
    isRendered = true;
    renderedImage;
    userName;
    image;
    userObj;
    imageUrl;
    helperId;
    isSentRes = false

    constructor(public helper: CSHelper,
                private database: AngularFirestore,
                public photoService: PhotoService,
                private cd: ChangeDetectorRef,
                private api: ApiService) {
        console.log('asdasd');
    }

    ionViewWillEnter() {
        this.helper.studentNotification.subscribe(r => {
            this.helper.loadingStart();
            this.userObj = JSON.parse(r);
            this.getImagebyUrl(this.userObj.image);
        });

        Storage.get({key: 'uid'}).then(userId => {
            console.log({userId});
            this.helperId = JSON.parse(userId.value);
        });
        Storage.get({key: 'userName'}).then((re) => {
            if (re.value) {
                this.userName = re.value;
                if (this.userName === 'jenny') {
                    this.image = 'assets/images/helper-1.svg';
                } else if (this.userName === 'alex') {
                    this.image = 'assets/images/helper-2.svg';
                } else if (this.userName === 'heather') {
                    this.image = 'assets/images/helper-3.svg';
                } else if (this.userName === 'becky') {
                    this.image = 'assets/images/helper-4.svg';
                }
            }
        });
    }

    public getBase64Image(imgUrl, callback) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            callback(dataURL); // the base64 string
        };
        // set attributes and src
        img.setAttribute('crossOrigin', 'anonymous'); //
        img.src = imgUrl;
    }

    getImage(image, url?) {
        console.log(image, 'base64Image');
        const data = {
            src: image,
            formats: ['text', 'data', 'html'],
            data_options: {
                include_asciimath: true,
                include_latex: true
            }
        };
        console.log(url, 'urlImage');
        this.api.renderImage(data).subscribe((res) => {
            this.renderedImage = null;
            console.log(res.data, 'res.data');
            if (res.data?.length > 0) {
                this.isRendered = true;
                this.helper.getMathData(res.text, 'content-text');
            } else {
                this.helper.loadingStopped();
                this.isRendered = false;
                this.renderedImage = url;
            }
        }, error => {
            console.log(error);
        });
    }

    getImagebyUrl(url) {
        const data = {
            src: url,
            formats: ['text', 'data', 'html'],
            data_options: {
                include_asciimath: true,
                include_latex: true
            }
        };
        this.api.renderImage(data).subscribe((res) => {
            this.renderedImage = null;
            console.log(res.data, 'res.data');
            if (res.data?.length > 0) {
                this.isRendered = true;
                this.helper.getMathData(res.text, 'content-text');
            } else {
                this.helper.loadingStopped();
                this.isRendered = false;
                this.renderedImage = url;

            }
            this.cd.detectChanges()
        }, error => {
            console.log(error);
        });
    }

    inviteButton(resCode) {
        this.helper.loadingStart();
        let message = '';
        switch (resCode) {
            case '1':
                message = `${this.userName} has accepted your invitation and available now.`;
                break;
            case '2':
                message = `${this.userName} has accepted your invitation and available in 5 minutes.`;
                break;
            case '3':
                message = `${this.userName} is not available.`;
                break;
        }
        this.api.removeHelperResponseInvitation().then(() => {
            console.log({
                studentId: this.userObj.studentId,
                problemId: '1',
                body: message,
                title: `Helper Response`,
                helperId: this.helperId,
                type: 'helper',
                problemImage: this.userObj.image,
                responseCode: resCode
            }, 'TYhree clicked 112');
            this.api.addHelperResRDB({
                studentId: this.userObj.studentId,
                problemId: '1',
                body: message,
                title: `Simplify`,
                helperId: this.helperId,
                type: 'helper',
                problemImage: this.userObj.image,
                responseCode: resCode
            }).then(re => {
                this.helper.loadingStopped();
                this.isSentRes = true;
                this.cd.detectChanges();
                console.log(re, 'returned helperResponse');
            });
        });
    }
}
