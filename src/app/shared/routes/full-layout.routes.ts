import {Routes} from '@angular/router';


// tslint:disable-next-line:variable-name
export const Full_ROUTES: Routes = [
    {
        path: 'home',
        loadChildren: () => import('../../pages/main/home/home.module').then(m => m.HomeModule),
    },
    {
        path: 'helpers',
        loadChildren: () => import('../../pages/main/helpers/helpers.module').then(m => m.HelpersModule),
    },
    {
        path: 'question-screen',
        loadChildren: () => import('../../pages/main/question-screen/question-screen.module').then(m => m.QuestionScreenModule),
    },
    {
        path: 'helper-home',
        loadChildren: () => import('../../pages/main/helper-home/helper-home.module').then(m => m.HelperHomeModule),
    },
    {
        path: 'welcome-helper',
        loadChildren: () => import('../../pages/main/welcom-home/welcom-home.module').then(m => m.WelcomHomePageModule),
    },
    {
        path: 'welcome-app',
        loadChildren: () => import('../../pages/main/welcome-app/welcome-app.module').then(m => m.WelcomeAppPageModule),
    },
    {
        path: 'found-solution',
        loadChildren: () => import('../../pages/main/solutions/solutions.module').then(m => m.SolutionsModule),
    },
];

