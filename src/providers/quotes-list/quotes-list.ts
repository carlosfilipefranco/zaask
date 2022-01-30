import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";
import { ZaaskServices } from "../zaask-services/zaask-services";

@Injectable()
export class QuotesListProvider {
	data: any = null;
	quotesFilter = 1;
	quotesFilterName: any;
	quotes = [
		{
			status: "Loading..."
		}
	];
	quotesName: any;
	quotesNew = ["no-bid", "with-bid", "won", "lost", "refunded", "archived"];
	constructor(public http: HttpClient, public zaaskServices: ZaaskServices, public alert: AlertController) {
		this.zaaskServices = zaaskServices;
		this.setText();
	}

	setText() {
		if (this.zaaskServices.getUserCountry() == "PT") {
			this.quotesName = ["Orçamentos Não Enviados", "Orçamentos Enviados", "Clientes Ganhos", "Clientes Perdidos", "Pedidos Reembolsados", "Pedidos Arquivados"];
		} else {
			this.quotesName = ["Presupuestos no Enviados", "Presupuestos Enviados", "Clientes Adjudicados", "Clientes Perdidos", "Pedidos Reembolsados", "Pedidos Archivados"];
		}
	}

	// getQuotes(filterId, loading) {
	getQuotes(filterId) {
		this.zaaskServices.getQuotesList(filterId).subscribe(
			(data) => {
				console.log(data);
				if (data.status) {
					this.quotes = data.list;
					//  loading.dismiss();
				} else {
					var alert = this.alert.create({
						title: "Erro",
						subTitle: data.message,
						buttons: ["close"]
					});
					// loading.dismiss();
					alert.present();
				}
			},
			(err) => {
				var alert = this.alert.create({
					title: "Erro",
					subTitle: err,
					buttons: ["close"]
				});
				// loading.dismiss();
				alert.present();
			},
			() => console.log("Get quotes list complete.")
		);

		this.quotesFilter = filterId;

		if (filterId == 1) {
			return (this.quotesFilterName = this.quotesName[0]);
		} else if (filterId == 2) {
			return (this.quotesFilterName = this.quotesName[1]);
		} else if (filterId == 3) {
			return (this.quotesFilterName = this.quotesName[2]);
		} else if (filterId == 4) {
			return (this.quotesFilterName = this.quotesName[3]);
		} else if (filterId == 5) {
			return (this.quotesFilterName = this.quotesName[4]);
		} else if (filterId == 6) {
			return (this.quotesFilterName = this.quotesName[5]);
		}

		return this.quotesFilter, this.quotesFilter;
	}

	getQuotesNew(filter) {
		this.zaaskServices.getQuotesNew(filter).subscribe(
			(data: any) => {
				this.quotes = data.data;
			},
			(error) => {
				var alert = this.alert.create({
					title: "Erro",
					subTitle: error,
					buttons: ["close"]
				});
				// loading.dismiss();
				alert.present();
			}
		);

		this.quotesFilter = filter;

		if (filter === "no-bid") {
			return (this.quotesFilterName = this.quotesName[0]);
		} else if (filter === "with-bid") {
			return (this.quotesFilterName = this.quotesName[1]);
		} else if (filter === "won") {
			return (this.quotesFilterName = this.quotesName[2]);
		} else if (filter === "lost") {
			return (this.quotesFilterName = this.quotesName[3]);
		} else if (filter === "refunded") {
			return (this.quotesFilterName = this.quotesName[4]);
		} else if (filter === "archived") {
			return (this.quotesFilterName = this.quotesName[5]);
		}

		return this.quotesFilter, this.quotesFilter;
	}
}
