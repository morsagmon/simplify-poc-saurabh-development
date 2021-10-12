import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {WelcomeAppPage} from './welcome-app.page';

describe('WelcomeAppPage', () => {
    let component: WelcomeAppPage;
    let fixture: ComponentFixture<WelcomeAppPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [WelcomeAppPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(WelcomeAppPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
