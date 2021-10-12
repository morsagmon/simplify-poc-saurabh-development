import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HelpersComponent} from './helpers.component';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';

const routes: Routes = [
    {
        path: '',
        component: HelpersComponent,
    }
];

@NgModule({
    declarations: [HelpersComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        IonicModule,
    ],
    exports: [RouterModule],
})
export class HelpersModule {
}
