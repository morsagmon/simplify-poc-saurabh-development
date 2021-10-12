import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-content-layout',
    templateUrl: './content-layout.component.html',
    styleUrls: ['./content-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContentLayoutComponent implements OnInit {
    public config: any = {};
    layoutSub: Subscription;
    @ViewChild('content-wrapper') wrapper: ElementRef;


    constructor() {
    }

    ngOnInit() {
    }
}
