import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {SolutionsRoutingModule} from "./solutions-routing.module";
import {SolutionsPage} from "./solutions.page";
import {SafePipe} from "../../../shared/pipe/safe.pipe";
import {OpenFrameComponent} from "./open-frame/open-frame.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SolutionsRoutingModule
    ],
    declarations: [SolutionsPage, SafePipe, OpenFrameComponent]
})
export class SolutionsModule {
}
