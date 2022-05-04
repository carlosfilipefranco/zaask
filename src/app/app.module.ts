import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
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
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { Facebook } from "@ionic-native/facebook";
import { Globalization } from "@ionic-native/globalization";
import { OneSignal } from "@ionic-native/onesignal";
import { CallNumber } from "@ionic-native/call-number";

@NgModule({
	declarations: [MyApp],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp, {
			autocomplete: "off",
			autocorrect: "off",
			scrollPadding: false,
			scrollAssist: false,
			autoFocusAssist: false,
			backButtonText: ""
		}),
		IonicStorageModule.forRoot(),
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule
	],
	bootstrap: [IonicApp],
	entryComponents: [MyApp],
	providers: [StatusBar, SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler }, QuotesListProvider, User, ZaaskServices, Device, AppVersion, InAppBrowser, Utils, GoogleAnalytics, Facebook, Globalization, OneSignal, CallNumber]
})
export class AppModule {}
