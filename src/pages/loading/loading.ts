import { Component } from "@angular/core";
import { IonicPage, Loading, NavController, NavParams } from "ionic-angular";
import { Utils } from "../../providers/utils/utils";

@IonicPage()
@Component({
	selector: "page-loading",
	templateUrl: "loading.html"
})
export class LoadingPage {
	loading: Loading;
	constructor(public Utils: Utils) {}

	ionViewDidLoad() {
		this.loading = this.Utils.createZaaskLoading();
		this.loading.present();
	}

	ionViewDidLeave() {
		this.loading.dismiss();
	}
}
