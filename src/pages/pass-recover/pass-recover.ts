import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Platform } from "ionic-angular";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";

@IonicPage()
@Component({
	selector: "page-pass-recover",
	templateUrl: "pass-recover.html"
})
export class PassRecoverPage {
	emailUser;
	userCountry;
	loginForm;
	msgH1 = "Insira o seu endereço de correio electrónico";
	msgH2 = "Faça crescer o seu negócio";
	msgRecoverPass = "Recuperar palavra-chave";
	msgEmailSent = "Foi lhe enviado um email para recuperar a sua palavra-chave.";
	emailLabel = "E-mail";
	constructor(public nav: NavController, public params: NavParams, public form: FormBuilder, public loading: LoadingController, public platform: Platform, public zaaskServices: ZaaskServices, public Alert: AlertController) {
		this.emailUser = params.data.emailUser;
		this.userCountry = params.data.userCountry;

		this.loginForm = form.group({
			email: [this.emailUser, Validators.compose([Validators.required, Validators.minLength(5), checkFirstCharacterValidator])]
		});

		function checkFirstCharacterValidator(control) {
			if (control.value.match(/^\d/)) {
				return { checkFirstCharacterValidator: true };
			}
		}

		this.setText();

		//Google Analytics
		// GoogleAnalytics.trackView("PasswordRecover Screen - " + APP_VERSION, "pass-recover.html");
	}

	onSubmit(value) {
		if (this.loginForm.valid) {
			let loading = this.loading.create({
				content: "Please wait..."
			});
			loading.present();

			this.zaaskServices.recoverPassword(value.email).subscribe(
				(data) => {
					loading.dismiss();
					var alert = this.Alert.create({
						title: this.msgRecoverPass,
						subTitle: this.msgEmailSent,
						buttons: [
							{
								text: "Ok",
								handler: () => {
									this.nav.setRoot("LoginPage");
								}
							}
						]
					});
					alert.present();
				},
				(error) => {
					const responseData = JSON.parse(error._body);
					var alert = this.Alert.create({
						title: "Erro",
						subTitle: responseData.message,
						buttons: ["close"]
					});
					loading.dismiss();
					alert.present();
				}
			);
		}
	}

	setText() {
		if (this.userCountry != "PT") {
			this.msgH1 = "Escribe tu dirección de correo electrónico";
			this.msgH2 = "";
			this.msgRecoverPass = "Recuperar contraseña";
			this.msgEmailSent = "Le hemos enviado un e-mail para recuperar la contraseña.";
			this.emailLabel = "Correo electrónico";
		}
	}
}
