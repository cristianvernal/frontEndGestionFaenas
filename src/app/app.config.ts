
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
  withFetch,
} from '@angular/common/http';
import {
  BrowserAnimationsModule,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from '@azure/msal-browser';
import {
  MsalInterceptor,
  MSAL_INSTANCE,
  MsalInterceptorConfiguration,
  MsalGuardConfiguration,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
} from '@azure/msal-angular';
import { environment } from '../environments/environment';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync()]
// };


export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1_signupsignin1",  
    editProfile: "B2C_1_profileediting1",
  },
  authorities: {
    signUpSignIn: {
      authority:
        "https://proyectoDeTitulo2024.b2clogin.com/proyectoDeTitulo2024.onmicrosoft.com/B2C_1_signupsignin1",
    },
    editProfile: {
      authority:
        "https://proyectoDeTitulo2024.b2clogin.com/proyectoDeTitulo2024.onmicrosoft.com/B2C_1_profileediting1",
    },
  },
  authorityDomain: "proyectoDeTitulo2024.b2clogin.com",
};

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.adb2cConfig.clientId,
      authority: b2cPolicies.authorities.signUpSignIn.authority, //environment.msalConfig.auth.authority,
      knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
      redirectUri: 'http://3.90.157.39',
      postLogoutRedirectUri: '/',
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  //have this set if more microservice used or requires different scope for different controllers
  protectedResourceMap.set(
    environment.adb2cConfig.apiEndpointUrl, // This is for all controllers
    environment.adb2cConfig.scopeUrls
  );

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...environment.adb2cConfig.scopeUrls],
    },
    loginFailedRoute: '/login-failed',
  };
}
//provideRouter(routes,withRouterConfig({ onSameUrlNavigation: 'reload' })),
export const appConfig: ApplicationConfig = {
  providers: [    
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),    
    importProvidersFrom(
      BrowserModule      
    ),
    provideNoopAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
