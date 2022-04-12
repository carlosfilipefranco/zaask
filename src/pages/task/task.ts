import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { AlertController, IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { User } from "../../providers/user/user";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import moment from "moment-timezone";
import { Utils } from "../../providers/utils/utils";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { APP_VERSION, API_URL } from "../../env";
import { Facebook } from "@ionic-native/facebook";
import { OneSignal } from "@ionic-native/onesignal";

declare var window;

@IonicPage()
@Component({
	selector: "page-task",
	templateUrl: "task.html"
})
export class TaskPage {
	passwordType: string;
	tasks: any[];
	country: string;
	tabQuotes: string;
	tabAccount: string;
	userTimeZone: string;
	showInfinite: boolean;
	pagination: number;
	policyAccepted: boolean;
	showTerms: boolean;
	showPrivacyPolicy: boolean;
	translate: {
		title: string;
		details: string;
		ignore: string;
		msgPedidosDisponiveis: string;
		msgPedidosAdquiridos: string;
		msgMyAccount: string;
		emptyTitle: string;
		emptySubtitle: string;
		emptyButton: string;
		policyWarningTitle: string;
		policyWarningText_0: string;
		policyWarningText_1: string;
		policyWarningText_2: string;
		policyWarningText_3: string;
		policyWarningText_4: string;
		policyWarningText_5: string;
		policyWarningText_6: string;
		policyWarningText_7: string;
		policyWarningText_8: string;
		policyAccept: string;
	};
	pageContentClass = "task-page task-page__heigth";
	constructor(public nav: NavController, public form: FormBuilder, public platform: Platform, public zaaskServices: ZaaskServices, public user: User, public Utils: Utils, public Alert: AlertController, public ga: GoogleAnalytics, public facebook: Facebook, public oneSignal: OneSignal, private ref: ChangeDetectorRef) {
		this.passwordType = "password";
		this.tasks = [];
		this.country = this.user.getCountry();
		this.tabQuotes = "QuotesPage";
		this.tabAccount = "AccountPage";
		this.userTimeZone = moment.tz.guess();
		moment.locale(this.country.toLowerCase());
		this.showInfinite = true;
		this.pagination = 1;
		//
		this.policyAccepted = localStorage.getItem("terms_accepted") == "true";
		if (!this.policyAccepted) {
			this.pageContentClass = "task-page task-page__heigth task-page__heigth-backdrop";
		}
		this.showTerms = false;
		this.showPrivacyPolicy = false;
		//
		this.translate =
			this.country === "PT"
				? {
						title: "Novos Pedidos",
						details: "Ver detalhes",
						ignore: "Ignorar",
						msgPedidosDisponiveis: "PEDIDOS",
						msgPedidosAdquiridos: "CAIXA DE ENTRADA",
						msgMyAccount: "DEFINIÇÕES",
						emptyTitle: "Ainda não tem pedidos....",
						emptySubtitle: "Aumente as possibilidades de receber mais pedidos escolhendo mais categorias de negócio.",
						emptyButton: "EDITAR CATEGORIAS",
						policyWarningTitle: "Aceite os nossos Termos de Uso e Política de Privacidade",
						policyWarningText_0: "Por favor, leia e aceite os ",
						policyWarningText_1: "Termos de Uso",
						policyWarningText_2: " e a ",
						policyWarningText_3: "Política de Privacidade",
						policyWarningText_4: " da Zaask e a ",
						policyWarningText_5: "Política de Privacidade",
						policyWarningText_6: " e os ",
						policyWarningText_7: "Termos de Uso",
						policyWarningText_8: " da OneSignal.",
						policyAccept: "Li e aceito"
				  }
				: {
						title: "Nuevos pedidos",
						details: "Ver detalles",
						ignore: "Ignorar",
						msgPedidosDisponiveis: "Solicitudes",
						msgPedidosAdquiridos: "Buzón de entrada",
						msgMyAccount: "Definiciones",
						emptyTitle: "¡Los pedidos están de camino!",
						emptySubtitle: "Puedes aumentar las posibilidades de recibir oportunidades de negocio seleccionando más categorías de servicios.",
						emptyButton: "EDITAR CATEGORÍAS",
						policyWarningTitle: "Acepte nuestro Acuerdo de Uso y Política de Privacidad",
						policyWarningText_0: "Por favor lea y acepte el ",
						policyWarningText_1: "Acuerdo de Uso",
						policyWarningText_2: " y la  ",
						policyWarningText_3: "Política de Privacidad",
						policyWarningText_4: " de Zaask y la ",
						policyWarningText_5: "Política de Privacidad",
						policyWarningText_6: " y el ",
						policyWarningText_7: "Acuerdo de Uso",
						policyWarningText_8: " de OneSignal.",
						policyAccept: "He leído y acepto"
				  };
	}

	ionViewDidLoad() {
		this.loadTasks();

		this.requestConsent();

		//disable onesignal plugin until user accept privacy policy
		if (this.policyAccepted) {
			this.oneSignal.setRequiresUserPrivacyConsent(true);
			this.initOneSignal();
		} else {
			this.oneSignal.setRequiresUserPrivacyConsent(true);
			this.oneSignal.provideUserConsent(true);
			this.oneSignal.userProvidedPrivacyConsent((providedConsent) => {
				console.log("provided consent", providedConsent);
				if (providedConsent) this.initOneSignal();
			});
		}
	}

	ionViewWillEnter() {
		this.platform.ready().then(() => {
			//Google Analytics
			this.ga.trackView("Tasks Screen - " + APP_VERSION, "task.html");
			//Facebook Analytics
			this.facebook.logEvent("VIEW_CONTENT", { page: "task.html", version: APP_VERSION });
		});
	}

	initOneSignal() {
		if (this.platform.is("core") || this.platform.is("mobileweb")) {
			console.log("Platform is core or is mobile web");
			return;
		}
		//
		let funcaoRetorno = (data) => {
			if (typeof data.notification.payload.additionalData != "undefined" && typeof data.notification.payload.additionalData.task_id !== "undefined" && data.notification.payload.additionalData.task_id.length) {
				var taskId = data.notification.payload.additionalData.task_id;
				this.showTask(taskId);
			}
		};
		var iosSettings = {};
		iosSettings["kOSSettingsKeyAutoPrompt"] = true;
		iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
		//
		//
		if (this.country === "PT") {
			this.oneSignal
				.startInit("03f9ed5c-4a94-4db5-a692-f507940e2702", "170479296785")
				.iOSSettings(iosSettings) // only needed if added Optional OneSignal code for iOS above
				.handleNotificationOpened(funcaoRetorno)
				.endInit();
		} else {
			this.oneSignal
				.startInit("ad86c96f-3bb4-4351-8a31-134829e60e39", "170479296785")
				.iOSSettings(iosSettings) // only needed if added Optional OneSignal code for iOS above
				.handleNotificationOpened(funcaoRetorno)
				.endInit();
		}
		//
		this.oneSignal.getIds().then((ids: any) => {
			console.log("here");
			console.log(ids);
			this.user.setUserField("osUserId", ids.userId);
			this.user.setUserField("osPushToken", ids.pushToken);

			// Verify here if we update or not */
			this.isToSetPUshs(ids.userId, ids.pushToken);

			// Check Notifications status
			this.zaaskServices.authRequest().subscribe(
				(data: any) => {
					const responseData = data.user;
					Object.keys(responseData.pushNotifications).forEach((key) => {
						if (responseData.pushNotifications[key]["external_user_id"] == this.user.osUserId && responseData.pushNotifications[key]["user_agent"] == "ZaaskPRO" && responseData.pushNotifications[key]["is_subscribed"] == 1) {
							this.user.setUserField("notifications", true);
						}
					});
				},
				(error) => {
					console.log("auth error", error);
				}
			);
		});
	}

	isToSetPUshs(osUserId, osPushToken) {
		this.zaaskServices.statusNotification(osUserId, osPushToken).subscribe(
			(data: any) => {
				console.log("statusnotification", data);
				// if (data.is_subscribed == 1 || data.is_subscribed == 2) {
				this.zaaskServices.setNotification(osUserId, osPushToken, "ZaaskPRO").subscribe(
					(data) => {
						this.user.setUserField("notifications", true);
					},
					(error) => {
						console.log(error);
					}
				);
				// }
			},
			(error) => {
				return 0;
			}
		);
	}

	loadMoreTasks(event) {
		this.showInfinite = false;
		this.loadTasks(event);
	}

	doRefresh(event) {
		console.log(event);
		this.tasks = [];
		this.pagination = 1;
		this.loadTasks(event);
	}

	loadTasks(event?) {
		let loading = this.Utils.createZaaskLoading();
		loading.present();
		//
		this.zaaskServices.getProTasksAvailable(this.pagination).subscribe(
			(data: any) => {
				if (data.data.length > 0) {
					data.data.forEach((task) => {
						this.tasks.push(task);
					});
					this.pagination += 1;
					this.showInfinite = true;
				}
				loading.dismiss();
			},
			(error) => {
				loading.dismiss();
				var alert = this.Alert.create({
					title: "Erro",
					subTitle: "Erro no acesso à Zaask!",
					buttons: ["Fechar"]
				});
				alert.present();
				this.tasks = [];
				console.log("login error", error);
			},
			() => {
				if (event != null) event.complete();
			}
		);
	}

	ignoreTask(id, index) {
		this.zaaskServices.ignoreProTask(id).subscribe(
			(response) => {
				this.tasks[index].ignored = true;
			},
			(error) => {
				var alert = this.Alert.create({
					title: "Erro",
					subTitle: "Erro no acesso à Zaask!",
					buttons: ["Fechar"]
				});
				console.log("login error", error);
			}
		);
	}

	abortIgnoreTask(id, index) {
		this.zaaskServices.abortIgnoreProTask(id).subscribe(
			(response) => {
				this.tasks[index].ignored = false;
			},
			(error) => {
				var alert = this.Alert.create({
					title: "Erro",
					subTitle: "Erro no acesso à Zaask!",
					buttons: ["Fechar"]
				});
				console.log("login error", error);
			}
		);
	}

	showTask(id, ignored = false) {
		if (ignored) return null;

		this.zaaskServices.showProTask(id).subscribe(
			(response: any) => {
				if (response.userMeetsRequirements && this.user.lead_credits >= response.credits[0].credits) this.nav.push("TaskDetailsPage", { taskInfo: response });
				else {
					const baseUrl = this.user.getCountry() === "PT" ? `${API_URL}/task/` : "https://zaask.es/task/";
					const taskUrl = baseUrl + response.task.task_id;
					this.Utils.launchInApp(taskUrl, "_blank", this.user.uniqcode, this.platform.is("ios"));
				}
			},
			(error) => {
				var alert = this.Alert.create({
					title: "Erro",
					subTitle: "Erro no acesso à Zaask!",
					buttons: ["Fechar"]
				});
				console.log("login error", error);
			}
		);
	}

	tabRedirect(name) {
		this.nav.setRoot(name);
	}

	editCategory() {
		const url = this.user.getCountry() === "PT" ? `${API_URL}/profile/services` : "https://zaask.es/profile/services";
		this.Utils.launchInApp(url, "_blank", this.user.uniqcode, this.platform.is("ios"));
	}

	openLink(url) {
		this.Utils.launchInApp(url, "_blank", this.user.uniqcode, this.platform.is("ios"));
	}

	getRelativeTime(date) {
		return moment.tz(date, this.userTimeZone).fromNow();
	}

	displayTerms() {
		this.showTerms = true;
	}

	displayPrivacyPolicy() {
		this.showPrivacyPolicy = true;
	}

	closeTerms() {
		this.showTerms = false;
	}

	closePrivacyPolicy() {
		this.showPrivacyPolicy = false;
	}

	acceptTerms() {
		localStorage.setItem("terms_accepted", "true");
		this.policyAccepted = true;
		this.pageContentClass = "task-page task-page__heigth";
		this.showPrivacyPolicy = false;
		this.showTerms = false;
		//enable onesignal plugin
		this.oneSignal.setRequiresUserPrivacyConsent(true);
		this.oneSignal.provideUserConsent(true);
		this.oneSignal.userProvidedPrivacyConsent((providedConsent) => {
			if (providedConsent) this.initOneSignal();
		});
		this.ref.detectChanges();
	}

	getLang() {
		return this.user.getCountry();
	}

	openOneSignalPolicy() {
		var termsUrl = "https://onesignal.com/privacy_policy";
		this.Utils.launchInApp(termsUrl, "_blank", null, this.platform.is("ios"));
	}

	openOneSignalTerms() {
		var termsUrl = "https://onesignal.com/tos";
		this.Utils.launchInApp(termsUrl, "_blank", null, this.platform.is("ios"));
	}

	private async requestConsent() {
		window.plugins.impacTracking.requestTracking(
			null,
			(result) => {
				this.zaaskServices.consent(result).subscribe();
			},
			(error) => {
				console.log(error);
			}
		);
	}
}
