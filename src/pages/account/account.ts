import { Component } from "@angular/core";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { User } from "../../providers/user/user";
import { Utils } from "../../providers/utils/utils";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import { APP_VERSION, API_URL } from "../../env";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
	selector: "page-account",
	templateUrl: "account.html"
})
export class AccountPage {
	user;
	tabTask;
	tabQuotes;
	pushNotificationToggle;
	userAgent;
	translate;
	alertAllNewOportunities;
	alertNewOportunities;
	alertLastHourResume;
	alertDailyResume;
	alertOtherNotifications;
	msgMyAccount = "Minha Conta";
	msgAvaliacoes = "avaliações";
	msgCredits = "créditos";
	msgCreditsUpper = "Créditos";
	msgLogout = "Encerrar sessão";
	msgPerfil = "Perfil";
	msgAjuda = "Ajuda";
	msgBrowser = "Esta opção irá abrir o browser do seu telemóvel, aceita?";
	msgNo = "Não";
	msgYes = "Sim";
	profileURL = `${API_URL}/profile`;
	helpURL = "https://zaask.zendesk.com/hc/pt";
	creditosUrl = `${API_URL}/creditos/comprar`;
	settingsUrl = `${API_URL}/definicoes`;
	msgNotifications = "Notificações";
	msgAllNewOportunities = "Todas as novas oportunidades";
	msgNewOportunities = "Lembrete de novas oportunidades";
	msgLastHourResume = "Resumo da última hora";
	msgDailyResume = "Resumo diário";
	msgOtherNotifications = "Outras notificações";
	msgSettings = "Definições";

	constructor(public nav: NavController, public navParams: NavParams, public zaaskServices: ZaaskServices, public platform: Platform, public utils: Utils, public userProvider: User, public ga: GoogleAnalytics, private storage: Storage) {
		this.tabTask = "TaskPage";
		this.tabQuotes = "QuotesPage";
		// this.pushNotificationToggle = this.user.notifications;

		this.userAgent = window.navigator && window.navigator.userAgent;

		this.getUserFields();

		// Check Push Notifications status
		this.zaaskServices.authRequest().subscribe(
			(data: any) => {
				let user = data.user;
				//set notification alert's flags
				this.alertAllNewOportunities = user.notifEvent1 == 1 || false;
				this.alertNewOportunities = user.notifEvent2 == 1 || false;
				this.alertLastHourResume = user.notifEvent3 == 1 || false;
				this.alertDailyResume = user.notifEvent4 == 1 || false;
				this.alertOtherNotifications = user.notifEvent5 == 1 || false;
			},
			(error) => {
				console.log("auth error", error);
			}
		);
		//console.log(this.user);
	}

	async getUserFields() {
		this.user = await this.userProvider.get();
		console.log(this.user);
		this.translate =
			this.userProvider.getCountry() === "PT"
				? {
						msgPedidosDisponiveis: "PEDIDOS",
						msgPedidosAdquiridos: "CAIXA DE ENTRADA",
						msgMyAccount: "DEFINIÇÕES"
				  }
				: {
						msgPedidosDisponiveis: "Pedidos",
						msgPedidosAdquiridos: "Buzón de entrada",
						msgMyAccount: "Definiciones"
				  };
		this.setText();
	}

	containsAll(needles, haystack) {
		for (var i = 0, len = needles.length; i < len; i++) {
			if (haystack.indexOf(needles[i]) == -1) return false;
		}
		return true;
	}

	ionViewWillEnter() {
		//Google Analytics
		this.platform.ready().then(() => {
			this.ga.trackView("Account Screen - " + APP_VERSION, "account.html");
		});
	}

	logout() {
		this.userProvider.clearUser();
		//this.nav.setRoot(LoginPage);
		this.nav.setRoot("LoginPage");
	}

	openNotificationsModal(user) {
		this.nav.push("AccountNotificationsPage", { userID: user });
	}

