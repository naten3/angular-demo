import { Component } from '@angular/core';
import 'rxjs/add/observable/fromevent';
import { Router, ActivatedRoute } from '@angular/router';

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
