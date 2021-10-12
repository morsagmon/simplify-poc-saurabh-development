import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SolutionsPage} from './solutions.page';
import {OpenFrameComponent} from './open-frame/open-frame.component';

const routes: Routes = [
    {
        path: '',
        component: SolutionsPage
    },
    {
        path: 'session-connection',
        component: OpenFrameComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SolutionsRoutingModule {
}
