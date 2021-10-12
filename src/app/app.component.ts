import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SplashScreen} from '@capacitor/splash-screen';
import {ActionPerformed, PushNotifications, PushNotificationSchema, Token,} from '@capacitor/push-notifications';
import {PhotoService} from './services/photo.service';
import {AlertController} from '@ionic/angular';
import {ApiService} from './api.service';
import {Storage} from '@capacitor/storage';
import {CSHelper} from './helpers';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    subscribe: any;
    token;


    // All for android
    // 1. npm install
    // 2. ionic build - www
    // 3. npx cap add android - will take all the files www
    // 4. npx cap copy

    // For IOS
    // 1. ionic build if not applied already
    // 2. npx cap add ios if ios folder already exist then run npx cap copy

    constructor(private ser: PhotoService,
                private api: ApiService,
                private http: HttpClient,
                private helper: CSHelper,
                private route: Router,
                private database: AngularFirestore,
                public alertController: AlertController
    ) {
        this.initializeApp();
        console.log('SkillBlasster')
        // this.permission.requestPermissions(this.permission.PERMISSION.CAMERA).then((re) => {
        //     alert('Camera Permission Taken');
        // });
    }

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    ngOnInit() {
        // On success, we should be able to receive notifications
        PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
                // Register with Apple / Google to receive push via APNS/FCM
                PushNotifications.register();
            } else {
                // Show some error
            }
        });


        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration',
            (token: Token) => {
                console.log(token.value, 'notificationDeviceToken');
                this.api.emitToken(token.value);
            }
        );
        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError',
            (error: any) => {
                alert('Error on registration: ' + JSON.stringify(error));
            }
        );

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
            async (notification: PushNotificationSchema) => {
                console.log(notification, 'pushNotificationReceived');
                if (this.route.url !== '/') {
                    if (JSON.parse(notification.data.user).type === 'helper') {
                        await this.helper.emitHelperNotification(notification.data.user);
                        if (this.route.url !== '/question-screen') {
                            const alert = await this.alertController.create({
                                header: 'Found Help!',
                                subHeader: 'Simplify found help for you!',
                                buttons: [
                                    {
                                        text: 'Show help', handler: () => {
                                            this.route.navigate(['/question-screen']);
                                        }
                                    },
                                    'Close']
                            });
                            await alert.present();
                            await alert.onDidDismiss().then(() => {
                            });
                        }
                    } else if (JSON.parse(notification.data.user).type === 'session') {
                        await this.helper.emitHelperNotification(notification.data.user);
                        if (this.route.url !== '/found-solution/session-connection') {
                            await this.route.navigate(['/found-solution/session-connection']);
                        }
                    } else {
                        await this.helper.emitNotification(notification.data.user);
                        await this.route.navigate(['/helper-home']);
                    }
                }
            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            async (notification: ActionPerformed) => {
                console.log(notification, 'pushNotificationActionPerformed');
                if (JSON.parse(notification.notification.data.user).type === 'helper') {
                    await this.helper.emitHelperNotification(notification.notification.data.user);
                    await this.route.navigate(['/question-screen']);
                } else if (JSON.parse(notification.notification.data.user).type === 'session') {
                    await this.helper.emitHelperNotification(notification.notification.data.user);
                    await this.route.navigate(['/found-solution/session-connection']);
                } else {
                    await this.helper.emitNotification(notification.notification.data.user);
                    await this.route.navigate(['/helper-home']);
                }
            }
        );
    }

    initializeApp() {
        SplashScreen.hide();
        this.database.collection('user_name').get().subscribe((data) => {
            if (data.docs.length < 1) {
                Storage.clear();
                this.route.navigate(['/welcome-app']);
            }
        });
    }

    ngAfterViewInit() {
        this.api.notificationToken.subscribe(r => {
            console.log('2 times log');
            if (r && !this.token) {
                console.log(r, 'notificationTokennotificationTokennotificationToken');
                this.token = r;
                Storage.get({key: 'uid'}).then((re) => {
                    if (!re.value) {
                        this.api.login(r).then((res) => {
                            console.log(res);
                        });
                    }
                });
            }
        })
    }

    initWebRTC() {
        const constraints = {
            video: true,
            audio: false
        };

        navigator.mediaDevices.getUserMedia(constraints).then(r => {
            console.log(r);
        });
    }
}
