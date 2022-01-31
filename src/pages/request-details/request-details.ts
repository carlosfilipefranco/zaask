import { Component } from "@angular/core";
import { AlertController, IonicPage, ModalController, NavController, NavParams, Platform, Toast, ToastController } from "ionic-angular";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@IonicPage()
@Component({
	selector: "page-request-details",
	templateUrl: "request-details.html"
})
export class RequestDetailsPage {
	requestID: any;
	requestIndex: any;
	askerName: any;
	taskTitle: any;
	postDate: any;
	postAgo: any;
	taskCredits: any;
	askerPhone: any;
	askerPhoneValid: any;
	when: any;
	here: any;
	questions: any;
	askerPhoto: any;
	googleMapPoint: string;
	requestIgnored: boolean;
	msgCredits: string;
	msgPhone: string;
	msgNotValidated: string;
	msgValidated: string;
	msgNotAvailable: string;
	msgWhat: string;
	msgWhen: string;
	msgHere: string;
	msgSend: string;
	msgContactClient: string;
	constructor(public nav: NavController, public params: NavParams, public zaaskServices: ZaaskServices, public platform: Platform, public Alert: AlertController, public modalController: ModalController, public toast: ToastController, public ga: GoogleAnalytics) {
		this.requestID = params.data.requestID;
		this.requestIndex = params.data.requestIndex;
		// this.requests = requests;
		// this.pricetype = { value: "fix"};
		this.zaaskServices.getTaskDetails(this.requestID).subscribe(
			(data: any) => {
				console.log(data);
				if (data.status) {
					console.log(data);
					this.askerName = data.askerName;
					this.taskTitle = data.taskTitle;
					this.postDate = data.postDate;
					this.postAgo = data.postAgo;
					this.taskCredits = data.taskCredits;
					this.askerPhone = data.askerPhone;
					this.askerPhoneValid = data.askerPhoneValid;
					this.when = data.when;
					this.here = data.here;
					this.questions = data.what;
					this.askerPhoto = data.askerPhoto;
					this.googleMapPoint = "https://maps.googleapis.com/maps/api/staticmap?sensor=false&center=" + data.centroidX + "," + data.centroidY + "&zoom=13&size=350x175&maptype=roadmap%20&markers=color:red|label:|" + data.centroidX + "," + data.centroidY + "&key=AIzaSyDH0ikt5YpHdBU6iqqVOy5eB1FZCUcZxOo";

					// loading.dismiss();
				} else {
					var alert = Alert.create({
						title: "Erro",
						subTitle: data.message,
						buttons: ["close"]
					});
					// loading.dismiss();
					alert.present();
				}
			},
			(err) => {
				var alert = Alert.create({
					title: "Erro",
					subTitle: err,
					buttons: ["close"]
				});
				// loading.dismiss();
				alert.present();
			},
			() => console.log("Get tasks details complete.")
		);

		this.requestIgnored = false;

		this.setText();
	}

	onPageWillEnter() {
		//Google Analytics
		this.platform.ready().then(() => {
			this.ga.trackView("RequestDetails Screen", "request-details.html");
		});
	}

	onPageDidEnter() {
		//		console.log("*** page enter hide tabbar");
		// document.querySelector("ion-footer").style.display = "block";
	}

	onPageWillLeave() {
		//		console.log("*** page exit show tabbar");
		//		document.querySelector('ion-tabbar-section').style.display = 'block';
	}

	showModal(source, filter) {
		console.log("source: " + source + " | filter: " + filter);
		if (source == 2 && filter == 1) {
			source = 1;
		}
		let modal = this.modalController.create("RequestSendquotePage", { requestId: this.requestID, askerName: this.askerName, source: source });
		modal.present();
	}

	ignoreRequest(request) {
		//TODO adapt is to request
		let toast = this.toast.create({
			message: "Pedido ignorado.",
			duration: 3000,
			showCloseButton: true,
			closeButtonText: "Undo",
			dismissOnPageChange: true
		});

		this.requestIgnored = true;
		// TODO // remove item from array

		toast.onDidDismiss((resolved, rejected) => {
			if (rejected == "close") {
				//this.requests.splice(index, 0, request); TODO // put it back
				this.requestIgnored = false;
			} else {
				this.nav.pop();
			}
		});

		toast.present();
	}

	setText() {
		if (this.zaaskServices.getUserCountry() == "PT") {
			this.msgCredits = "créditos";
			this.msgPhone = "Telefone";
			this.msgNotValidated = "não validado";
			this.msgValidated = "validado";
			this.msgNotAvailable = "não disponível";
			this.msgWhat = "O quê?";
			this.msgWhen = "Quando?";
			this.msgHere = "Onde?";
			this.msgSend = "Enviar";
			this.msgContactClient = "Contactar cliente";
		} else {
			this.msgCredits = "créditos";
			this.msgPhone = "Teléfono";
			this.msgNotValidated = "no validado";
			this.msgValidated = "validado";
			this.msgNotAvailable = "no disponible";
			this.msgWhat = "¿El qué?";
			this.msgWhen = "¿Cuándo?";
			this.msgHere = "¿Dónde?";
			this.msgSend = "Enviar";
			this.msgContactClient = "Adquirir Contacto";
		}
	}
}
