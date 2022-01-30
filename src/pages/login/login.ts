import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AlertController, IonicPage, LoadingController, NavController, Platform } from "ionic-angular";
import { QuotesListProvider } from "../../providers/quotes-list/quotes-list";
import { User } from "../../providers/user/user";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import { AppVersion } from "@ionic-native/app-version";
import { Device } from "@ionic-native/device";
import { Utils } from "../../providers/utils/utils";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { APP_VERSION } from "../../env";
import { Facebook } from "@ionic-native/facebook";
import { Globalization } from "@ionic-native/globalization";

declare var cordova: any;

@IonicPage()
@Component({
	selector: "page-login",
	templateUrl: "login.html"
})
export class LoginPage {
	passwordType = "password";
	public loginForm: any;
	public languageForm: any;
	AppLanguage = [
		{
			key: "Portugal",
			value: "PT"
		},
		{
			key: "España",
			value: "ES"
		}
	];
	appVersion: string = "";
	uuid;
	versionId;
	platformId;
	asd;
	msgLanguage = "Portugal";
	msgEntrar = "Entrar";
	msgForgotPassword = "Não se lembra da palavra-chave?";
	msgH1 = "Novas oportunidades para todo o tipo de profissionais";
	msgNewAccount = "Criar Conta";
	msgPassword = "Palavra-chave";
	msgOpenBrowser = "Esta opção irá abrir o browser do seu telemóvel, aceita?";
	emailLabel = "ENDEREÇO DE E-MAIL";
	passwordLabel = "PALAVRA-PASSE";
	facebookLabel = "Entrar com o Facebook";
	registrationLabelFirst = "Não tem conta?";
	registrationLabelSecond = "Registe-se aqui";
	msgBrowser = "Esta opção irá abrir o browser do seu telemóvel, aceita?";
	msgNo = "Não";
	msgYes = "Sim";
	msgError = "Erro";
	msgLoginError = "Erro no acesso à Zaask!";
	msgClose = "Fechar";
	initialHeight;
	hideFooter = false;
	constructor(
		public nav: NavController,
		public form: FormBuilder,
		public http: HttpClient,
		public platform: Platform,
		public zaaskServices: ZaaskServices,
		public user: User,
		public quotesList: QuotesListProvider,
		public app: AppVersion,
		public loading: LoadingController,
		public device: Device,
		public alert: AlertController,
		public utils: Utils,
		public ga: GoogleAnalytics,
		public facebook: Facebook,
		private globalization: Globalization
	) {
		this.loginForm = this.form.group({
			email: ["francisco+bid@zaask.com", [Validators.required, Validators.minLength(1), checkFirstCharacterValidator]],
			password: ["Zaask123", [Validators.required, Validators.minLength(1)]]
		});

		this.languageForm = this.form.group({
			language: [""]
		});

		// -------- set initial language ------- //
		let lang = localStorage.getItem("language");
		if (lang == null) {
			let defaultLang = "PT"; //default lang
			if (typeof cordova !== "undefined") {
				this.globalization.getPreferredLanguage().then((language) => {
					lang = language.value.split("-")[1];
					console.log("Device Language: " + lang);
					this.languageChange(lang);
				}, null);
			} else lang = defaultLang;
		}
		this.languageChange(lang);
		// ------------------------------------- //

		function isEmailPattern(emailV) {
			var pattern = new RegExp(
				/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
			);
			console.log("resultado " + pattern.test(emailV));
			return pattern.test(emailV);
		}

		function checkFirstCharacterValidator(control) {
			// if (isEmailPattern(control.value)) {
			// 	// match what we want
			// 	console.log("true");
			// 	return { checkFirstCharacterValidator: false };
			// } else {
			// 	console.log("false");
			// 	return { checkFirstCharacterValidator: true };
			// }
			return true;
		}

		// window.addEventListener("resize", () => {
		//    this.hideFooter = this.initialHeight !== window.innerHeight;
		// })

		if (typeof cordova != "undefined") {
			this.app.getVersionNumber().then((s) => {
				console.log("ver: " + s);
				this.appVersion = s;
			});
			this.ga.trackView("Login Screen - " + APP_VERSION, "login.html");
		}
	}

	onPageWillEnter() {
		this.initialHeight = document.getElementById("nav").clientHeight;
	}

