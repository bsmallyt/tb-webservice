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

import { ConfigService } from './app/services/config/config';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';


const initializeApp = async () => {
  const cfg = await fetch('/assets/config.json').then(res => res.json());
  const configService = new ConfigService();
  configService.setConfig(cfg);
  const isMobile = !!(window as any).Capacitor;

  await bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withPreloading(PreloadAllModules)),

      { provide: ConfigService, useValue: configService },

      provideKeycloak({
        config: cfg.config,
        initOptions: {
          ...cfg.initOptions,
          pkceMethod: 'S256',
          checkLoginIframe: !isMobile,
          ...(isMobile ? {} : {
            silentCheckSsoRedirectUri: cfg.env.url + "/assets/silent-check-sso.html",
          })
        },
        features: [
          withAutoRefreshToken({
            onInactivityTimeout: 'logout',
            sessionTimeout: 60_000
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

