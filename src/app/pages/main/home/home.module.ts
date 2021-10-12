import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {WebrtcService} from "../../../providers/webrtc.service";

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    }
];

@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        IonicModule,
    ],
    exports: [RouterModule],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    providers: [WebrtcService]
})
export class HomeModule {
}
