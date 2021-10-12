import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {SolutionsPage} from './solutions.page';

describe('SolutionsPage', () => {
    let component: SolutionsPage;
    let fixture: ComponentFixture<SolutionsPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SolutionsPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(SolutionsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
