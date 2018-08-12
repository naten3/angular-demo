import { Component } from '@angular/core';

import 'rxjs/add/observable/fromevent';
import { Router, ActivatedRoute } from '@angular/router';

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
