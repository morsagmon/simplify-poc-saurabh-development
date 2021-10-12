import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HelperHomeComponent} from "./helper-home.component";
import {IonicModule} from "@ionic/angular";

const routes: Routes = [
    {
        path: '',
        component: HelperHomeComponent,
    }
];

@NgModule({
    declarations: [HelperHomeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        IonicModule,
    ]
})
export class HelperHomeModule {
}
