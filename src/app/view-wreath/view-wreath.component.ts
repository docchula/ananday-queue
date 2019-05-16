import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Queue} from '../queue';
import {map} from 'rxjs/operators';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
    selector: 'and-view-wreath',
    templateUrl: './view-wreath.component.html',
    styleUrls: ['./view-wreath.component.scss']
})
export class ViewWreathComponent implements OnInit {
    reserveForm: FormGroup;
    reservePos: string;

    constructor(private afd: AngularFireDatabase) {
    }

    ngOnInit() {
        this.reserveForm = new FormGroup({
            name: new FormControl('', Validators.required),
            wreath: new FormControl('', Validators.required),
            remarks: new FormControl('')
        });
        this.afd
            .list<Queue>('queues')
            .snapshotChanges()
            .subscribe(queues => {
                console.log(queues.values());
            });
    }

    showReserve(position) {
        this.reservePos = position;
    }

    arrayOfSequence(n: number): number[] {
        return Array.from(Array(n).keys()).map(n => {
            return ++n;
        });
    }
}
