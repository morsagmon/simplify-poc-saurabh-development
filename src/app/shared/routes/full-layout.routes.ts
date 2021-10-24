import {Routes} from '@angular/router';


// tslint:disable-next-line:variable-name
export const Full_ROUTES: Routes = [
    {   //Learner (Jane) home page before asking for Help. My Helpers and Get Help buttons are available.
        path: 'home',
        loadChildren: () => import('../../pages/main/home/home.module').then(m => m.HomeModule),
    },
    {   //My Helpers page
        path: 'helpers',
        loadChildren: () => import('../../pages/main/helpers/helpers.module').then(m => m.HelpersModule),
    },
    {   //Main dynamic problem and helpers invitation page - helpers responses are changing and call for Limnu session
        path: 'question-screen',
        loadChildren: () => import('../../pages/main/question-screen/question-screen.module').then(m => m.QuestionScreenModule),
    },
    {   //Helper main screen: Jane is requesting help - what's your reply.
        path: 'helper-home',
        loadChildren: () => import('../../pages/main/helper-home/helper-home.module').then(m => m.HelperHomeModule),
    },
    {   //Helper home page: greeting and instructions to close the app and be notified when help is requested
        path: 'welcome-helper',
        loadChildren: () => import('../../pages/main/welcom-home/welcom-home.module').then(m => m.WelcomHomePageModule),
    },
    {   //First time device user selection page
        path: 'welcome-app',
        loadChildren: () => import('../../pages/main/welcome-app/welcome-app.module').then(m => m.WelcomeAppPageModule),
    },
    {   //Solutions browsing page. Limnu+Chat page is below in open-frame
        path: 'found-solution',
        loadChildren: () => import('../../pages/main/solutions/solutions.module').then(m => m.SolutionsModule),
    },
];