	onSubmit(value) {
		if (this.loginForm.valid) {
			console.log("login::onSubmit - value: ");
			console.log(JSON.stringify(value));
			console.log("--------------------------");

			if (this.user.getCountry() === "PT") {
				var msgAlert = "Por favor espere...";
			} else {
				var msgAlert = "Por favor, espere...";
			}

			let loading = this.loading.create();

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
					this.versionId = this.platform.versions().android.str;
				}
				this.uuid = "undefined";
			}

			this.asd = this.zaaskServices.doLogin(value.email, value.password, this.uuid, this.platformId, this.versionId, this.appVersion);
			this.asd.subscribe(
				(data) => {
					if (data.status == true) {
						this.user.setUser(value.email, value.password, data.hashcode, this.uuid, data.userId, data.photourl, data.name, data.subtitle, data.numstars, data.numreviews, data.numcredits, data.useractivation, data.pushuserid, data.pushtoken, this.user.getCountry(), "");
						loading.dismiss();
						this.nav.setRoot("TabsPage");
					} else {
						var alert = this.alert.create({
							title: "Erro",
							subTitle: data.message,
							buttons: ["Fechar"]
						});
						loading.dismiss();
						alert.present();
						console.log("login::onSubmit - login message: " + data.message);
					}
				},
				(error) => {
					var alert = this.alert.create({
						title: this.user.getCountry() === "PT" ? "Erro" : "ERROR",
						subTitle: this.user.getCountry() === "PT" ? "Erro no acesso à Zaask!" : "¡Error de acceso a Zaask!",
						buttons: ["Fechar"]
					});
					loading.dismiss();
					alert.present();
					console.log("login::onSubmit - login error: ");
					console.log(error);
					console.log("-----------------------------");
				}
			);
		}
	}

	recoverPass() {
		this.nav.push("PassRecoverPage", { emailUser: this.loginForm.controls.email.value, userCountry: this.user.getCountry(), zaaskServices: this.zaaskServices });
	}

	languageChange(data) {
		console.log("Selet Language changed to: " + data);
		localStorage.setItem("language", data);
		this.user.setCountry(data);
		this.zaaskServices.setServer(data);
		this.setText();
		console.log("Old Value set: " + this.languageForm.controls.language.value);
		//this.language._value = "" + data;
		console.log("Value set: " + this.languageForm.controls.language.value);
	}

	newAccount() {
		var alert = this.alert.create({
			title: "ZaaskPro",
			message: this.msgOpenBrowser,
			buttons: [
				{
					text: "Não",
					handler: () => {
						console.log("Disagree clicked");
					}
				},
				{
					text: "Sim",
					handler: () => {
						this.platform.ready().then(() => {
							if (this.zaaskServices.getUserCountry() == "PT") {
								window.open("https://www.zaask.pt/bem-vindo", "_system", "location=yes");
							} else {
								window.open("https://www.zaask.es/bienvenido", "_system", "location=yes");
							}
						});
					}
				}
			]
		});
		alert.present();
	}

	setText() {
		if (this.user.getCountry() == "PT") {
		} else {
			this.msgLanguage = "España";
			this.msgEntrar = "Entrar";
			this.msgForgotPassword = "¿Olvidaste tu contraseña?";
			this.msgH1 = "Nuevas oportunidades para todo tipo de profesionales";
			this.msgNewAccount = "Crear Cuenta";
			this.msgPassword = "Contraseña";
			this.msgOpenBrowser = "Esta opción se abrirá el navegador de su teléfono, usted está de acuerdo?";
			this.emailLabel = "DIRECCIÓN DE CORREO ELECTRÓNICO";
			this.passwordLabel = "CONTRASEÑA";
			this.facebookLabel = "Entrar con Facebook";
			this.registrationLabelFirst = "¿No tienes cuenta?";
			this.registrationLabelSecond = "Regístrate aquí";
			this.msgBrowser = "Esta opción abrirá el navegador de tu móvil, aceptas?";
			this.msgNo = "No";
			this.msgYes = "Si";
			this.msgError = "Error";
			this.msgLoginError = "No ha sido posible acceder.";
			this.msgClose = "Cerrar";
		}
	}

	tooglePasswordType() {
		return (this.passwordType = this.passwordType === "password" ? "text" : "password");
	}

	onLogin(event) {
		if (this.loginForm.valid) {
			// if (this.user.getCountry === "PT") {
			//     var msgAlert = "Por favor espere...";
			// } else {
			//     var msgAlert = "Por favor, espere...";
			// }
			//
			// let loading = Loading.create({
			//     content: msgAlert
			// });
			// this.nav.present(loading);

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
					this.versionId = this.platform.versions().android.str;
				}
				this.uuid = "undefined";
			}

			this.zaaskServices.login(event).subscribe(
				(data: any) => {
					this.zaaskServices.storeMobileLogin(data.api_token, this.uuid, this.platformId, this.versionId, "manual-login").subscribe();
					data.user.api_token = data.api_token;
					data.user.password = event.password;
					data.user.email = event.email;
					this.user.setUserNew(data.user);
					this.zaaskServices.authRequest().subscribe(
						(data: any) => {
							console.log(data);
							if (!data.user.isTasker) {
								const alertMsg = this.user.getCountry() == "PT" ? "Ainda não é um profissional Zaask. Aproveite para <b>registar-se</b>!" : "Aún no eres profesional Zaask. ¡Aprovecha para <b>registrarte</b>!";
								var alert = this.alert.create({
									title: "Erro",
									subTitle: alertMsg,
									buttons: [
										{ text: "Fechar" },
										{
											text: "Registar",
											handler: () => {
												this.openRegisterLink();
											}
										}
									]
								});
								alert.present();
								return;
							} else {
								this.zaaskServices.saveUserData(data);
								//
								this.nav.setRoot("TaskPage");
							}
						},
						(error) => {
							console.log("auth error", error);
						}
					);
				},
				(error) => {
					var alert = this.alert.create({
						title: this.msgError,
						subTitle: this.msgLoginError,
						buttons: [this.msgClose]
					});
					alert.present();
					localStorage.removeItem("user");
					console.log("login error", error);
				}
			);
		}
	}

	openLink() {
		this.platform.ready().then(() => {
			const url = this.user.getCountry() === "PT" ? "https://zaask.pt/bem-vindo" : "https://zaask.es/bem-vindo";
			this.utils.launchInApp(url, "_blank", this.user.uniqcode, this.platform.is("ios"));
		});
	}

	openRegisterLink() {
		this.platform.ready().then(() => {
			const isIOS = this.platform.is("ios");
			const url = this.user.getCountry() === "PT" ? "https://www.zaask.pt/register/pro" : "https://www.zaask.es/register/pro";
			var inAppBrowserRef = this.utils.launchInApp(url, "_blank", undefined, isIOS); //don't send uniqcode
			inAppBrowserRef.on("loadstop").subscribe(
				() => {
					let scriptUser = 'var el = document.getElementsByName("email")[0]; ' + "el.dispatchEvent(new Event('focus', { bubbles: true })); " + "el.select(); " + 'el.value = "' + this.loginForm.controls.email.value + '";';
					let scriptPwd = 'var el = document.getElementsByName("password")[0]; ' + "el.select(); " + 'el.value = "' + this.loginForm.controls.password.value + '";';
					//
					inAppBrowserRef.executeScript({ code: scriptUser });
					inAppBrowserRef.executeScript({ code: scriptPwd });
				},
				(err) => {
					console.log(err);
				}
			);
		});
	}

	facebookLogin() {
		this.facebook
			.login(["email"])
			.then((response) => {
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
						this.versionId = this.platform.versions().android.str;
					}
					this.uuid = "undefined";
				}

				//
				this.zaaskServices.facebookLogin(response.authResponse.accessToken).subscribe(
					(data: any) => {
						this.zaaskServices.storeMobileLogin(data.api_token, this.uuid, this.platformId, this.versionId, "facebook").subscribe();

						data.user.api_token = data.api_token;
						// data.user.password = event.password;
						// data.user.email = event.email;
						this.user.setUserNew(data.user);
						this.zaaskServices.authRequest().subscribe(
							(data) => {
								this.zaaskServices.saveUserData(data);
							},
							(error) => {
								console.log("auth error", error);
							}
						);

						this.nav.setRoot("TaskPage");
					},
					(error) => {
						var alert = this.alert.create({
							title: "Erro",
							subTitle: "Erro no acesso à Zaask!",
							buttons: ["Fechar"]
						});
						alert.present();
						localStorage.removeItem("user");
						console.log("login error", error);
					}
				);
			})
			.catch((error) => {
				console.log("login error", error);
				/*var alert = Alert.create({
				title: "Erro",
				subTitle: JSON.stringify(error),
				buttons: ["Fechar"]
			});
			this.nav.present(alert);*/
			});
	}
}
