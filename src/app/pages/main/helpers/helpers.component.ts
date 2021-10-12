import {Component, OnInit} from '@angular/core';
import {CSHelper} from '../../../helpers';
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
    selector: 'app-helpers',
    templateUrl: './helpers.component.html',
    styleUrls: ['./helpers.component.scss'],
})
export class HelpersComponent implements OnInit {

    helperList = [];

    constructor(public helper: CSHelper, private database: AngularFirestore) {
    }

    ngOnInit() {
        this.helper.loadingStart()
        this.database.collection('user_name').get().subscribe((re) => {
            this.helper.loadingStopped();
            let item: any = {};
            re.docs.map((r: any) => {
                item = r.data();
                if (item.userName != 'jane') {
                    switch (item.userName) {
                        case 'jenny':
                            item.image = 'assets/images/helper-1.svg';
                            item.relation = 'Friend';
                            break;
                        case 'alex':
                            item.image = 'assets/images/helper-2.svg';
                            item.relation = 'Parents';
                            break;
                        case 'heather':
                            item.image = 'assets/images/helper-3.svg';
                            item.relation = 'My Teacher';
                            break;
                        case 'becky':
                            item.image = 'assets/images/helper-4.svg';
                            item.relation = 'Tutor';
                            break;
                    }
                    console.log(item);
                    this.helperList.push(item);
                }
            });
        });
    }

}
