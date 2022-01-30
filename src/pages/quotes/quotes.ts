import { Component } from "@angular/core";
import { AlertController, IonicPage, Modal, ModalController, NavController, NavParams, Platform, ToastController } from "ionic-angular";
import { User } from "../../providers/user/user";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import moment from "moment-timezone";
import "moment/locale/pt";
import "moment/locale/es";
import { Utils } from "../../providers/utils/utils";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { APP_VERSION } from "../../env";

@IonicPage()
@Component({
	selector: "page-quotes",
	templateUrl: "quotes.html"
})
export class QuotesPage {
	taskPage: string;
	tabAccount: string;
	country: string;
	showModal: boolean;
	modalFilter: Modal;
	initialFilter: string;
	filter: any;
	searchPlaceholder: any;
	translate: any;
	quotesToShow: any[];
	initialQuotes: any[];
	msgNoResults: string;
	closeButtonText: string;
	alertTitleSuccess: string;
	alertTitleError: string;
	constructor(public nav: NavController, public zaaskServices: ZaaskServices, public platform: Platform, public user: User, public navParams: NavParams, public Alert: AlertController, public Toast: ToastController, public Utils: Utils, public modal: ModalController, public ga: GoogleAnalytics) {
		this.nav = nav;
		this.platform = platform;
		this.zaaskServices = zaaskServices;
		this.taskPage = "TaskPage";
		this.tabAccount = "AccountPage";
		this.user = user;
		this.navParams = navParams;
		//
		this.country = this.user.getCountry();
		this.setText();
		this.setTranslations();
		//
		this.showModal = true;
		this.modalFilter = null;
		this.initialFilter = "bought";
		this.filter = this.navParams.data.filter || this.initialFilter;
		this.searchPlaceholder = this.translate.search;
		//
		this.quotesToShow = [];
		this.initialQuotes = [];
		this.getQuotes(this.filter);
	}

	onPageWillEnter() {
		//Google Analytics
		this.platform.ready().then(() => {
			this.ga.trackView("Quotes Screen", "quotes.html");
		});
	}

	openQuoteDetailsPage(quote, id) {
		this.zaaskServices.getChatMessages(id).subscribe(
			(data: any) => {
				this.nav.push("QuoteDetailsPage", { requestID: id, askerName: data.askerName, taskPrice: data.taskPrice, chat: data.list, filter: this.filter, quote: quote });
			},
			(err) => {
				console.log(err);
			},
			() => console.log("Messages list received.")
		);
	}

	setText() {
		if (this.zaaskServices.getUserCountry() === "PT") {
			this.msgNoResults = "Sem Resultados";
			this.closeButtonText = "Fechar";
			this.alertTitleSuccess = "Sucesso";
			this.alertTitleError = "Erro";
		} else {
			this.msgNoResults = "Sin Resultados";
			this.closeButtonText = "Cerrar";
			this.alertTitleSuccess = "Éxito";
			this.alertTitleError = "Error";
		}
	}

	redirectToChat(id) {
		this.nav.push("ChatPage", { id, filter: this.filter });
	}

	archiveQuote(quoteId, index) {
		let toast = this.Toast.create({
			message: this.translate.quoteArchived,
			duration: 3000,
			showCloseButton: false,
			closeButtonText: "Undo",
			dismissOnPageChange: true
		});
		this.zaaskServices.archiveQuoteNew(quoteId).subscribe(
			(data) => {
				this.quotesToShow.splice(index, 1); // remove item
				toast.present();
			},
			(err) => {
				var alert = this.Alert.create({
					title: this.alertTitleError,
					message: err.message,
					buttons: [this.closeButtonText]
				});
				alert.present();
			},
			() => console.log("Archived task.")
		);
	}

	unarchiveQuote(quoteId, index) {
		let toast = this.Toast.create({
			message: this.translate.quoteUnarchived,
			duration: 3000,
			showCloseButton: false,
			closeButtonText: "Undo",
			dismissOnPageChange: true
		});
		this.zaaskServices.unarchiveQuoteNew(quoteId).subscribe(
			(data) => {
				this.quotesToShow.splice(index, 1); // remove item
				toast.present();
			},
			(err) => {
				var alert = this.Alert.create({
					title: this.alertTitleError,
					message: err.message,
					buttons: [this.closeButtonText]
				});
				alert.present();
			},
			() => console.log("Archived task.")
		);
	}

