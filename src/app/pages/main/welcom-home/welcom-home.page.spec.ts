import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {WelcomHomePage} from './welcom-home.page';

describe('WelcomHomePage', () => {
    let component: WelcomHomePage;
    let fixture: ComponentFixture<WelcomHomePage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [WelcomHomePage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(WelcomHomePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
