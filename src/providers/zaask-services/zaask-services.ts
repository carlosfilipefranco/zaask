import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../user/user";

import "rxjs/add/operator/map";

@Injectable()
export class ZaaskServices {
	server: string;
	headers: any;
	postLoginParams: any;
	params: any;
	url: string;
	constructor(public http: HttpClient, public user: User) {
		this.headers = new Headers();
		this.headers.append("Content-Type", "application/json");

		// this.setServer(this.user.getCountry());
	}

	setServer(country) {
		if (country === "PT") {
			console.log("PT Server Set");
			this.server = "https://www.zaask.pt/api/v1";
			//this.server = "https://staging.zaask.pt";
			//this.server = "http://localhost:8000/api/v1";
		} else {
			console.log("ES Server Set");
			this.server = "https://www.zaask.es/api/v1";
			//this.server = "https://staging.zaask.es";
		}
		// Only for tests
		// this.server = "http://zaask.bo2z";
		// this.server = "/api";
		// this.server = "/api-es";
		// this.server = "/api-dev";
	}

	getUserCountry() {
		return this.user.getCountry();
	}

	storeMobileLogin(api_token, uuid, platform, version, method) {
		this.setServer(this.getUserCountry());
		this.url = `${this.server}/login/app?api_token=${api_token}`;
		const sendObject = { api_token, uuid, platform, version, method };
		return this.http.post(this.url, JSON.stringify(sendObject), { headers: this.headers });
	}

	doLogin(username, password, uuid, platformId, versionId, appVersion) {
		this.setServer(this.getUserCountry());
		this.postLoginParams = "username=" + username + "&password=" + password + "&uuid=" + uuid + "&platform=" + platformId + "&version=" + versionId + "&appversion=" + appVersion;

		console.log("login params -> " + this.postLoginParams);

		return this.http.get(this.server + "/mobile-rest/dologin?" + this.postLoginParams);
	}

	buildParams() {
		this.params = "hashcode=" + this.user.getHashcode() + "&uuid=" + this.user.getUUID() + "&userid=" + this.user.getUserId();

		console.log("buildParams -> " + this.params);

		return this.params;
	}

	getProfile() {
		this.setServer(this.getUserCountry());
		return this.http.get(this.server + "/mobile-rest/getprofile?" + this.buildParams()).map((res: any) => res.json());
	}

	getTasksList() {
		this.setServer(this.getUserCountry());
		this.url = this.server + "/mobile-rest/gettaskslist?" + this.buildParams();
		console.log("ZaaskServices::getTasksList - URL: " + this.url);
		return this.http.get(this.url).map((res: any) => res.json());
	}

	getTaskDetails(taskId) {
		this.setServer(this.getUserCountry());
		this.url = this.server + "/mobile-rest/gettaskdetails?" + this.buildParams() + "&taskid=" + taskId;
		console.log("ZaaskServices::getTaskDetails - URL: " + this.url);
		return this.http.get(this.url).map((res: any) => res.json());
	}

	getQuotesList(filterId) {
		this.setServer(this.getUserCountry());
		this.url = this.server + "/mobile-rest/getquoteslist?" + this.buildParams() + "&filter=" + filterId;
		console.log("ZaaskServices::getQuotesList - URL: " + this.url);
		return this.http.get(this.url).map((res: any) => res.json());
	}

	getQuoteDetails(quoteId) {
		this.setServer(this.getUserCountry());
		this.url = this.server + "/mobile-rest/getquotedetails?" + this.buildParams() + "&quoteid=" + quoteId;
		console.log("ZaaskServices::getQuotesDetails - URL: " + this.url);
		return this.http.get(this.url).map((res: any) => res.json());
	}

	hideTask(taskId) {
		this.setServer(this.getUserCountry());
		return this.http.get(this.server + "/mobile-rest/settaskinvisible?" + this.buildParams() + "&taskid=" + taskId + "&filter=1").map((res: any) => res.json());
	}

	unHideTask(taskId) {
		this.setServer(this.getUserCountry());
		return this.http.get(this.server + "/mobile-rest/settaskinvisible?" + this.buildParams() + "&taskid=" + taskId + "&filter=2").map((res: any) => res.json());
	}

	archiveTask(taskId) {
		this.setServer(this.getUserCountry());
		return this.http.get(this.server + "/mobile-rest/settaskarchived?" + this.buildParams() + "&taskid=" + taskId + "&filter=1").map((res: any) => res.json());
	}

