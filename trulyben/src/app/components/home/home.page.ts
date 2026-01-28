import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';
import { isPlatform } from '@ionic/angular/standalone';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  private keycloak = inject(Keycloak);

  constructor() {}

  async login() {
    if (isPlatform('hybrid')) {
      await Browser.open({
        url: await this.keycloak.createLoginUrl(),
      })
    } else {
      this.keycloak.login({});
    }
  }
}
