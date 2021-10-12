import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {WelcomHomePageRoutingModule} from './welcom-home-routing.module';

import {WelcomHomePage} from './welcom-home.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WelcomHomePageRoutingModule
    ],
    declarations: [WelcomHomePage]
})
export class WelcomHomePageModule {
}
