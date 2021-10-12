import {Component, OnInit} from '@angular/core';
import {CSHelper} from "../../../helpers";
import {Storage} from "@capacitor/storage";

@Component({
    selector: 'app-welcom-home',
    templateUrl: './welcom-home.page.html',
    styleUrls: ['./welcom-home.page.scss'],
})
export class WelcomHomePage implements OnInit {
    userName;

    constructor(public helper: CSHelper) {
    }

    ngOnInit() {
        Storage.get({key: 'userName'}).then((re) => {
            if (re.value) {
                this.userName = re.value;
            }
        })
    }
}
