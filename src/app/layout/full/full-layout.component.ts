import {ChangeDetectorRef, Component, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss'],
})
export class FullLayoutComponent implements OnInit {
    overlayContent = false;
    configSub: Subscription;
    layoutSub: Subscription;
    bgColor: string;
    displayOverlayMenu = false; // Vertical Side menu for screenSize < 1200
    public config: any = {};
    public innerWidth: any;
    isMenuCollapsedOnHover = false;
    isScrollTopVisible = false;
    sidebar: any = true;
    windowSize;
    currentUrl = '';
    typesOfNames = [
        {name: 'home', image: 'assets/images/campaign/Left_Navigation_Sidebar_Home_icon.svg'},
        {name: 'campaigns', image: 'assets/images/campaign/Left_Navigation_Sidebar.svg'},
        {name: 'peeps', image: 'assets/images/campaign/Left_Navigation_Sidebar_Peeps_icon.svg'},
        {name: 'widget', image: 'assets/images/campaign/widget.svg'},
        {name: 'insights', image: 'assets/images/campaign/Left_Navigation_Sidebar_Insights_icon.svg'},
    ];
    sidebarSize = '180px';
    smallSide = false;

    navBar;
    landing;
    @ViewChild('drawer') drawer: any;

    constructor(
        private router: Router,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private cdr: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        if (window.innerWidth < 1199) {
            this.windowSize = true;
        } else {
            this.windowSize = false;
        }
        setTimeout(() => {
            this.cdr.detectChanges();
        }, 100);
    }
}
