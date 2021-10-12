import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {QuestionScreenComponent} from './question-screen.component';

const routes: Routes = [
    {
        path: '',
        component: QuestionScreenComponent,
    }
];

@NgModule({
    declarations: [QuestionScreenComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        IonicModule,
    ],
})
export class QuestionScreenModule {
}
