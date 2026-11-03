import { Component, inject, NgZone, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import Keycloak from 'keycloak-js';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private keycloak = inject(Keycloak);

  constructor(private router: Router) {
    //this.setUpDeepLinks();
  }

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      await this.handleNativeAuth();
    } else {
      await this.initKeycloak();
    }
  }

  private async handleNativeAuth() {
    const launchUrl = await App.getLaunchUrl();
    if (launchUrl?.url?.startsWith('com.trulyben.app://callback')) {
      this.processCallback(launchUrl.url);
    }

    App.addListener('appUrlOpen', async ({ url }) => {
      console.log("url: ", url);
      if (url.startsWith('com.trulyben.app://callback')) {
        await Browser.close();
        this.processCallback(url);
        await this.initKeycloak();
        //this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    });

    await this.initKeycloak();
  }

  private processCallback(url: string) {
    const query = url.split('?')[1];
    if (query) {
      window.history.replaceState({}, document.title, '/?' + query);
    }
  }

  private async initKeycloak() {
    await this.keycloak.init({
      pkceMethod: 'S256',
      checkLoginIframe: false,
      redirectUri: Capacitor.isNativePlatform()
        ? 'com.trulyben.app://callback'
        : environment.web_url,
      onLoad: 'check-sso'
    });
  }

  setUpDeepLinks() {
    App.addListener('appUrlOpen', ({ url }) => {
      if (url.startsWith('com.trulyben.app://callback')) {
        
        const query = url.split('?')[1];

        if (query) {
          window.history.replaceState({}, document.title, '/?' + query);

          //await this.keycloak.keycloakEvents$.pipe().subscribe();


        }
      }
    });

    /*
    App.addListener('appUrlOpen', async (event) => {
      if (event.url.includes('code=')) {
        console.log('handling callback: ', event.url);

        const url = new URL(event.url);

        window.history.replaceState({}, '', url.hash);

        await this.keycloak.updateToken(0);

        console.log('Authenticated:', this.keycloak.authenticated);
      }
    });*/
  }
}
