import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { User } from "../../providers/user/user";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import moment from "moment-timezone";
import Jquery from "jquery";
import "jquery-datetimepicker";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { APP_VERSION } from "../../env";

@IonicPage()
@Component({
	selector: "page-request-status",
	templateUrl: "request-status.html"
})
export class RequestStatusPage {
	country: string;
	jobIsDone: any;
	taskInfo: any;
	parentScope: any;
	sendMessageCallback: any;
	tabAccount: any;
	tabQuotes: any;
	date: any;
	translate: { header: string; msgPedidosDisponiveis: string; msgPedidosAdquiridos: string; msgMyAccount: string; submitButton: string; personalTitle: string };
	questions: { title: string; options: { label: string; value: number }[]; value: any }[];
	personalMessage: string;
	constructor(public nav: NavController, public platform: Platform, public zaaskServices: ZaaskServices, public user: User, public navParams: NavParams, public form: FormBuilder, public ga: GoogleAnalytics) {
		this.country = this.user.getCountry();
		this.form = form;
		this.jobIsDone = navParams.data.jobIsDone;
		this.taskInfo = navParams.data.taskInfo;
		this.parentScope = navParams.data.parentScope;
		this.sendMessageCallback = navParams.data.sendMessageCallback;
		this.tabAccount = "Account";
		this.tabQuotes = "TaskPage";
		this.date = null;
		Jquery.datetimepicker.setLocale(this.country.toLowerCase());

		this.translate =
			this.country === "PT"
				? {
						header: "Actualizar pedido",
						msgPedidosDisponiveis: "PEDIDOS",
						msgPedidosAdquiridos: "CAIXA DE ENTRADA",
						msgMyAccount: "DEFINIÇÕES",
						submitButton: "Actualizar",
						personalTitle: "Personalize e envie o seu pedido de avaliação"
				  }
				: {
						header: "Actualizar solicitude",
						msgPedidosDisponiveis: "Solicitudes",
						msgPedidosAdquiridos: "Buzón de entrada",
						msgMyAccount: "Definiciones",
						submitButton: "Actualizar",
						personalTitle: "Personaliza y envía tu pedido de valoración"
				  };

		this.questions =
			this.country === "PT"
				? [
						{
							title: "Qual é o estado deste projecto?",
							options: [
								{ label: "Ainda não fui contratado", value: 0 },
								{ label: "Em progresso", value: 1 },
								{ label: "Trabalho realizado", value: 2 }
							],
							value: null
						},
						{
							title: "Quando quer pedir a avaliação?",
							options: [
								{ label: "Imediatamente", value: 0 },
								{ label: "Numa data futura", value: 1 },
								{ label: "Não quero pedir já", value: 2 }
							],
							value: null
						}
				  ]
				: [
						{
							title: "¿Cuál es el estado de este proyecto?",
							options: [
								{ label: "Aún no fui contratado", value: 0 },
								{ label: "En progreso", value: 1 },
								{ label: "Trabajo realizado", value: 2 }
							],
							value: null
						},
						{
							title: "¿Cuándo quieres solicitar la valoración?",
							options: [
								{ label: "Inmediatamente", value: 0 },
								{ label: "En una fecha futura", value: 1 },
								{ label: "Evaluar más tarde", value: 2 }
							],
							value: null
						}
				  ];

		this.personalMessage =
			this.country === "PT"
				? `Foi um prazer poder ajudar na realização do seu projecto.
        Gostaria de saber a sua opinião sobre o meu trabalho e incluir a  sua avaliação no meu perfil Zaask.
        As avaliações são muito importantes para transmitir confiança aos clientes como você e, por isso, agradeço-lhe desde já pela sua disponibilidade.
        Com os melhores cumprimentos,
        ${this.user.name}`
				: `Ha sido un placer poder ayudarte a realizar tu proyecto. Me gustaría saber tu opinión sobre mi trabajo e incluir tu valoración en mi perfil de Zaask.
        Las valoraciones son muy importantes para transmitir confianza a clientes y clientas como tú, por eso te agradezco de antemano tu evaluación.
        Un cordial saludo,
        ${this.user.name}`;

		//Google Analytics
		this.ga.trackView("RequestStatus Screen - " + APP_VERSION, "request-status.html");
	}

	tabRedirect(name) {
		this.nav.setRoot(name);
	}

	submit() {
		let status = "INITIAL";
		let ask_evaluation = null;
		let message = null;
		let date = null;

		if (this.questions[0].value === "0") status = "INITIAL";
		if (this.questions[0].value === "1") status = "IN-PROGRESS";
		if (this.questions[0].value === "2" || this.jobIsDone) status = "DONE";

		if (this.questions[0].value !== "0" && (this.questions[0].value !== null || this.jobIsDone) && (this.questions[1].value === "0" || this.questions[1].value === "1")) {
			message = this.personalMessage;
			//this.sendMessageCallback(message);
		}

		if (this.questions[0].value !== "0" && (this.questions[0].value !== null || this.jobIsDone)) {
			if (this.questions[1].value === "0") ask_evaluation = "NOW";
			if (this.questions[1].value === "1") ask_evaluation = "FUTURE";
			if (this.questions[1].value === "2") ask_evaluation = "NO";
		}

		if (this.questions[1].value === "1") {
			if (this.date === null) {
				this.date = moment().format("YYYY-MM-DD HH:MM:SS");
			}
			date = this.date;
		}

		var sendObject = {
			status,
			message,
			ask_evaluation,
			date
		};
		sendObject.status = status;
		if (message) {
			sendObject.message = message;
			this.sendMessageCallback(message, this.parentScope);
		}
		if (ask_evaluation) sendObject.ask_evaluation = ask_evaluation;
		if (date) sendObject.date = date;
		//this.nav.pop();

		this.zaaskServices.updateTaskStatus(this.taskInfo.task_id, sendObject).subscribe(
			(data) => {
				this.nav.pop();
			},
			(error) => {
				console.log("update status error", error);
			}
		);
	}

	radioChecked() {
		setTimeout(() => {
			if (Jquery("#datetimepicker").length) {
				if (!this.date) {
					this.date = moment().format("YYYY-MM-DD HH:MM:SS");
				}
				Jquery("#datetimepicker").datetimepicker({
					timepicker: false,
					opened: true,
					inline: true,
					minDate: 0,
					format: "YYYY-MM-DD HH:MM:SS",
					onChangeDateTime: function (dp) {
						this.date = moment(dp).format("YYYY-MM-DD HH:MM:SS");
					}
				});
			}
		}, 100);
	}
}
