import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../user/user";

import "rxjs/add/operator/map";

import Jquery from "jquery";

import { API_URL } from "../../env";

@Injectable()
export class ZaaskServices {
	server: string;
	httpOptions: any;
	postLoginParams: any;
	params: any;
	url: string;
	constructor(public http: HttpClient, public userProvider: User) {
		this.httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json"
			})
		};

		// this.setServer(this.user.getCountry());
	}

	setServer(country) {
		if (country === "PT") {
			this.server = `${API_URL}/api/v1`;
		} else {
			this.server = "https://www.zaask.es/api/v1";
			// this.server = "https://staging.zaask.es";
		}
		// Only for tests
		// this.server = "http://zaask.bo2z";
		// this.server = "/api";
		// this.server = "/api-es";
		// this.server = "/api-dev";
	}

	getUserCountry() {
		return this.userProvider.getCountry();
	}

	storeMobileLogin(api_token, uuid, platform, version, method) {
		this.url = `${this.server}/login/app?api_token=${api_token}`;
		const sendObject = { api_token, uuid, platform, version, method };
		return this.http.post(this.url, JSON.stringify(sendObject), this.httpOptions);
	}

	doLogin(username, password, uuid, platformId, versionId, appVersion) {
		this.postLoginParams = "username=" + username + "&password=" + password + "&uuid=" + uuid + "&platform=" + platformId + "&version=" + versionId + "&appversion=" + appVersion;

		console.log("login params -> " + this.postLoginParams);

		return this.http.get(this.server + "/mobile-rest/dologin?" + this.postLoginParams);
	}

	buildParams() {
		this.params = "hashcode=" + this.userProvider.getHashcode() + "&uuid=" + this.userProvider.getUUID() + "&userid=" + this.userProvider.getUserId();

		console.log("buildParams -> " + this.params);

		return this.params;
	}

	getProfile() {
		return this.http.get(this.server + "/mobile-rest/getprofile?" + this.buildParams());
	}

	getTasksList() {
		this.url = this.server + "/mobile-rest/gettaskslist?" + this.buildParams();
		console.log("ZaaskServices::getTasksList - URL: " + this.url);
		return this.http.get(this.url);
	}

	getTaskDetails(taskId) {
		this.url = this.server + "/mobile-rest/gettaskdetails?" + this.buildParams() + "&taskid=" + taskId;
		console.log("ZaaskServices::getTaskDetails - URL: " + this.url);
		return this.http.get(this.url);
	}

	getQuotesList(filterId) {
		this.url = this.server + "/mobile-rest/getquoteslist?" + this.buildParams() + "&filter=" + filterId;
		console.log("ZaaskServices::getQuotesList - URL: " + this.url);
		return this.http.get(this.url);
	}

	getQuoteDetails(quoteId) {
		this.url = this.server + "/mobile-rest/getquotedetails?" + this.buildParams() + "&quoteid=" + quoteId;
		console.log("ZaaskServices::getQuotesDetails - URL: " + this.url);
		return this.http.get(this.url);
	}

	hideTask(taskId) {
		return this.http.get(this.server + "/mobile-rest/settaskinvisible?" + this.buildParams() + "&taskid=" + taskId + "&filter=1");
	}

	unHideTask(taskId) {
		return this.http.get(this.server + "/mobile-rest/settaskinvisible?" + this.buildParams() + "&taskid=" + taskId + "&filter=2");
	}

	archiveTask(taskId) {
		return this.http.get(this.server + "/mobile-rest/settaskarchived?" + this.buildParams() + "&taskid=" + taskId + "&filter=1");
	}

	unArchiveTask(taskId) {
		return this.http.get(this.server + "/mobile-rest/settaskarchived?" + this.buildParams() + "&taskid=" + taskId + "&filter=2");
	}

	getChatMessages(taskId) {
		var url = this.server + "/mobile-rest/getlist?" + this.buildParams() + "&taskid=" + taskId;
		console.log("ZaaskServices::getChatMessages - URL: " + url);
		return this.http.get(url);
	}

	setQuote(taskId, priceType, price, observations, source) {
		this.url = this.server + "/mobile-rest/setquote?" + this.buildParams() + "&taskid=" + taskId + "&pricetype=" + priceType + "&price=" + price + "&observations=" + observations + "&source=" + source;
		console.log("ZaaskServices::setQuote - URL: " + this.url);
		return this.http.get(this.url);
	}

	sendReply(taskId, target, message) {
		this.url = this.server + "/mobile-rest/sendreply?" + this.buildParams() + "&hashcode=" + this.userProvider.getHashcode() + "&uuid=" + this.userProvider.getUUID() + "&userid=" + this.userProvider.getUserId() + "&taskid=" + taskId + "&target=" + target + "&message=" + message + "&isfromproduct=" + 0;

		console.log("ZaaskServices::sendReply - URL: " + this.url);
		return this.http.get(this.url);
	}

	setNotifs(status) {
		this.url = this.server + "/mobile-rest/setnotifs?" + this.buildParams() + "&status=" + status + "&pushuserid=" + this.userProvider.getPushUserId() + "&pushtoken=" + this.userProvider.getPushToken();
		console.log("ZaaskServices::setNotifs - URL: " + this.url);
		return this.http.get(this.url);
	}

	getNotifs() {
		this.url = this.server + "/mobile-rest/getnotifs?" + this.buildParams() + "&pushuserid=" + this.userProvider.getPushUserId() + "&pushtoken=" + this.userProvider.getPushToken();
		console.log("ZaaskServices::getNotifs - URL: " + this.url);
		return this.http.get(this.url);
	}

	registerPushNotif(pushUserId, pushToken) {
		this.url = this.server + "/mobile-rest/registerpushnotif?" + this.buildParams() + "&pushuserid=" + pushUserId + "&pushtoken=" + pushToken;
		console.log("ZaaskServices::registerPushNotif - URL: " + this.url);
		return this.http.get(this.url);
	}

	//////// Login Methods ////////

	login(user) {
		this.url = `${this.server}/login`;
		return this.http.post(this.url, JSON.stringify(user), this.httpOptions);
	}

	recoverPassword(email) {
		this.url = `${this.server}/password/recover`;
		return this.http.post(this.url, JSON.stringify({ email }), this.httpOptions);
	}

	authRequest() {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/auth/user?api_token=${api_token}`;
		return this.http.get(this.url);
	}

	authRequestWithTokenParam(token) {
		this.url = `${this.server}/auth/user?api_token=${token}`;
		return this.http.get(this.url);
	}

	async saveUserData(data) {
		const responseData = data.user;
		let user = await this.userProvider.get();
		user.nreviews = responseData.nreviews;
		user.lead_credits = responseData.lead_credits;
		user.image = responseData.image;
		user.id = responseData.id;
		user.api_token = responseData.api_token;
		user.notifications = false;
		user.avgreviews = responseData.avgreviews;
		await this.userProvider.set(user);
	}

	setNotification(osUserId, osUserToken, userAgent) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pushNotification/set?api_token=${api_token}&osUserId=${osUserId}&osUserToken`;
		const sendObject = { osUserId, osUserToken, userAgent };

		return this.http.post(this.url, JSON.stringify(sendObject), this.httpOptions);
	}

	unsetNotification(osUserId, userAgent) {
		const api_token = this.userProvider.getKey();

		this.url = `${this.server}/pushNotification/unset?api_token=${api_token}`;
		const sendObject = { osUserId, userAgent };
		return this.http.post(this.url, JSON.stringify(sendObject), this.httpOptions);
	}

	statusNotification(osUserId, userAgent) {
		const api_token = this.userProvider.getKey();

		this.url = `${this.server}/pushNotification/status?api_token=${api_token}`;
		const sendObject = { osUserId, userAgent };
		return this.http.post(this.url, JSON.stringify(sendObject), this.httpOptions);
	}

	setAlert(notification_flag, status) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/notification/settings/set?api_token=${api_token}`;
		const params = { notification_flag, status };

		return this.http.post(this.url, JSON.stringify(params), this.httpOptions);
	}

	facebookLogin(token) {
		this.url = `${this.server}/facebook/login?token=${token}`;

		return this.http.get(this.url);
	}

	appleLogin(token, email) {
		this.url = `${this.server}/apple/login`;
		var user = {
			token,
			email
		};
		return this.http.post(this.url, JSON.stringify(user), this.httpOptions);
	}

	consent(consent) {
		const token = this.userProvider.getKey();
		var user = {
			token,
			consent
		};
		this.url = `${this.server}/user/consent`;

		return this.http.post(this.url, JSON.stringify(user), this.httpOptions);
	}

	//////// Pro Task Methods ////////

	getProTasksAvailable(pageNr = 1) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pro/task/available?api_token=${api_token}` + "&page=" + pageNr;
		return this.http.get(this.url);
	}

	ignoreProTask(id) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pro/task/${id}/ignore?api_token=${api_token}`;
		return this.http.post(this.url, null, this.httpOptions);
	}

	abortIgnoreProTask(id) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pro/task/${id}/abortIgnore?api_token=${api_token}`;
		return this.http.post(this.url, null, this.httpOptions);
	}

	showProTask(id) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/v2/pro/task/${id}/show?api_token=${api_token}`;
		return this.http.get(this.url);
	}

	archiveProTask(id) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pro/task/${id}/archive?api_token=${api_token}`;
		return this.http.put(this.url, this.httpOptions);
	}

	setQuoteNew(id, type, value, message, source, attach) {
		const api_token = this.userProvider.getKey();
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
		return Jquery.ajax({
			type: "POST",
			url: this.url,
			data: formData,
			processData: false,
			contentType: false,
			success: function (data) {
				return Promise.resolve(data);
			},
			error: function (err) {
				return Promise.reject(err);
			}
		});
	}

	getBoughtTasks() {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pro/task/bought?api_token=${api_token}`;
		return this.http.get(this.url);
	}

	getQuotesNew(filter, pageNr = 1) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pro/task/${filter}?api_token=${api_token}&page=${pageNr}`;
		return this.http.get(this.url);
	}

	archiveQuoteNew(id) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pro/task/${id}/archive?api_token=${api_token}`;

		return this.http.put(this.url, null, this.httpOptions);
	}

	unarchiveQuoteNew(id) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pro/task/${id}/unarchive?api_token=${api_token}`;

		return this.http.put(this.url, null, this.httpOptions);
	}

	updateTaskStatus(id, sendingObject) {
		const api_token = this.userProvider.getKey();
		this.url = `${this.server}/pro/task/${id}/update?api_token=${api_token}`;

		return this.http.post(this.url, JSON.stringify(sendingObject), this.httpOptions);
	}

	//////// Chat Methods ////////
	saveMessage(lead_id, description, attach, callBack) {
		const api_token = this.userProvider.getKey();

		const form = new FormData();
		form.append("lead_id", lead_id);
		form.append("description", description);
		form.append("attach", attach);
		this.url = `${this.server}/pro/notification/save?api_token=${api_token}`;
		return Jquery.ajax({
			type: "POST",
			url: this.url,
			data: form,
			processData: false,
			contentType: false,
			success: function (data) {
				callBack(data);
			},
			error: function (data) {
				console.log("error in send message", data);
			}
		});
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
