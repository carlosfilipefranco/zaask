import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { TabsPage } from "../pages/tabs/tabs";
import { User } from "../providers/user/user";
import { ZaaskServices } from "../providers/zaask-services/zaask-services";
import { QuotesListProvider } from "../providers/quotes-list/quotes-list";
import { Storage } from "@ionic/storage";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Device } from "@ionic-native/device";
import { AppVersion } from "@ionic-native/app-version";

@Component({
	templateUrl: "app.html"
})
export class MyApp {
	rootPage: any = "TabsPage";
	asd: any;
	msgTitle = "Pedidos Adquiridos";
	msgOrcamNaoEnviados = "Orçam. Não Enviados";
	msgOrcamEnviados = "Orçam. Enviados";
	msgClientesGanhos = "Clientes Ganhos";
	msgClientesPerdidos = "Clientes Perdidos";
	msgPedidosReembolsados = "Pedidos Reembolsados";
	msgPedidosArquivados = "Pedidos Arquivados";

	uuid: any;
	versionId: any;
	platformId: any;
	appVersion: any = "";

	constructor(public statusBar: StatusBar, public splashScreen: SplashScreen, public user: User, public zaaskServices: ZaaskServices, public quotesList: QuotesListProvider, public platform: Platform, public storage: Storage, public iab: InAppBrowser, public device: Device, private app: AppVersion) {
		this.initializeApp();
	}

	setText() {
		if (this.user.getCountry() != "PT") {
			this.msgTitle = "Pedidos Adquiridos";
			this.msgOrcamNaoEnviados = "Pres. No Enviados";
			this.msgOrcamEnviados = "Pres. Enviados";
			this.msgClientesGanhos = "Clientes Adjudicados";
			this.msgClientesPerdidos = "Clientes Perdidos";
			this.msgPedidosReembolsados = "Pedidos Reembolsados";
			this.msgPedidosArquivados = "Pedidos Archivados";
		}
	}

	launch(url) {
		this.platform.ready().then(() => {
			this.iab.create(url, "_system", "location=true").show();
		});
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();

			// console.log("app::initializeApp - device: " + window.device);

			// GoogleAnalytics.startTrackerWithId("UA-82619047-1");

			if (typeof this.device !== "undefined") {
				this.uuid = this.device.uuid;
				this.versionId = this.device.version;
				this.platformId = this.device.platform;
			} else {
				if (typeof this.platform.versions().ios !== "undefined") {
					this.platformId = "IOS";
					this.versionId = this.platform.versions().ios.str;
				} else if (typeof this.platform.versions().android !== "undefined") {
					this.platformId = "Android";
					this.versionId = this.platform.versions().android.str || "6";
				}
			}

			this.appVersion;

			this.app.getVersionNumber().then((s) => {
				console.log("ver: " + s);
				this.appVersion = s;
			});

			this.loadUserFromLocalStorageNew();
		});
	}

	loadUserFromLocalStorageNew() {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			//  const event = { email: user.email, password: user.password };
			this.zaaskServices.authRequestWithTokenParam(user.api_token).subscribe(
				(data: any) => {
					this.zaaskServices.storeMobileLogin(user.api_token, this.uuid, this.platformId, this.versionId, "autologin").subscribe();

					const userResponse = JSON.parse(data._body);

					userResponse.user.api_token = user.api_token;
					// userResponse.user.password = user.password;
					userResponse.user.email = user.email;
					userResponse.user.id = user.id;
					this.user.setUserNew(userResponse.user);
					//console.log(userResponse);
					this.setText();
					this.zaaskServices.saveUserData(data);
					this.rootPage = "TaskPage";
				},
				(error) => {
					this.rootPage = "LoginPage";
					console.log("login error", error);
				}
			);
		} else {
			this.rootPage = "LoginPage";
		}
	}
}
