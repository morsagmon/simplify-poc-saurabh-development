import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ContentLayoutComponent} from './layout/content/content-layout.component';
import {FullLayoutComponent} from './layout/full/full-layout.component';
import {AngularFireModule} from "@angular/fire";
import {AngularFireAnalyticsModule} from "@angular/fire/analytics";
import {AngularFireStorageModule} from "@angular/fire/storage";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';


@NgModule({
    declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAnalyticsModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireDatabaseModule,
    ],
    providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
    bootstrap: [AppComponent],
    exports: [RouterModule],
})
export class AppModule {
}
