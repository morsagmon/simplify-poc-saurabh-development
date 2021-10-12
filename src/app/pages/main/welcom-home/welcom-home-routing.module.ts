import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {WelcomHomePage} from './welcom-home.page';

const routes: Routes = [
    {
        path: '',
        component: WelcomHomePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WelcomHomePageRoutingModule {
}