	unArchiveTask(taskId) {
		this.setServer(this.getUserCountry());
		return this.http.get(this.server + "/mobile-rest/settaskarchived?" + this.buildParams() + "&taskid=" + taskId + "&filter=2").map((res: any) => res.json());
	}

	getChatMessages(taskId) {
		this.setServer(this.getUserCountry());
		var url = this.server + "/mobile-rest/getlist?" + this.buildParams() + "&taskid=" + taskId;
		console.log("ZaaskServices::getChatMessages - URL: " + url);
		return this.http.get(url).map((res: any) => res.json());
	}

	setQuote(taskId, priceType, price, observations, source) {
		this.setServer(this.getUserCountry());
		this.url = this.server + "/mobile-rest/setquote?" + this.buildParams() + "&taskid=" + taskId + "&pricetype=" + priceType + "&price=" + price + "&observations=" + observations + "&source=" + source;
		console.log("ZaaskServices::setQuote - URL: " + this.url);
		return this.http.get(this.url).map((res: any) => res.json());
	}

	sendReply(taskId, target, message) {
		this.setServer(this.getUserCountry());
		this.url = this.server + "/mobile-rest/sendreply?" + this.buildParams() + "&hashcode=" + this.user.getHashcode() + "&uuid=" + this.user.getUUID() + "&userid=" + this.user.getUserId() + "&taskid=" + taskId + "&target=" + target + "&message=" + message + "&isfromproduct=" + 0;

		console.log("ZaaskServices::sendReply - URL: " + this.url);
		return this.http.get(this.url).map((res: any) => res.json());
	}

	setNotifs(status) {
		this.setServer(this.getUserCountry());
		this.url = this.server + "/mobile-rest/setnotifs?" + this.buildParams() + "&status=" + status + "&pushuserid=" + this.user.getPushUserId() + "&pushtoken=" + this.user.getPushToken();
		console.log("ZaaskServices::setNotifs - URL: " + this.url);
		return this.http.get(this.url).map((res: any) => res.json());
	}

	getNotifs() {
		this.setServer(this.getUserCountry());
		this.url = this.server + "/mobile-rest/getnotifs?" + this.buildParams() + "&pushuserid=" + this.user.getPushUserId() + "&pushtoken=" + this.user.getPushToken();
		console.log("ZaaskServices::getNotifs - URL: " + this.url);
		return this.http.get(this.url).map((res: any) => res.json());
	}

	registerPushNotif(pushUserId, pushToken) {
		this.setServer(this.getUserCountry());
		this.url = this.server + "/mobile-rest/registerpushnotif?" + this.buildParams() + "&pushuserid=" + pushUserId + "&pushtoken=" + pushToken;
		console.log("ZaaskServices::registerPushNotif - URL: " + this.url);
		return this.http.get(this.url).map((res: any) => res.json());
	}

	//////// Login Methods ////////

	login(user) {
		this.setServer(this.getUserCountry());
		this.url = `${this.server}/login`;
		return this.http.post(this.url, JSON.stringify(user), { headers: this.headers });
	}

	recoverPassword(email) {
		this.setServer(this.getUserCountry());
		this.url = `${this.server}/password/recover`;
		return this.http.post(this.url, JSON.stringify({ email }), { headers: this.headers });
	}

	authRequest() {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/auth/user?api_token=${token}`;
		return this.http.get(this.url);
	}

	authRequestWithTokenParam(token) {
		this.setServer(this.getUserCountry());
		// const token = this.user.getUser().api_key;
		this.url = `${this.server}/auth/user?api_token=${token}`;
		return this.http.get(this.url);
	}

	saveUserData(data) {
		const responseData = JSON.parse(data._body).user;
		this.user.setUserField("nreviews", responseData.nreviews);
		this.user.setUserField("lead_credits", responseData.lead_credits);
		this.user.setUserField("image", responseData.image);
		this.user.setUserField("id", responseData.id);
		this.user.setUserField("uniqcode", responseData.uniqcode);
		this.user.setUserField("notifications", false);
		this.user.setUserField("numstars", responseData.avgreviews);
	}

	setNotification(osUserId, osUserToken, userAgent) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/pushNotification/set?api_token=${token}&osUserId=${osUserId}&osUserToken`;
		const sendObject = { osUserId, osUserToken, userAgent };

		return this.http.post(this.url, JSON.stringify(sendObject), { headers: this.headers });
	}

