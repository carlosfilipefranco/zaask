import { Injectable } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { LoadingController } from "ionic-angular";
import moment from "moment";

@Injectable()
export class Utils {
	constructor(public iab: InAppBrowser, public loadingController: LoadingController) {}
	launchInApp(url, target, uniqcode, isIOS) {
		//console.log(`${url}?uniqcode=${uniqcode}&source=zaaskpro`);
		return this.iab.create(`${url}?uniqcode=${uniqcode}&source=zaaskpro`, target, { location: isIOS ? "no" : "yes", clearcache: "yes", hideurlbar: "yes", hidenavigationbuttons: "no", closebuttoncaption: "Done" });
	}

	createZaaskLoading() {
		return this.loadingController.create({
			spinner: "hide",
			content: '<img src="assets/images/loader_v2.gif" width="100px">'
		});
	}

	getWeekDayFromDateStr(str) {
		const date = new Date(str.replace(/-/g, "/"));
		return moment.weekdays()[date.getDay()];
	}

	getDayFromDateStr(str) {
		const date = new Date(str.replace(/-/g, "/"));
		return date.getDate().toLocaleString("pt-PT", { minimumIntegerDigits: 2 }) + " de " + moment.months()[date.getMonth()];
	}

	getHoursFromDateStr(str) {
		const date = new Date(str.replace(/-/g, "/"));
		return date.getHours().toLocaleString("pt-PT", { minimumIntegerDigits: 2 }) + ":" + date.getMinutes().toLocaleString("pt-PT", { minimumIntegerDigits: 2 });
	}
}