	launchProfileUrl() {
		var platformId = null;
		var versionId = null;
		if (typeof this.platform.versions().android !== "undefined") {
			platformId = "Android";
			versionId = this.platform.versions().android.str || "6";
		}
		//fix inapp upload bug in Android versions <= 6
		// var browser = null;
		// if (platformId == "Android" && Number(versionId.substr(0, 1)) <= 6) {
		// 	browser = this.utils.launchInApp(this.profileURL, "_system", this.user.uniqcode, false);
		// } else {
		// 	browser = this.utils.launchInApp(this.profileURL, "_blank", this.user.uniqcode, this.platform.is("ios"));
		// }
		var browser = this.utils.launchInApp(this.profileURL, "_blank", this.user.uniqcode, this.platform.is("ios"));
		browser.on("exit").subscribe((event) => {
			this.loadUser();
		});
	}

	launchHelpUrl() {
		var browser = this.utils.launchInApp(this.helpURL, "_blank", this.user.uniqcode, this.platform.is("ios"));
		browser.on("exit").subscribe((event) => {
			this.loadUser();
		});
	}

	launchCreditos() {
		var browser = this.utils.launchInApp(this.creditosUrl, "_blank", this.user.uniqcode, this.platform.is("ios"));
		browser.on("exit").subscribe((event) => {
			this.loadUser();
		});
	}

	async loadUser() {
		const user = await this.storage.get("user");

		this.zaaskServices.authRequestWithTokenParam(user.api_token).subscribe(
			(data: any) => {
				this.user = data.user;
				this.userProvider.setUserNew(data.user);
				this.zaaskServices.saveUserData(data);
			},
			(error) => {}
		);
	}

	launchSettings() {
		this.utils.launchInApp(this.settingsUrl, "_blank", this.user.uniqcode, this.platform.is("ios"));
	}

	setText() {
		if (this.userProvider.getCountry() == "PT") {
		} else {
			this.msgMyAccount = "Mi Cuenta";
			this.msgAvaliacoes = "valoraciones";
			this.msgCredits = "créditos";
			this.msgCreditsUpper = "Créditos";
			this.msgLogout = "Cerrar sesión";
			this.msgPerfil = "Perfil";
			this.msgAjuda = "Ayuda";
			this.msgBrowser = "Esta opción abrirá el navegador de tu móvil, aceptas?";
			this.msgNo = "No";
			this.msgYes = "Si";
			this.profileURL = "https://zaask.es/profile";
			this.helpURL = "https://zaask.zendesk.com/hc/es";
			this.creditosUrl = "https://zaask.es/creditos/comprar";
			this.settingsUrl = "https://www.zaask.es/definiciones";
			this.msgNotifications = "Notificaciones";
			this.msgAllNewOportunities = "Todas las nuevas oportunidades";
			this.msgNewOportunities = "Recordatorio de nuevas oportunidades";
			this.msgLastHourResume = "Resumen de la última hora";
			this.msgDailyResume = "Resumen diario";
			this.msgOtherNotifications = "Otras noticias";
			this.msgSettings = "Definiciones";
		}
	}

	tabRedirect(name) {
		this.nav.setRoot(name);
	}

	changeToggle(event) {
		let notificationFlag = "";
		let status = 0;
		switch (event) {
			case "allNewOportunities":
				notificationFlag = "notifEvent1";
				status = this.alertAllNewOportunities;
				break;
			case "newOportunities":
				notificationFlag = "notifEvent2";
				status = this.alertNewOportunities;
				break;
			case "lastHourResume":
				notificationFlag = "notifEvent3";
				status = this.alertLastHourResume;
				break;
			case "dailyResume":
				notificationFlag = "notifEvent4";
				status = this.alertDailyResume;
				break;
			case "otherNotifications":
				notificationFlag = "notifEvent5";
				status = this.alertOtherNotifications;
				break;
		}
		//
		this.zaaskServices.setAlert(notificationFlag, Number(status)).subscribe(
			(data) => {
				console.log("success");
			},
			(error) => {
				console.log(JSON.stringify(error));
			}
		);
	}
}
