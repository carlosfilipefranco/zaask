import { Component } from "@angular/core";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { User } from "../../providers/user/user";
import { Utils } from "../../providers/utils/utils";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import { APP_VERSION } from "../../env";

@IonicPage()
@Component({
	selector: "page-account",
	templateUrl: "account.html"
})
export class AccountPage {
	userId;
	name;
	subtitle;
	reviewsAvg;
	numCredits;
	photoUrl;
	numReviews;
	userActivation;
	tabTask;
	tabQuotes;
	country;
	pushNotificationToggle;
	osUserId;
	osPushToken;
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
	profileURL = "https://zaask.pt/profile";
	helpURL = "https://zaask.zendesk.com/hc/pt";
	creditosUrl = "https://zaask.pt/creditos/comprar";
	settingsUrl = "https://www.zaask.pt/definicoes";
	msgNotifications = "Notificações";
	msgAllNewOportunities = "Todas as novas oportunidades";
	msgNewOportunities = "Lembrete de novas oportunidades";
	msgLastHourResume = "Resumo da última hora";
	msgDailyResume = "Resumo diário";
	msgOtherNotifications = "Outras notificações";
	msgSettings = "Definições";

	constructor(public nav: NavController, public navParams: NavParams, public zaaskServices: ZaaskServices, public platform: Platform, public utils: Utils, public user: User, public ga: GoogleAnalytics) {
		this.userId = this.user.getUserId();
		this.name = this.user.getName();
		this.subtitle = this.user.getSubTitle();
		this.reviewsAvg = this.user.getNumStars();
		this.numCredits = this.user.getUserField("lead_credits");
		this.photoUrl = this.user.getUserField("image");
		this.numReviews = this.user.getUserField("nreviews");
		this.userActivation = this.user.getUserActivation();
		this.tabTask = "TaskPage";
		this.tabQuotes = "QuotesPage";
		this.country = this.user.getCountry();
		// this.pushNotificationToggle = this.user.notifications;
		this.osUserId = this.user.getUserField("osUserId");
		this.osPushToken = this.user.getUserField("osPushToken");
		this.userAgent = window.navigator && window.navigator.userAgent;

		this.translate =
			this.country === "PT"
				? {
						msgPedidosDisponiveis: "PEDIDOS",
						msgPedidosAdquiridos: "CAIXA DE ENTRADA",
						msgMyAccount: "DEFINIÇÕES"
				  }
				: {
						msgPedidosDisponiveis: "Solicitudes",
						msgPedidosAdquiridos: "Buzón de entrada",
						msgMyAccount: "Definiciones"
				  };
		this.setText();

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
		this.user.clearUser();
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
		if (platformId == "Android" && Number(versionId.substr(0, 1)) <= 6) this.utils.launchInApp(this.profileURL, "_system", this.user.uniqcode, false);
		else this.utils.launchInApp(this.profileURL, "_blank", this.user.uniqcode, this.platform.is("ios"));
	}

	launchHelpUrl() {
		this.utils.launchInApp(this.helpURL, "_blank", this.user.uniqcode, this.platform.is("ios"));
	}

	launchCreditos() {
		this.utils.launchInApp(this.creditosUrl, "_blank", this.user.uniqcode, this.platform.is("ios"));
	}

	launchSettings() {
		this.utils.launchInApp(this.settingsUrl, "_blank", this.user.uniqcode, this.platform.is("ios"));
	}

	setText() {
		if (this.user.getCountry() == "PT") {
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
