import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromevent';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';

@Component({
    selector: 'app-email-verify',
    templateUrl: './email-verify.component.html'
})
export class EmailVerifyComponent {

    verifySuccess: boolean;

    constructor(private router: Router, private route: ActivatedRoute) {
        this.verifySuccess = route.snapshot.data['success'];
    }

    goToLogin() {
        this.router.navigate(['/']);
    }
}
