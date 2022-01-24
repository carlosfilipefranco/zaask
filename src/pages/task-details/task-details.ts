import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Platform, ToastController } from "ionic-angular";
import { User } from "../../providers/user/user";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import moment from "moment-timezone";
import { Utils } from "../../providers/utils/utils";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { APP_VERSION } from "../../env";
import { Facebook } from "@ionic-native/facebook";

@IonicPage()
@Component({
	selector: "page-task-details",
	templateUrl: "task-details.html"
})
export class TaskDetailsPage {
	passwordType: string;
	tasks: any[];
	country: string;
	taskInfo: any;
	updatePaid: any;
	questions: any;
	items: string[];
	ownerName: any;
	mapUrl: any;
	hours: number;
	minutes: number;
	day: number;
	month: string;
	quoteAttach: any;
	closeButtonText: string;
	translate: {
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
		details: string;
		sendQuote: string;
		sendAQuoteTo: string;
		quoteAlreadySendedTo: string;
		fixedPrice: string;
		hourlyPrice: string;
		askForInfo: string;
		textAreaPlaceholder: string;
		msgMinLength: string;
		edit: string;
		chooseFile: string;
		useLastMessage: string;
		successTips: string;
		taskCategory: string;
		quotesSended: string;
	};
	selectedSegment: string;
	selectedQuoteType: any;
	quoteTextAreaValue: any;
	bidPrice: string;
	editQuote: boolean;
	attachPlaceholder: any;
	sendQuoteForm: any;
	source: string;
	msgAlert: string;
	constructor(public nav: NavController, public form: FormBuilder, public platform: Platform, public zaaskServices: ZaaskServices, public user: User, public navParams: NavParams, public utils: Utils, public Alert: AlertController, public Toast: ToastController, public Loading: LoadingController, public ga: GoogleAnalytics, public facebook: Facebook) {
		this.passwordType = "password";
		this.tasks = [];
		this.country = this.user.getCountry();
		this.taskInfo = navParams.data.taskInfo;
		this.updatePaid = navParams.data.updatePaid;
		this.questions = navParams.data.taskInfo.task.questions;
		let keys = Object.keys(navParams.data.taskInfo.task.questions);
		this.items = keys;
		this.ownerName = navParams.data.taskInfo.task.owner_name;
		this.mapUrl = navParams.data.taskInfo.task.map;
		this.quoteAttach = null;
		this.closeButtonText = "Fechar";
		this.translate =
			this.country === "PT"
				? {
						msgCredits: "Créditos",
						msgPhone: "Telefone",
						msgNotValidated: "não validado",
						msgValidated: "validado",
						msgNotAvailable: "não disponível",
						msgWhat: "O quê?",
						msgWhen: "Quando?",
						msgHere: "Onde?",
						msgSend: "Enviar",
						msgContactClient: this.updatePaid ? "Actualizar proposta" : "Contactar cliente",
						details: "Detalhes",
						sendQuote: "Enviar orçamento",
						sendAQuoteTo: "Envie um orçamento para",
						quoteAlreadySendedTo: "Já enviou um orçamento para",
						fixedPrice: "Preço fixo",
						hourlyPrice: "Preço por hora",
						askForInfo: "Pedir mais informações",
						textAreaPlaceholder: "Aproveite este primeiro contacto para causar uma boa impressão. " + "Apresente-se e explique porque deveria contar consigo para realizar o seu projecto.",
						msgMinLength: "Pelo menos 25 caracteres!",
						edit: "Editar",
						chooseFile: "Escolher ficheiro",
						useLastMessage: "Usar última mensagem",
						successTips: "Dicas de sucesso",
						taskCategory: "Tipo de trabalho",
						quotesSended: "Orçamentos enviados"
				  }
				: {
						msgCredits: "Créditos",
						msgPhone: "Teléfono",
						msgNotValidated: "no validado",
						msgValidated: "validado",
						msgNotAvailable: "no disponible",
						msgWhat: "¿El qué?",
						msgWhen: "¿Cuándo?",
						msgHere: "¿Dónde?",
						msgSend: "Enviar",
						msgContactClient: this.updatePaid ? "Actualizar propuesta" : "Contactar cliente",
						details: "Detalles",
						sendQuote: "Enviar un presupuesto",
						sendAQuoteTo: "Envía un presupuesto a",
						quoteAlreadySendedTo: "Ya ha enviado un presupuesto para",
						fixedPrice: "Precio fijo",
						hourlyPrice: "Precio por hora",
						askForInfo: "Pedir más informácion",
						textAreaPlaceholder: "Aprovecha este primer contacto para causar un buena impresión. " + "Preséntate y explica porqué debería contar contigo para realizar su proyecto.",
						msgMinLength: "Tamaño mínimo de 25 caracteres!",
						edit: "Editar",
						chooseFile: "Anexar archivo",
						useLastMessage: "Usar el último mensaje",
						successTips: "Consejos de éxito",
						taskCategory: "Tipo de trabajo",
						quotesSended: "Presupuestos enviados"
				  };
		//
		this.selectedSegment = "details";
		this.selectedQuoteType = this.taskInfo.bid != null ? this.taskInfo.bid.type : "fixed";
		this.quoteTextAreaValue = this.taskInfo.bid != null ? this.taskInfo.bid.message : "";
		this.bidPrice = this.taskInfo.bid != null ? Number(this.taskInfo.bid.bid).toFixed(0).toString() : "";
		this.editQuote = !this.updatePaid ? true : false;
		this.attachPlaceholder = this.translate.chooseFile;
		//
		this.sendQuoteForm = form.group({
			price: [this.bidPrice, Validators.required],
			pricetype: [this.selectedQuoteType, Validators.compose([Validators.required, Validators.minLength(1)])],
			message: [
				this.quoteTextAreaValue,
				Validators.compose([
					Validators.required,
					Validators.minLength(25) //this.initTryRows(),
				])
			]
		});
		//
		this.setTime();
		//GoogleAnalytics
		this.ga.trackView("Task Details Screen - " + APP_VERSION, "task-details.html");
	}

