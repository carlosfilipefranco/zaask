import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { AlertController, Events, IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { User } from "../../providers/user/user";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import moment from "moment-timezone";
import { Utils } from "../../providers/utils/utils";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { APP_VERSION, API_URL } from "../../env";
import { Facebook } from "@ionic-native/facebook";
import { OneSignal } from "@ionic-native/onesignal";
import { Storage } from "@ionic/storage";

declare var cordova: any;
declare var window;

@IonicPage()
@Component({
	selector: "page-task",
	templateUrl: "task.html"
})
export class TaskPage {
	user: any;
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
	evGetUser = () => {
		this.getUser();
	};
	constructor(public nav: NavController, public form: FormBuilder, public platform: Platform, public zaaskServices: ZaaskServices, public userProvider: User, public Utils: Utils, public Alert: AlertController, public ga: GoogleAnalytics, public facebook: Facebook, public oneSignal: OneSignal, private ref: ChangeDetectorRef, private storage: Storage, private events: Events) {
		this.passwordType = "password";
		this.tasks = [];
		this.country = this.userProvider.getCountry();
		this.tabQuotes = "QuotesPage";
		this.tabAccount = "AccountPage";
		this.userTimeZone = moment.tz.guess();
		moment.locale(this.country.toLowerCase());
		this.showInfinite = true;
		this.pagination = 1;

		this.getUser();
		this.startPolicy();

		this.events.subscribe("user:update", this.evGetUser);
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
						msgPedidosDisponiveis: "Pedidos",
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

	async startPolicy() {
		this.policyAccepted = (await this.storage.get("terms_accepted")) == "true";
		if (!this.policyAccepted) {
			this.pageContentClass = "task-page task-page__heigth task-page__heigth-backdrop";
		}
		this.showTerms = false;
		this.showPrivacyPolicy = false;
	}

	async getUser() {
		this.user = await this.storage.get("user");
		console.log(this.user);
	}

	ionViewDidLoad() {
		this.loadTasks();
		if (typeof cordova !== "undefined") {
			this.requestConsent();
		}

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

	ionViewWillUnload() {
		this.events.unsubscribe("user:update", this.evGetUser);
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
			this.userProvider.setUserField("osUserId", ids.userId);
			this.userProvider.setUserField("osPushToken", ids.pushToken);

			// Verify here if we update or not */
			this.isToSetPUshs(ids.userId, ids.pushToken);

			// Check Notifications status
			this.zaaskServices.authRequest().subscribe(
				(data: any) => {
					const responseData = data.user;
					Object.keys(responseData.pushNotifications).forEach((key) => {
						if (responseData.pushNotifications[key]["external_user_id"] == this.user.osUserId && responseData.pushNotifications[key]["user_agent"] == "ZaaskPRO" && responseData.pushNotifications[key]["is_subscribed"] == 1) {
							this.userProvider.setUserField("notifications", true);
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
						this.userProvider.setUserField("notifications", true);
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
				console.log("user requirements", response.userMeetsRequirements);
				console.log("user credits", this.user.lead_credits);
				console.log("user credits", this.user);
				console.log("credits", response.credits[0].credits);
				if (response.userMeetsRequirements && this.user.lead_credits >= response.credits[0].credits) this.nav.push("TaskDetailsPage", { taskInfo: response });
				else {
					const baseUrl = this.userProvider.getCountry() === "PT" ? `${API_URL}/task/` : "https://zaask.es/task/";
					const taskUrl = baseUrl + response.task.task_id;
					this.Utils.launchInApp(taskUrl, "_blank", this.user.api_token, this.platform.is("ios"));
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
		const url = this.userProvider.getCountry() === "PT" ? `${API_URL}/profile/services` : "https://zaask.es/profile/services";
		this.Utils.launchInApp(url, "_blank", this.user.api_token, this.platform.is("ios"));
	}

	openLink(url) {
		this.Utils.launchInApp(url, "_blank", this.user.api_token, this.platform.is("ios"));
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
		this.storage.set("terms_accepted", "true");
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
		return this.userProvider.getCountry();
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
