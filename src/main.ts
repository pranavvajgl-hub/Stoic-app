import { enableProdMode, importProvidersFrom } from '@angular/core';

import { bootstrapApplication, HammerModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import * as Hammer from 'hammerjs';


export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    'press': { time: 500 },

    'swipe': { direction: Hammer.DIRECTION_ALL },
    'pinch': { enable: true },
    'rotate': { enable: true },
  };
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    importProvidersFrom(HammerModule),
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    provideHttpClient()
  ],
});