import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { OverlayContainer } from '@angular/cdk/overlay';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CalendarModule, DateAdapter as CalendarDateAdapter, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter, MAT_NATIVE_DATE_FORMATS, MAT_DATE_FORMATS } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),  // Comment this line to enable lazy-loading
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(CalendarModule.forRoot({
      provide: CalendarDateAdapter,
      useFactory: adapterFactory
    })),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: NativeDateAdapter }, // Ensure DateAdapter is provided
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }, // Use default MAT_NATIVE_DATE_FORMATS
  ]
};
