import {registerLocaleData} from '@angular/common';
import {bootstrapApplication} from '@angular/platform-browser';
import localeRu from '@angular/common/locales/ru';
import {App} from './app/app';
import {appConfig} from './app/app.config';

registerLocaleData(localeRu);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
