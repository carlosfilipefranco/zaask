import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";
import { User } from "../../providers/user/user";
import { APP_VERSION } from "../../env";

@IonicPage()
@Component({
	selector: "page-quotes-filter",
	templateUrl: "quotes-filter.html"
})
export class QuotesFilterPage {
	clicked = false;
	country: string;
	translate: { viewAllQuotes: string; quotesNotSended: string; quotesSended: string; clientsWon: string; clientsLost: string; quotesRefunded: string; quotesArchived: string };
	constructor(public viewCtrl: ViewController, public user: User) {
		this.viewCtrl = viewCtrl;
		this.user = user;
		//
		this.country = this.user.country;

		this.setTranslations();
	}

	setTranslations() {
		this.translate =
			this.country === "PT"
				? {
						viewAllQuotes: "Ver todos os pedidos",
						quotesNotSended: "Mensagens enviadas",
						quotesSended: "Orçamentos enviados",
						clientsWon: "Trabalhos ganhos",
						clientsLost: "Trabalhos não ganhos",
						quotesRefunded: "Reembolsados",
						quotesArchived: "Arquivados"
				  }
				: {
						viewAllQuotes: "Ver todos los pedidos",
						quotesNotSended: "Mensajes enviadas",
						quotesSended: "Presupuestos enviados",
						clientsWon: "Trabajos conseguidos",
						clientsLost: "Trabajos no conseguidos",
						quotesRefunded: "Reembolsados",
						quotesArchived: "Archivados"
				  };
	}

	setFilter(filterCode) {
		const filterName = this.getFilterName(filterCode);
		this.clicked = true;
		this.viewCtrl.dismiss({ filterName: filterName, filterCode: filterCode });
	}

	getFilterName(filterCode) {
		switch (filterCode) {
			case "bought":
				return this.translate.viewAllQuotes;
			case "with-bid":
				return this.translate.quotesSended;
			case "no-bid":
				return this.translate.quotesNotSended;
			case "won":
				return this.translate.clientsWon;
			case "lost":
				return this.translate.clientsLost;
			case "refunded":
				return this.translate.quotesRefunded;
			case "archived":
				return this.translate.quotesArchived;
		}
	}
}
