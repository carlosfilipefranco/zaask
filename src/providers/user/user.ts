import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable()
export class User {
	username: string;
	password: string;
	hashcode: string;
	uuid: string;
	userId: string;
	photourl: string;
	name: string;
	subtitle: string;
	numstars: string;
	numreviews: string;
	numcredits: string;
	useractivation: string;
	pushuserid: string;
	pushtoken: string;
	country: string;
	api_key: string;
	id: string;
	uniqcode: string;
	lead_credits: any;
	osUserId;
	constructor(private storage: Storage) {
		this.country = "PT";

		// this.storage = new Storage(SqlStorage, { name: "mobile-pro" });
	}

	setUser(username, password, hashcode, uuid, userId, photourl, name, subtitle, numstars, numreviews, numcredits, useractivation, pushuserid, pushtoken, country, api_key) {
		this.username = username;
		this.password = password;
		this.hashcode = hashcode;
		this.uuid = uuid;
		this.userId = userId;
		this.photourl = photourl;
		this.name = name;
		this.subtitle = subtitle;
		this.numstars = numstars;
		this.numreviews = numreviews;
		this.numcredits = numcredits;
		this.useractivation = useractivation;
		this.pushuserid = pushuserid;
		this.pushtoken = pushtoken;
		this.country = country;
		this.api_key = api_key;

		if (username == "") {
			this.storage.set("user", null);
		} else {
			this.storage.set("user", JSON.stringify(this.getUser()));
		}

		console.log("Information saved in storage: " + JSON.stringify(this.getUser()));
	}

	getUser() {
		return {
			username: this.username,
			password: this.password,
			hashcode: this.hashcode,
			uuid: this.uuid,
			userId: this.userId,
			photourl: this.photourl,
			name: this.name,
			subtitle: this.subtitle,
			numstars: this.numstars,
			numreviews: this.numreviews,
			numcredits: this.numcredits,
			useractivation: this.useractivation,
			pushuserid: this.pushuserid,
			pushtoken: this.pushtoken,
			country: this.country,
			api_key: this.api_key
		};
	}

	clearUser() {
		this.setUser("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
		localStorage.removeItem("user");
	}

	saveUserInfo() {
		this.storage.set("user", JSON.stringify(this.getUser()));
		console.log("UserInfo saved");
	}

	loadUserInfo() {
		this.storage.get("user").then((userInfo) => {
			console.log("User::loadUserInfo - Array saved: " + userInfo);
		});
	}

	getUsername() {
		return this.username;
	}

	getPassword() {
		return this.password;
	}

	getHashcode() {
		return this.hashcode;
	}

	getUUID() {
		return this.uuid;
	}

	getUserId() {
		return this.userId;
	}

	getPhotoUrl() {
		return this.photourl;
	}

	getName() {
		return this.name;
	}

	getSubTitle() {
		return this.subtitle;
	}

	getNumStars() {
		return this.numstars;
	}

	getNumReviews() {
		return this.numreviews;
	}

	getNumCredits() {
		return this.numcredits;
	}

	getUserActivation() {
		return this.useractivation;
	}

	getPushUserId() {
		return this.pushuserid;
	}

	getPushToken() {
		return this.pushtoken;
	}

	setPushUserId(pushuserid) {
		this.pushuserid = pushuserid;
	}

	setPushToken(pushtoken) {
		this.pushtoken = pushtoken;
	}

	getCountry() {
		return this.country;
	}

	setCountry(country) {
		this.country = country;
	}

	setUserNew(user) {
		this.username = user.username;
		this.name = user.name;
		this.api_key = user.api_token;
		this.id = user.id;

		return localStorage.setItem("user", JSON.stringify(user));
	}

	setUserField(field, value) {
		this[field] = value;
		const user = JSON.parse(localStorage.getItem("user"));
		user[field] = value;

		return localStorage.setItem("user", JSON.stringify(user));
	}

	getUserField(field) {
		const user = JSON.parse(localStorage.getItem("user"));
		return user[field];
	}
}
