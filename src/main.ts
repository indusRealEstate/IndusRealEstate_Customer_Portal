/// <reference types="@angular/localize" />

/*!

=========================================================
* Indus Real Estate Customer Portal - v0.1.9
=========================================================

* Coded by Ajeer

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import "hammerjs";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import {Provider} from '@angular/core';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
