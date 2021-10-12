import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Storage} from '@capacitor/storage';
import {PhotoService} from '../../../services/photo.service';
import {CSHelper} from '../../../helpers';
import {AlertController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
    selector: 'app-welcome-app',
    templateUrl: './welcome-app.page.html',
    styleUrls: ['./welcome-app.page.scss'],
})
export class WelcomeAppPage implements OnInit {
    userList = [];
    staticName = [];
    problem = [
        {problem: 1, value: '/assets/images/pro-sol/Problem-1.jpg', id: '1'},
        {problem: 2, value: '/assets/images/pro-sol/Problem-2.jpg', id: '2'},
    ];
    solutions = [
        {problem: 1, solution: '/assets/images/pro-sol/P1-Solution 1.jpg'},
        {problem: 1, solution: '/assets/images/pro-sol/P1-Solution 2.jpg'},
        {problem: 2, solution: '/assets/images/pro-sol/P2-Solution 1.jpg'},
        {problem: 2, solution: '/assets/images/pro-sol/P2-Solution 2.jpg'},
        {problem: 2, solution: '/assets/images/pro-sol/P2-Solution 3.jpg'},
    ];
    problemArr = [];
    solutionsArr = [];
    promiseArr = [];
    solutionPromise = [];

    constructor(private api: ApiService,
                private route: Router,
                public helper: CSHelper,
                private http: HttpClient,
                private db: AngularFireDatabase,
                private photoSer: PhotoService,
                private alertController: AlertController,
                private database: AngularFirestore) {
    }

    async ngOnInit() {
        this.api.notificationToken.subscribe(r => {
            if (r) {
                Storage.get({key: 'uid'}).then((re) => {
                    if (re.value) {
                        this.api.userId = re.value;
                    }
                });
                this.staticName = [
                    'Jane',
                    'Jenny',
                    'Alex',
                    'Heather',
                    'Becky',
                ];
                Storage.get({key: 'userName'}).then((re) => {
                    if (re.value) {
                        if (re.value == 'jane') {
                            this.route.navigate(['/home']);
                        } else if (this.staticName.find(r => r != 'jane')) {
                            this.route.navigate(['/welcome-helper']);
                        }
                    }
                });
                this.database.collection('user_name').get().subscribe((data) => {
                    data.docs.map((r: any) => {
                        if (r.data()) {
                            console.log(r.data(), 'dataaaaaa');
                            this.userList.push(r.data());
                        }
                    });
                    this.userList.map((re) => {
                        this.staticName = this.staticName.filter(r => r.toLowerCase() != re.userName);
                    });
                });
            }
        });
    }

    ionViewWillEnter() {
        this.problem.map((r) => {
            this.promiseArr.push(new Promise((resolve, reject) => this.storeProblem(r, resolve, reject)));
        });
        Promise.all(this.promiseArr).then(re => {
            Storage.set({
                key: 'problems',
                value: JSON.stringify(this.problemArr)
            }).then(success => console.log('success', this.problemArr));
        });
        this.solutions.map((r) => {
            this.solutionPromise.push(new Promise(async (resolve, reject) => this.storeSolution(r, await resolve, reject)));
        });
        Promise.all(this.solutionPromise).then(re => {
            Storage.set({
                key: 'solutions',
                value: JSON.stringify(this.solutionsArr)
            }).then(success => console.log('success arrr', this.solutionsArr));
        });
    }

    changeName(event) {
        console.log(this.api.userId);
        this.database.collection('user_name').add({
            userName: event.detail.value,
            userId: JSON.stringify(this.api.userId)
        }).then((re) => {
            Storage.set({
                key: 'userName',
                value: event.detail.value,
            });
            if (event.detail.value === 'jane') {
                this.route.navigate(['/home']);
            } else {
                this.route.navigate(['/welcome-helper']);
            }
        });
    }

    storeSolution(r, resolve, reject) {
        this.http.get(r.solution, {responseType: 'blob'})
            .subscribe(res => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    this.solutionsArr.push({problem: r.problem, solution: base64data});
                    return resolve();
                };
                reader.readAsDataURL(res);
            });
    }

    storeProblem(r, resolve, reject) {
        this.http.get(r.value, {responseType: 'blob'})
            .subscribe(response => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    const data = {
                        src: base64data,
                        formats: ['text', 'data', 'html'],
                        data_options: {
                            include_asciimath: true,
                            include_latex: true
                        }
                    };
                    this.api.renderImage(data).subscribe((res) => {
                        if (res.text) {
                            this.problemArr.push({problem: r.problem, value: res.text});
                        }
                        return resolve();
                    }, error => {
                        console.log(error);
                        return reject;
                    });
                };
                reader.readAsDataURL(response);
            });
    }
}
