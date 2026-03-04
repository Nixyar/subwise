import {registerLocaleData} from '@angular/common';
import {bootstrapApplication} from '@angular/platform-browser';
import localeRu from '@angular/common/locales/ru';
import {AppShellComponent} from './app/core/layout/app-shell.component';
import {appConfig} from './app/app.config';

registerLocaleData(localeRu);

bootstrapApplication(AppShellComponent, appConfig).catch((err) => console.error(err));
