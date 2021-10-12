import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {Full_ROUTES} from './shared/routes/full-layout.routes';
import {FullLayoutComponent} from './layout/full/full-layout.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome-app',
        pathMatch: 'full',
    },
    {
        path: '',
        component: FullLayoutComponent,
        data: {title: 'full Views'},
        children: Full_ROUTES,
    },
    {
        path: 'welcom-home',
        loadChildren: () => import('./pages/main/welcom-home/welcom-home.module').then(m => m.WelcomHomePageModule)
    },
    {
        path: 'welcome-app',
        loadChildren: () => import('./pages/main/welcome-app/welcome-app.module').then(m => m.WelcomeAppPageModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
