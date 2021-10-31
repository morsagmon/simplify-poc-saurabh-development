import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CSHelper} from '../../../helpers';
import {PhotoService} from '../../../services/photo.service';
import {ApiService} from '../../../api.service';
import {Storage} from '@capacitor/storage';
import {DomSanitizer} from '@angular/platform-browser';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';

declare const window: any;

@Component({
    selector: 'app-question-screen',
    templateUrl: './question-screen.component.html',
    styleUrls: ['./question-screen.component.scss'],
})
export class QuestionScreenComponent implements OnInit, AfterViewInit {
    renderedImage;
    isRendered = true;
    bgColor = 'white';
    isInvite = false;
    boardURL;
    getImageText;
    solutionNumber;
    problemNumber;
    helperList = [];
    studentObj: any = {};
    image;
    problemId: string;
    imageUrl;
    waitingMessage = '';
    isInvitedOnce = false;

    constructor(public helper: CSHelper,
                public photoService: PhotoService,
                public sanitizer: DomSanitizer,
                private cd: ChangeDetectorRef,
                private router: Router,
                private cdr: ChangeDetectorRef,
                private database: AngularFirestore,
                private api: ApiService) {
    }

    ionViewWillEnter() {

        let helpers = [
            {helper: 'abc', status: '1'},
            {helper: 'abc', status: '2'},
            {helper: 'abc', status: '3'},
            {helper: 'abc'},
        ]


        if (this.photoService.base64Image) {
            if (!this.photoService.base64Image.match('data:image/jpeg;base64,')) {
                this.photoService.base64Image = 'data:image/jpeg;base64,' + this.photoService.base64Image;
            }
            this.getImage(this.photoService.base64Image);
        } else {
            Storage.get({key: 'base64'}).then((re: any) => {
                if (!re?.value?.match('data:image/jpeg;base64,')) {
                    re.value = 'data:image/jpeg;base64,' + re.value;
                }
                this.getImage(re.value);
            });
        }
        Storage.get({key: 'imgUrl'}).then((re: any) => {
            this.imageUrl = re.value;
            console.log(this.imageUrl);
            this.cd.detectChanges();
        });
    }

    loadData() {
        this.database.collection('user_name').get().subscribe((re) => {
            let item: any = {};
            this.helperList = [];
            re.docs.map((r: any) => {
                item = r.data();
                item.bgColor = 'transparent';
                if (item.userName != 'jane') {
                    switch (item.userName) {
                        case 'jenny':
                            item.image = 'assets/images/helper-1.svg';
                            item.relation = 'Friend';
                            break;
                        case 'alex':
                            item.image = 'assets/images/helper-2.svg';
                            item.relation = 'Parent';
                            break;
                        case 'heather':
                            item.image = 'assets/images/helper-3.svg';
                            item.relation = 'Teacher';
                            break;
                        case 'becky':
                            item.image = 'assets/images/helper-4.svg';
                            item.relation = 'Tutor';
                            break;
                    }
                    item.status = '';
                    this.helperList.push(item);
                } else {
                    this.studentObj.name = r.data().userName;
                    this.studentObj.id = JSON.parse(r.data().userId);
                }
            });

            this.helper.helperNotification.subscribe(r => {
                const notification = JSON.parse(r);
                console.log(notification, 'notification received from helper');
                if (notification) {
                    this.isInvite = true;
                    this.helperList.map((helper) => {
                        console.log({helper});
                        console.log({notification});
                        if (JSON.parse(helper.userId).replace(/^"(.*)"$/, '$1') === notification.helperId) {
                            helper.status = notification.responseCode;
                        }
                        if (this.helperList.filter(hf => hf.status).length < this.helperList.length) {
                            this.waitingMessage = 'More responses are expected...';
                            this.isInvite = false;
                        } else {
                            this.waitingMessage = '';
                            this.isInvite = false;
                        }
                        return helper;
                    });
                    this.helperList.sort((a: any, b: any) => {
                        return parseInt(a.status) - parseInt(b.status);
                    });
                }
                this.cd.detectChanges();
            });
        });
    }

    ngOnInit() {
        // this.helper.loadingStart();


    }