	tabRedirect(name) {
		this.nav.setRoot(name);
	}

	getRelativeTime(date) {
		let userTimeZone = this.country === "PT" ? "Europe/Lisbon" : "Europe/Madrid";
		let localDate = moment(date).tz(userTimeZone);
		return localDate.fromNow();
	}

	getLocalDate(date) {
		const locale = this.country.toLowerCase();
		moment.locale(locale);
		const userTimeZone = this.country === "PT" ? "Europe/Lisbon" : "Europe/Madrid";
		const localDate = moment(date).tz(userTimeZone);
		return localDate.date().toLocaleString(locale, { minimumIntegerDigits: 2 }) + (this.country == "PT" ? " de " : " ") + moment.months(localDate.month()) + (this.country == "PT" ? " às " : " a las ") + localDate.hours().toLocaleString(locale, { minimumIntegerDigits: 2 }) + ":" + localDate.minutes().toLocaleString(locale, { minimumIntegerDigits: 2 });
	}

	updateSearch(searchQuery) {
		this.quotesToShow = this.initialQuotes.filter((task) => {
			return task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.userName.toLowerCase().includes(searchQuery.toLowerCase());
		});
	}

	openFilter(event) {
		if (this.showModal) this.openModalFilter();
		else this.closeModalFilter();
	}

	clearFilter() {
		this.clearQuery();
		this.getQuotes(this.initialFilter);
	}

	clearQuery() {
		// document.getElementsByClassName("searchbar-input")[0].value = "";
		this.searchPlaceholder = this.translate.search;
	}

	/**
	 * PRIVATE
	 */

	getQuotes(filter) {
		const loading = this.Utils.createZaaskLoading();
		loading.present();
		this.zaaskServices.getQuotesNew(filter).subscribe(
			(res: any) => {
				this.initialQuotes = res.data;
				this.quotesToShow = this.initialQuotes;
			},
			(err) => {
				var alert = this.Alert.create({
					title: "Erro",
					subTitle: err,
					buttons: ["close"]
				});
				alert.present();
			},
			() => {
				loading.dismiss();
			}
		);
	}

	setTranslations() {
		this.translate =
			this.country === "PT"
				? {
						msgPedidosDisponiveis: "PEDIDOS",
						msgPedidosAdquiridos: "CAIXA DE ENTRADA",
						msgMyAccount: "DEFINIÇÕES",
						request: "Pedido",
						details: "Ver detalhes",
						archive: "Arquivar",
						title: "Caixa de Entrada",
						search: "Procurar nos pedidos",
						bided: "Orçamento",
						notBided: "Mensagem",
						won: "Ganho",
						lost: "Perdido",
						refunded: "Reembolsado",
						noRequestsToShow: "Não existem pedidos seleccionados para o filtro",
						clearFilter: "Limpar o filtro",
						unarchive: "Desarquivar",
						quoteUnarchived: "Pedido desarquivado.",
						quoteArchived: "Pedido arquivado."
				  }
				: {
						msgPedidosDisponiveis: "Solicitudes",
						msgPedidosAdquiridos: "Buzón de entrada",
						msgMyAccount: "Definiciones",
						request: "Solicitude",
						details: "Ver detalles",
						archive: "Archivar",
						title: "Buzón de entrada",
						search: "Buscar pedido",
						bided: "Presupuesto",
						notBided: "Mensaje",
						won: "Adjudicado",
						lost: "Perdido",
						refunded: "Reembolsado",
						noRequestsToShow: "No hay solicitudes seleccionadas para el filtro",
						clearFilter: "Limpiar el filtro",
						unarchive: "Desarchivar",
						quoteUnarchived: "Pedido desarchivado.",
						quoteArchived: "Pedido archivado."
				  };
	}

	openModalFilter() {
		this.modalFilter = this.modal.create("QuotesModalFilter");
		this.modalFilter.present();
		this.showModal = false;
		this.modalFilter.onDidDismiss((data) => {
			if (data == undefined) return;
			//
			this.filter = data.filterCode;
			this.searchPlaceholder = data.filterName;
			this.showModal = true;
			this.getQuotes(this.filter);
		});
	}

	closeModalFilter() {
		this.showModal = true;
		this.modalFilter.dismiss();
	}
}