	unsetNotification(osUserId, userAgent) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;

		this.url = `${this.server}/pushNotification/unset?api_token=${token}`;
		const sendObject = { osUserId, userAgent };
		return this.http.post(this.url, JSON.stringify(sendObject), { headers: this.headers });
	}

	statusNotification(osUserId, userAgent) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;

		this.url = `${this.server}/pushNotification/status?api_token=${token}`;
		const sendObject = { osUserId, userAgent };
		return this.http.post(this.url, JSON.stringify(sendObject), { headers: this.headers });
	}

	setAlert(notification_flag, status) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/notification/settings/set?api_token=${token}`;
		const params = { notification_flag, status };

		return this.http.post(this.url, JSON.stringify(params), { headers: this.headers });
	}

	facebookLogin(token) {
		this.setServer(this.getUserCountry());
		this.url = `${this.server}/facebook/login?token=${token}`;

		return this.http.get(this.url);
	}

	//////// Pro Task Methods ////////

	getProTasksAvailable(pageNr = 1) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/available?api_token=${token}` + "&page=" + pageNr;
		return this.http.get(this.url);
	}

	ignoreProTask(id) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/${id}/ignore?api_token=${token}`;
		return this.http.post(this.url, null, { headers: this.headers });
	}

	abortIgnoreProTask(id) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/${id}/abortIgnore?api_token=${token}`;
		return this.http.post(this.url, null, { headers: this.headers });
	}

	showProTask(id) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/v2/pro/task/${id}/show?api_token=${token}`;
		return this.http.get(this.url);
	}

	archiveProTask(id) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/${id}/archive?api_token=${token}`;
		return this.http.put(this.url, { headers: this.headers });
	}

	setQuoteNew(id, type, value, message, source, attach) {
		this.setServer(this.getUserCountry());
		const api_token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/${id}/buy`;
		//
		const formData = new FormData();
		formData.append("api_token", api_token);
		formData.append("id", id);
		formData.append("type", type);
		formData.append("value", value);
		formData.append("message", message);
		formData.append("source", source);
		formData.append("attach", attach);
		//
		// return Jquery.ajax({
		// 	type: "POST",
		// 	url: this.url,
		// 	data: formData,
		// 	processData: false,
		// 	contentType: false,
		// 	success: function (data) {
		// 		return Promise.resolve(data);
		// 	},
		// 	error: function (err) {
		// 		return Promise.reject(err);
		// 	}
		// });
	}

	getBoughtTasks() {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/bought?api_token=${token}`;
		return this.http.get(this.url);
	}

	getQuotesNew(filter) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/${filter}?api_token=${token}`;
		return this.http.get(this.url).map((res: any) => res.json());
	}

	archiveQuoteNew(id) {
		this.setServer(this.getUserCountry());
		const api_token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/${id}/archive?api_token=${api_token}`;

		return this.http.put(this.url, null, { headers: this.headers });
	}

	unarchiveQuoteNew(id) {
		this.setServer(this.getUserCountry());
		const api_token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/${id}/unarchive?api_token=${api_token}`;

		return this.http.put(this.url, null, { headers: this.headers });
	}

	updateTaskStatus(id, sendingObject) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;
		this.url = `${this.server}/pro/task/${id}/update?api_token=${token}`;

		return this.http.post(this.url, JSON.stringify(sendingObject), { headers: this.headers });
	}

	//////// Chat Methods ////////
	saveMessage(lead_id, description, attach, callBack) {
		this.setServer(this.getUserCountry());
		const token = this.user.getUser().api_key;

		const form = new FormData();
		form.append("lead_id", lead_id);
		form.append("description", description);
		form.append("attach", attach);
		this.url = `${this.server}/pro/notification/save?api_token=${token}`;
		// return Jquery.ajax({
		// 	type: "POST",
		// 	url: this.url,
		// 	data: form,
		// 	processData: false,
		// 	contentType: false,
		// 	success: function (data) {
		// 		callBack(data);
		// 	},
		// 	error: function (data) {
		// 		console.log("error in send message", data);
		// 	}
		// });
	}

	getFormUrlEncoded(toConvert) {
		const formBody = [];
		for (const property in toConvert) {
			const encodedKey = encodeURIComponent(property);
			const encodedValue = encodeURIComponent(toConvert[property]);
			formBody.push(encodedKey + "=" + encodedValue);
		}
		return formBody.join("&");
	}
}
