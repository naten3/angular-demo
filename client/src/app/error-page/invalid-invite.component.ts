import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromevent';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';

@Component({
  selector: 'app-invalid-invite',
  templateUrl: './invalid-invite.component.html'
})
export class InvalidInviteComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  goToLogin() {
    this.router.navigate(['/']);
  }
}
