import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';
import { isPlatform } from '@ionic/angular/standalone';
import { ConfigService } from 'src/app/services/config/config';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  private keycloak = inject(Keycloak);
  private configService = inject(ConfigService);

  constructor() {}

  async login() {
    const redirectUri = this.configService.getConfig().env.url;

    console.log("redirectUri: " + redirectUri);
    console.log("configService.getConfig: " + this.configService.getConfig);

    if (isPlatform('hybrid')) {
      await Browser.open({
        url: await this.keycloak.createLoginUrl({ redirectUri: redirectUri }),
      })
    } else {
      this.keycloak.login({ redirectUri: redirectUri });
    }
  }
}
