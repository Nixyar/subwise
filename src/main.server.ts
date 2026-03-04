import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {
  BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';
import {AppShellComponent} from './app/core/layout/app-shell.component';
import {config} from './app/app.config.server';

registerLocaleData(localeRu);

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppShellComponent, config, context);

export default bootstrap;