    getImage(image) {
        this.image = image;
        // this.helper.loadingStart();
        const data = {
            src: image,
            formats: ['text', 'data', 'html'],
            data_options: {
                include_asciimath: true,
                include_latex: true
            }
        };
        this.api.renderImage(data).subscribe((res) => {
            this.renderedImage = null;
            console.log(res.data, 'logg on 138 line number');
            if (res.data?.length > 0) {
                this.isRendered = true;
                this.getImageText = res.text;
                console.log(res.text, 'logg on 142 line number');
                Storage.get({key: 'problems'}).then((re) => {
                    if (re.value) {
                        console.log('logg on 145  line number');
                        JSON.parse(re.value).map(r => {
                            if (res.text == r.value) {
                                Storage.get({key: 'solutions'}).then(sol => {
                                    console.log('logg on 149  line number');
                                    if (sol.value) {
                                        this.solutionNumber = 0;
                                        this.solutionNumber = JSON.parse(sol.value).filter((it) => {
                                            if (it.problem === r.problem) {
                                                return true;
                                            } else {
                                                return false;
                                            }
                                        }).length;
                                        console.log(this.solutionNumber, 'logg on 159  line number');
                                        this.cd.detectChanges();
                                    }
                                });
                                this.problemNumber = '';
                                this.problemNumber = r.problem;
                            }
                        });
                    }
                    this.cd.detectChanges();
                });
                this.helper.loadingStopped();
                this.getMathData(res.text, 'content-text');
                this.loadData();
            } else {
                this.helper.loadingStopped();
                this.isRendered = false;
                Storage.get({key: 'photos'}).then((re: any) => {
                    this.renderedImage = JSON.parse(re.value)[0].webviewPath;
                    this.cd.detectChanges();
                });
                this.loadData();
            }
            this.cd.detectChanges();
        }, error => {
            this.helper.loadingStopped();
            this.cd.detectChanges();
        });
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
                const html = window.render(text, options);
                el.innerHTML = html;
                setTimeout(() => {
                    this.helper.loadingStopped();
                    console.log('this.helper.loadingStopped()');
                }, 100);
                this.cdr.detectChanges();
                console.log('oder stopped');
            } else {
                console.log('err loder stopped');
                this.helper.loadingStopped();
                this.cdr.detectChanges();
            }
        };
    }

    selectHelper(helper) {
        this.helper.loadingStart();
        this.getBoardUrl(helper);
    }

    sendSessionInvitaion(helper, boardURL, boardId) {
        console.log({boardURL});
        console.log({helper});
        helper.bgColor = '#1F7A8C';
        this.api.removeSessionInvitation().then(() => {
            this.cd.detectChanges();
            const data: any = {};
            const userId = JSON.parse(helper.userId).replace(/^"(.*)"$/, '$1');
            console.log({userId});
            data.studentId = this.studentObj.id;
            data.helperId = userId;
            data.limnuBoardUrl = boardURL;
            data.title = 'Simplify';
            data.type = 'session';
            data.body = 'Jane has sent session invitation to you!';
            data.image = this.imageUrl;
            data.boardId = boardId;
            this.api.addSessionRDB(data).then(res => {
                this.helper.loadingStopped();
                this.cd.detectChanges();
                this.router.navigate(['/found-solution/session-connection'], {
                    queryParams: {
                        boardURL: boardURL,
                        imageURL: data.image,
                        boardId: boardId
                    }
                });
            }).catch((err) => {
                this.helper.loadingStopped();
            });
        });
    }

    getBoardUrl(helper) {
        let userName = '';
        Storage.get({key: 'userName'}).then((response) => {
            if (response?.value) {
                userName = response.value;
                this.api.userCreate({
                    apiKey: 'K_1fDC75ImTqKFS9LFZpF1hwqV9rOFgR',
                    displayName: userName
                }).subscribe((re: any) => {
                    this.api.boardCreate({
                        apiKey: 'K_1fDC75ImTqKFS9LFZpF1hwqV9rOFgR',
                        boardName: 'Jane\'s Board'
                    }).subscribe((res: any) => {
                        res.boardUrl = res.boardUrl + 't=' + re.token;
                        this.boardURL = res.boardUrl;
                        this.cd.detectChanges();
                        this.sendSessionInvitaion(helper, this.boardURL, res.boardId);
                    }, error => {
                        this.helper.loadingStopped();
                    });
                });
            }
        });
    }

    openVideoCall() {
        console.log('despacito');
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
        console.log(window.callFrame);
        window.callFrame.join({
            url: 'https://simplifypoc.daily.co/new-prebuilt-test', showFullscreenButton: true,
            showLeaveButton: true,
            iframeStyle: {
                position: 'relative',
                width: '100%',
                height: '100%'
            },
            userName: 'Abrar'
        });
        console.log(window.callFrame);
    }

    ngAfterViewInit() {
    }

    getMedia() {
        navigator.getUserMedia({audio: true, video: true}, (stream) => {
            console.log(stream);
            this.cd.detectChanges();
        }, (error) => {
            console.log(error);
            this.cd.detectChanges();
        });
    }

    inviteButton() {
        this.isInvite = true;
        this.isInvitedOnce = true;
        let userId = '';
        const rowLen = this.helperList.length;
        this.api.removeHelperInvitation().then(() => {
            this.cd.detectChanges();
            this.helperList.map((re, i) => {
                const data: any = {};
                userId = JSON.parse(re.userId).replace(/^"(.*)"$/, '$1');
                data.studentId = this.studentObj.id;
                data.studentName = this.studentObj.name;
                data.helperId = userId;
                data.title = 'Simplify';
                data.body = 'Jane needs your help with Math.';
                data.problem = this.getImageText ? this.getImageText : '';
                data.image = this.imageUrl;
                data.problemId = this.photoService.problemId ? this.photoService.problemId : '1';
                this.api.addHelperRDB(data);
                if (rowLen === i + 1) {
                    this.helper.loadingStopped();
                    this.cd.detectChanges();
                }
            });
        });
    }
}
