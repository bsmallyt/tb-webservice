import { Component, effect, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import Keycloak from 'keycloak-js';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, RouterLink],
})
export class HomePage {
  private keycloak = inject(Keycloak);
  dis = window.location.href;

  constructor() {}

  get loggedIn(): boolean {
    return this.keycloak.authenticated ?? false;
  }

  get username(): string | null {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? null;
  }

  async login() {
    const isNative = Capacitor.isNativePlatform();
    const redirectUri = isNative ? 'com.trulyben.app://callback' : environment.web_url;

    if (isNative) {
      const loginUrl = await this.keycloak.createLoginUrl({ redirectUri });
      await Browser.open({ url: loginUrl });
    } else {
      this.keycloak.login({ redirectUri: redirectUri });
    }
  }
}
