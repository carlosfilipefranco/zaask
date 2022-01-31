import { Component } from "@angular/core";
import { OneSignal } from "@ionic-native/onesignal";
import { IonicPage } from "ionic-angular";
import { User } from "../../providers/user/user";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";

@IonicPage()
@Component({
	templateUrl: "tabs.html"
})
export class TabsPage {
	tabRequests = "RequestsPage";
	tabQuotes = "QuotesPage";
	tabAccount = "AccountPage";

	msgPedidosDisponiveis = "Pedidos Disponíveis";
	msgPedidosAdquiridos = "Pedidos Adquiridos";
	msgMyAccount = "Minha Conta";
	constructor(public zaaskServices: ZaaskServices, public user: User, public oneSignal: OneSignal) {
		this.setText();

		document.addEventListener(
			"deviceready",
			function () {
				var notificationOpenedCallback = function (jsonData) {
					console.log("didReceiveRemoteNotificationCallBack: " + JSON.stringify(jsonData));
				};

				//PROD SETTINGS
				if (this.zaaskServices.getUserCountry() == "PT") {
					this.oneSignal.startInit("03f9ed5c-4a94-4db5-a692-f507940e2702", { googleProjectNumber: "170479296785" }, notificationOpenedCallback);
				} else {
					this.oneSignal.startInit("ad86c96f-3bb4-4351-8a31-134829e60e39", { googleProjectNumber: "170479296785" }, notificationOpenedCallback);
				}
				//STAGING SETTINGS
				//this.oneSignal.init("9e414fe7-1537-4db3-a5ac-193b41d9d04a",
				//	{googleProjectNumber: "170479296785"}, notificationOpenedCallback);

				// Show an alert box if a notification comes in when the user is in your app.
				this.oneSignal.enableInAppAlertNotification(true);

				this.oneSignal.getIds(function (ids) {
					console.log("OneSignal UserID: " + ids.userId);
					console.log("OneSignal PushToken: " + ids.pushToken);

					updateIds(ids);
				});
			},
			false
		);

		var updateIds = function (ids) {
			this.zaaskServices.registerPushNotif(ids.userId, ids.pushToken).subscribe(
				(data) => {
					console.log("Register Push Notifs Status: " + data.status);
					user.setPushUserId(ids.userId);
					user.setPushToken(ids.pushToken);
					user.saveUserInfo();
				},
				(err) => {
					console.log("Register Push Notifs Error: ");
					console.log(err);
				}
			);
		};
	}

	setText() {
		if (this.zaaskServices.getUserCountry() != "PT") {
			this.msgPedidosDisponiveis = "Pedidos disponibles";
			this.msgPedidosAdquiridos = "Pedidos adquiridos";
			this.msgMyAccount = "Mi Cuenta";
		}
	}
}
