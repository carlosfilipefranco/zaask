import { Component } from "@angular/core";
import { AlertController, IonicPage, NavController, NavParams, Platform, ToastController } from "ionic-angular";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { APP_VERSION } from "../../env";

@IonicPage()
@Component({
	selector: "page-requests",
	templateUrl: "requests.html"
})
export class RequestsPage {
	typeFilter: string;
	requests: {
		status: string; //a inner loading
	}[];
	closeButtonText: any;
	msgNoResults: string;
	msgNewRequests: string;
	constructor(public nav: NavController, public platform: Platform, public zaaskServices: ZaaskServices, public Alert: AlertController, public Toast: ToastController, public ga: GoogleAnalytics) {
		this.nav = nav;
		this.platform = platform;
		this.zaaskServices = zaaskServices;

		this.typeFilter = "all";

		this.requests = [
			{
				status: "Loading..." //a inner loading
			}
		];

		this.setText();
	}

	onPageDidEnter() {
		//		console.log("*** page exit show tabbar");
		//		document.querySelector('ion-tabbar-section').style.display = 'block';
		//		document.querySelector('ion-tabbar-section').style.order = 20;
	}

	onPageWillEnter() {
		//Google Analytics
		this.platform.ready().then(() => {
			this.ga.trackView("Requests Screen", "requests.html");
		});

		console.log("requests page display");
		this.zaaskServices.getTasksList().subscribe(
			(data: any) => {
				// console.log(data);
				if (data.status) {
					this.requests = data.list;
					//  loading.dismiss();
				} else {
					var alert = this.Alert.create({
						title: "Erro - Requests 1",
						subTitle: data.message,
						buttons: ["close"]
					});
					// loading.dismiss();
					alert.present();
				}
			},
			(err) => {
				var alert = this.Alert.create({
					title: "Erro - Requests 2",
					subTitle: err,
					buttons: ["close"]
				});
				// loading.dismiss();
				alert.present();
			},
			() => console.log("Get tasks list complete.")
		);
	}

	openNavDetailsPage(id) {
		console.log("ResquestId: " + id);
		this.nav.push("RequestDetailsPage", { requestID: id });
	}

	ignoreRequest(request) {
		console.log(request);

		let toast = this.Toast.create({
			message: "Pedido ignorado.",
			duration: 5000,
			showCloseButton: true,
			closeButtonText: "Undo",
			dismissOnPageChange: true
		});

		this.zaaskServices.hideTask(request.id).subscribe(
			(data: any) => {
				// console.log(data);
				if (data.status) {
					var index = this.requests.indexOf(request);
					this.requests.splice(index, 1); // remove item

					toast.onDidDismiss((resolved, rejected) => {
						if (rejected == "close") {
							this.zaaskServices.unHideTask(request.id).subscribe(
								(data: any) => {
									// console.log(data);
									if (data.status) {
										this.requests.splice(index, 0, request); // put it back
									} else {
										var alert = this.Alert.create({
											title: "Erro",
											subTitle: data.message,
											buttons: [this.closeButtonText]
										});
										alert.present();
									}
								},
								(err) => {
									var alert = this.Alert.create({
										title: "Erro",
										subTitle: err,
										buttons: [this.closeButtonText]
									});
									alert.present();
								},
								() => console.log("Not Archived task.")
							);
						}
					});

					toast.present();
				} else {
					var alert = this.Alert.create({
						title: "Erro",
						subTitle: data.message,
						buttons: [this.closeButtonText]
					});
					alert.present();
				}
			},
			(err) => {
				console.log(err);
			},
			() => console.log("Archived task.")
		);
	}

	setText() {
		if (this.zaaskServices.getUserCountry() == "PT") {
			this.msgNoResults = "Sem resultados";
			this.msgNewRequests = "Novos Pedidos";
			this.closeButtonText = "Fechar";
		} else {
			this.msgNoResults = "Sin resultados";
			this.msgNewRequests = "Nuevos Pedidos";
			this.closeButtonText = "Cerrar";
		}
	}
}
