import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { OneSignal } from "@ionic-native/onesignal";

declare var window: any;

@IonicPage()
@Component({
	selector: "page-account-notifications",
	templateUrl: "account-notifications.html"
})
export class AccountNotificationsPage {
	userID;
	notifsForm;
	notifStatus = true;
	notifTitle = "Notificações";
	msgNotifsWhen = "Enviar notificações quando";
	msgNewTask = "Novas tarefas";
	constructor(public nav: NavController, public params: NavParams, public platform: Platform, public zaaskServices: ZaaskServices, public form: FormBuilder, public ga: GoogleAnalytics, public oneSignal: OneSignal) {
		this.userID = this.params.data.userID;
		this.initScreen();

		this.notifsForm = this.form.group({
			notif: [""]
		});

		this.setText();
	}

	onPageWillEnter() {
		//Google Analytics
		this.platform.ready().then(() => {
			this.ga.trackView("AccountNotifications Screen", "account-notifications.html");
		});
	}

	initScreen() {
		console.log("-----------getNotifications--------");
		this.zaaskServices.getNotifs().subscribe(
			(data: any) => {
				console.log(data);
				if (data.status == true) {
					this.notifStatus = data.isactive;
				} else {
					this.notifStatus = false;
				}
			},
			(err) => {
				this.notifStatus = false;
				// var alert = Alert.create({
				//     title: "Erro",
				//     subTitle: 'Erro no acesso à Zaask!',
				//     buttons: ["close"]
				// });
				// this.nav.present(alert);
				console.log("notifs error: " + err);
			}
		);
	}

	setNotifications() {
		console.log("-----------setNotifications--------");
		console.log(this.notifsForm.controls.notif.value);
		this.notifStatus = this.notifsForm.controls.notif.value;

		this.oneSignal.setSubscription(this.notifsForm.controls.notif.value);

		this.zaaskServices.setNotifs(this.notifsForm.controls.notif.value).subscribe(
			(data) => {
				console.log(data);
			},
			(error) => {
				// var alert = Alert.create({
				//     title: "Erro",
				//     subTitle: 'Erro no acesso à Zaask!',
				//     buttons: ["close"]
				// });
				// this.nav.present(alert);
				console.log("notifs error: " + error);
			}
		);
	}

	setText() {
		if (this.zaaskServices.getUserCountry() == "PT") {
		} else {
			this.notifTitle = "Notificaciones";
			this.msgNotifsWhen = "Enviar notificaciones cuando";
			this.msgNewTask = "Nuevas tareas";
		}
	}
}
