import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Events } from "ionic-angular";

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
	avgreviews: string;
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
	constructor(private storage: Storage, private events: Events) {
		this.country = "PT";

		// this.storage = new Storage(SqlStorage, { name: "mobile-pro" });
	}

	clearUser() {
		this.storage.remove("user");
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

	getPushUserId() {
		return this.pushuserid;
	}

	getPushToken() {
		return this.pushtoken;
	}

	getCountry() {
		return this.country;
	}

	getKey() {
		return this.api_key;
	}

	setCountry(country) {
		this.country = country;
	}

	set(user) {
		this.username = user.username;
		this.name = user.name;
		this.api_key = user.api_token;
		this.id = user.id;

		this.events.publish("user:update", user);
		return this.storage.set("user", user);
	}

	async setUserField(field, value) {
		this[field] = value;
		const user = await this.storage.get("user");
		user[field] = value;
		this.events.publish("user:update", user);
		return this.storage.set("user", user);
	}

	async getUserField(field) {
		const user = await this.storage.get("user");
		return user[field];
	}

	async get() {
		const user = await this.storage.get("user");
		return user;
	}
}
