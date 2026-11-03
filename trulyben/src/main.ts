import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { 
  provideKeycloak, 
  includeBearerTokenInterceptor,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService
} from 'keycloak-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Capacitor } from '@capacitor/core';
import { environment } from './environments/environment';

const initializeApp = async () => {
  const isNative = Capacitor.isNativePlatform();
  const redirectUri = isNative 
    ? 'com.trulyben.app://callback' 
    : environment.web_url;

  await bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withPreloading(PreloadAllModules)),

      provideKeycloak({
        config: {
          url: environment.keycloak_url,
          realm: environment.keycloak_realm,
          clientId: environment.keycloak_clientid
        },
        initOptions: {
          pkceMethod: 'S256',
          redirectUri: redirectUri,
          checkLoginIframe: false,
          onLoad: undefined
        },
        features: [
          withAutoRefreshToken({
            onInactivityTimeout: 'logout',
            sessionTimeout: 300_000
          })
        ],
        providers: [AutoRefreshTokenService, UserActivityService]
      }),

      provideHttpClient(withInterceptors([includeBearerTokenInterceptor]))
    ],
  });
};

initializeApp().catch(err => {
  console.error('Failed to bootstrap application', err);
})

