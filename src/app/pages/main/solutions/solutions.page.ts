import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CSHelper} from "../../../helpers";
import {DomSanitizer} from "@angular/platform-browser";
import {Storage} from "@capacitor/storage";
import {IonSlides} from '@ionic/angular';
import {ApiService} from "../../../api.service";
import {AngularFirestore} from "@angular/fire/firestore";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-solutions',
    templateUrl: './solutions.page.html',
    styleUrls: ['./solutions.page.scss'],
})
export class SolutionsPage implements OnInit, OnDestroy {
    @ViewChild('mySlider') slides: IonSlides;
    limnu = '';
    slideOpts = {
        initialSlide: 0,
        speed: 400,
    };
    boardURL;
    solutions = [];
    finalSolutions = [];
    arrPromise = [];

    constructor(public helper: CSHelper,
                private api: ApiService,
                private activatedRoute: ActivatedRoute,
                public sanitizer: DomSanitizer,
                private database: AngularFirestore,
                private cdr: ChangeDetectorRef,
                public domSanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((e) => {
            console.log(e);
            if (e.number) {
                this.helper.loadingStart();
                Storage.get({key: 'solutions'}).then(itm => {
                    JSON.parse(itm.value).map((re) => {
                        if (re.problem == e.number) {
                            this.arrPromise.push(new Promise(async (resolve, reject) => this.getBoardUrl(re, await (resolve), reject)));
                        }
                    })
                    Promise.all(this.arrPromise).then(() => {
                        this.helper.loadingStopped();
                        this.finalSolutions = [...this.solutions];
                        this.finalSolutions.forEach(re => {
                            this.imageUpload({
                                apiKey: 'K_1fDC75ImTqKFS9LFZpF1hwqV9rOFgR',
                                boardId: re.boardId,
                                contentType: 'image/jpg',
                                data_base64: re.solution
                            })
                        });
                        console.log('asd');
                        // this.getBrowser();
                    }).catch((error) => {
                        this.helper.loadingStopped();
                    });
                })
            }
        })
    }

    imageUpload(data) {
        this.api.boardImageFileUpload(data).subscribe((re) => {
            console.log(re);
        })
    }

    ngOnDestroy() {
        Storage.get({key: 'userName'}).then((re) => {
            if (re.value) {
                if (re.value == 'jane') {
                    this.helper.deleteLimnuBoard()
                }
            }
        })
    }

    getBoardUrl(item?, resolve?, reject?) {
        Storage.get({key: 'userName'}).then((response) => {
            if (response?.value) {
                let data = {apiKey: 'K_1fDC75ImTqKFS9LFZpF1hwqV9rOFgR', displayName: response.value}
                this.api.userCreate(data).subscribe((re: any) => {
                    this.database.collection('boardUrl').get().subscribe((data1) => {
                        this.api.boardCreate({
                            "apiKey": "K_1fDC75ImTqKFS9LFZpF1hwqV9rOFgR",
                            "boardName": "Jane's Board"
                        }).subscribe((res: any) => {
                            res.boardUrl = res.boardUrl + 't=' + re.token;
                            item.boardURL = res.boardUrl;
                            item.boardId = res.boardId;
                            console.log(item.boardURL);
                            this.solutions.push(item)
                            this.cdr.detectChanges();
                            return resolve();
                        })
                    })
                })
            }
        })
    }

    nextSlide() {
        this.slides.slideNext();
    }

    previousSlide() {
        this.slides.slidePrev();
    }
}
