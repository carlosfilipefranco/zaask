import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";

import { TabsPage } from "../pages/tabs/tabs";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { QuotesListProvider } from "../providers/quotes-list/quotes-list";
import { User } from "../providers/user/user";
import { ZaaskServices } from "../providers/zaask-services/zaask-services";
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Device } from "@ionic-native/device";
import { AppVersion } from "@ionic-native/app-version";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Utils } from "../providers/utils/utils";

@NgModule({
	declarations: [MyApp, TabsPage],
	imports: [BrowserModule, IonicModule.forRoot(MyApp), IonicStorageModule.forRoot(), HttpClientModule, FormsModule, ReactiveFormsModule],
	bootstrap: [IonicApp],
	entryComponents: [MyApp, TabsPage],
	providers: [StatusBar, SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler }, QuotesListProvider, User, ZaaskServices, Device, AppVersion, InAppBrowser, Utils]
})
export class AppModule {}
