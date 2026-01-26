import { Component, inject, OnInit } from '@angular/core';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  private keycloak = inject(Keycloak);

  async ngOnInit() {
    if (!this.keycloak.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + '/home'
      });
    }
  }
}