	setTime() {
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		var dateString = this.taskInfo.task.date;
		const date = new Date(dateString.replace(/-/g, "/"));

		this.hours = date.getHours();
		this.minutes = date.getMinutes();
		this.day = date.getDate();
		this.month = monthNames[date.getMonth()];
	}

	splitOwnerName(name) {
		const splitedName = name.split(" ");
		return splitedName[0] + " " + splitedName[1].charAt(0) + ".";
	}

	ignoreTask() {
		this.zaaskServices.ignoreProTask(this.taskInfo.task.task_id).subscribe(
			(response) => {
				this.nav.setRoot("TaskPage");
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

	onChangeTopSegment(event) {
		if (event.value == "quote") this.showQuoteSegment();
		if (event.value == "details") this.showDetailsSegment();
	}

	showQuoteSegment() {
		this.selectedSegment = "quote";
		setTimeout(() => {
			this.onChangeQuoteSegment({ value: this.selectedQuoteType });
		}, 500);
	}

	showDetailsSegment() {
		this.selectedSegment = "details";
	}

	onChangeQuoteSegment(event) {
		document.getElementsByTagName("input")[0].focus();
		document.getElementsByTagName("input")[0].scrollIntoView();
		//if option == 'more', set price = 0 to unlock send button
		if (event.value == "more" && this.bidPrice == "") this.bidPrice = "0";
		if (event.value != "more" && this.bidPrice == "0") this.bidPrice = "";
	}

	useLastMessage() {
		this.quoteTextAreaValue = this.taskInfo.userLastMessage;
	}

	openTipsWebPage() {
		var tipsUrl = "https://www.zaask.pt/como-ter-sucesso-na-zaask?uniqcode=pU0o06bNGUzZjt4RriXrwPlU7PdWX77s197836";
		this.utils.launchInApp(tipsUrl, "blank", this.user.uniqcode, this.platform.is("ios"));
	}

	buyTask(formData) {
		var self = this;
		var taskId = this.taskInfo.task.task_id;
		//this.source = !this.updatePaid ? 1 : 2;
		this.source = "app"; //App ZaaskPRO => source = 'app'
		if (this.sendQuoteForm.valid && formData.message.length >= 25) {
			if (this.taskInfo.userMeetsRequirements) {
				let loading = this.Loading.create({
					spinner: "hide",
					content: '<img src="assets/images/loader_v2.gif" width="100px">'
				});
				loading.present();
				this.zaaskServices
					.setQuoteNew(taskId, formData.pricetype, formData.price, formData.message, this.source, this.quoteAttach)
					.then((data) => {
						console.log("Set Quote to task " + taskId, data);
						//console.log(JSON.stringify(data));
						loading.dismiss().then(() => {
							if (data.status) {
								this.nav.push("ChatPage", { id: taskId });
								this.facebook.logPurchase(this.taskInfo.credits[0].credits, "EUR");
							} else {
								var alert = this.Alert.create({
									title: "Erro",
									subTitle: data.message,
									buttons: [self.closeButtonText]
								});
								alert.present();
							}
						});
					})
					.catch((err) => {
						console.log("Error setting Quote to task.", err);
						loading.dismiss().then(() => {
							var alert = this.Alert.create({
								title: "Erro",
								subTitle: err.status,
								buttons: [self.closeButtonText]
							});
							alert.present();
						});
					});
			} else {
				if (this.zaaskServices.getUserCountry() == "PT") {
					this.msgAlert = "É necessário ter um perfil mais completo para concorrer a este pedido";
				} else {
					this.msgAlert = "Necesitas tener un perfil más completo para poder presentarte a este pedido";
				}
				var alert = this.Alert.create({
					title: "Erro",
					subTitle: this.msgAlert,
					buttons: [this.closeButtonText]
				});
				alert.present();
			}

			//self.buyTaskDialog(false);
		} else {
			if (this.zaaskServices.getUserCountry() == "PT") {
				this.msgAlert = "Por favor, envie uma mensagem com pelo menos 25 caracteres para o seu potencial cliente";
			} else {
				this.msgAlert = "Por favor, envia un mensaje de al menos 25 caracteres a tu potencial cliente";
			}
			var alert = this.Alert.create({
				title: "Erro",
				subTitle: this.msgAlert,
				buttons: [this.closeButtonText]
			});
			alert.present();
		}
	}

	editQuoteAction() {
		this.editQuote = true;
	}

	attachFile(event) {
		var attachType = "";
		var attachImage = "";
		if (event.target.files[0].size / 1024 / 1024 >= 8) {
			var alert = this.Alert.create({
				title: "",
				message: "o arquivo é muito grande",
				buttons: ["Ok"]
			});
			alert.present();
		} else {
			this.quoteAttach = event.target.files[0];
			this.attachPlaceholder = this.quoteAttach.name;
			if (["image/jpeg", "image/png", "image/jpg"].indexOf(event.target.files[0].type) != -1) {
				attachType = "img";
				attachImage = URL.createObjectURL(event.target.files[0]);
			} else {
				attachType = "document";
			}
		}
	}

	formatDate(date) {
		const locale = this.country.toLowerCase();
		const localDate = moment(date);
		return localDate.date().toLocaleString(locale, { minimumIntegerDigits: 2 }) + (this.country == "PT" ? " de " : " ") + moment.months(localDate.month()) + (this.country == "PT" ? " às " : " a las ") + localDate.hours().toLocaleString(locale, { minimumIntegerDigits: 2 }) + ":" + localDate.minutes().toLocaleString(locale, { minimumIntegerDigits: 2 });
	}
}
