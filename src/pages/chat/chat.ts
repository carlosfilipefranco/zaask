import { ANALYZE_FOR_ENTRY_COMPONENTS, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { AlertController, IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { User } from "../../providers/user/user";
import { Utils } from "../../providers/utils/utils";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import io from "socket.io-client";
import moment from "moment-timezone";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { APP_VERSION } from "../../env";
import { CallNumber } from "@ionic-native/call-number";

@IonicPage()
@Component({
	selector: "page-chat",
	templateUrl: "chat.html"
})
export class ChatPage {
	taskInfo = {
		phone: null
	};
	country;
	userId;
	socketHost = "https://zaask-sockets.herokuapp.com/";
	message = "";
	request = "";
	other_user_name = "";
	messages = [];
	messagesPerDay = [];
	taskId;
	filter;
	attach = null;
	attachType = null;
	attachImage = null;
	okText = "Confirmar";
	cancelText = "Cancelar";
	isOtherUserOnline = false;
	aliveSocketInterval = 2 * 60 * 1000;
	RequestTabs;
	requestForm;
	translate;
	socket;
	reviewsAvg = -1;
	reviewsRange = [1, 2, 3, 4, 5];
	other_user_id;
	lead_id;
	response;
	alertTitleError;
	closeButtonText;
	constructor(public nav: NavController, public platform: Platform, public zaaskServices: ZaaskServices, public user: User, public form: FormBuilder, public params: NavParams, public utils: Utils, public Alert: AlertController, public ga: GoogleAnalytics, private callNumber: CallNumber) {
		this.country = this.user.getCountry();

		this.userId = this.user.getUserField("id");

		// this.socketHost = 'https://chat2staging.zaask.pt/';

		if (this.country !== "PT") {
			this.socketHost = "https://zaask-sockets-es.herokuapp.com/";
		}

		this.taskId = this.params.data.id;
		this.filter = this.params.data.filter;

		this.RequestTabs =
			this.country === "PT"
				? [
						{
							key: "Ver detalhes do pedido",
							id: 0
						},
						{
							key: this.filter === "archived" ? "Desarquivar" : "Arquivar",
							id: 1
						},
						{
							key: "Actualizar",
							id: 2
						},
						{
							key: "Pedir avaliação",
							id: 3
						}
				  ]
				: [
						{
							key: "Ver detalles",
							id: 0
						},
						{
							key: this.filter === "archived" ? "Desarchivar" : "Archivar",
							id: 1
						},
						{
							key: "Actualizar solicitud",
							id: 2
						},
						{
							key: "Pedir evaluación",
							id: 3
						}
				  ];

		this.showTask(this.taskId);

		this.translate =
			this.country === "PT"
				? {
						placeholder: "Escrever",
						selectTitle: "O que deseja fazer?",
						bidMoreInfo: "Preciso mais informação",
						seen_at: "Lida às",
						delivered_at: "Entregue às"
				  }
				: {
						placeholder: "Escribir",
						selectTitle: "¿Qué quieres hacer?",
						bidMoreInfo: "Necesito más información",
						seen_at: "A las ",
						delivered_at: "A las "
				  };

		this.socket = io(this.socketHost, { transports: ["websocket"] });
		this.chatLogin();
		this.receive();
		// this.getOnlineStatus();
		// this.otherUserOnline();
		// this.userIsTyping();
		// this.userGoOffline();

		this.socket.on("connect_error", function (error) {
			console.log("error", error);
		});

		window.setInterval(() => {
			this.getUsersOnlineStatus();
		}, this.aliveSocketInterval);

		//
		this.platform.ready().then(() => {
			if (!this.platform.is("ios")) {
				this.platform.registerBackButtonAction(() => {
					this.backButtonAction();
				});
			}
		});
		//

		//Google Analytics
		this.ga.trackView("Chat Screen - " + APP_VERSION, "chat.html");
	}

	backButtonAction() {
		this.nav.setRoot("QuotesPage", { filter: this.params.data.filter });
	}

	chatLogin() {
		this.socket.on("connect", function () {});

		this.socket.emit("login", {
			userId: this.user.id,
			token: this.user.api_key
		});
	}

	otherUserOnline() {
		this.socket.on("online", function (OtherUser) {});
	}

	userGoOffline() {
		this.socket.on("offline", function (OtherUser) {});
	}

	getOnlineStatus() {
		this.socket.on("onlineStatus", (data) => {
			console.log("onlineStatus", data, this.other_user_id);
			if (data[this.other_user_id]) {
				this.isOtherUserOnline = true;
			}
		});
	}

	getUsersOnlineStatus() {
		this.socket.emit("getOnlineStatus", { users: [this.other_user_id] });
	}

	send(description, self) {
		if (!self) self = this;
		self.disableButton = true;
		if ((description && description !== "") || self.attach) {
			self.zaaskServices.saveMessage(self.lead_id, description, self.attach, (response) => {
				const message = {
					notification_from: self.user.id,
					notification_id: response.notification_id,
					notification_description: response.message,
					notification_posteddate: +self.localDateToBackendDate(),
					attachment: response.attach || undefined
				};
				self.message = "";
				self.attach = null;
				self.attachType = null;
				self.attachImage = null;
				self.disableButton = false;
				const dialog = self.lead_id;

				self.socket.emit("send", { dialog, message });
			});
		}
	}

	receive() {
		this.socket.on("message", (data) => {
			//console.log('message', data);
			this.showTask(this.taskId);
		});
	}

	onTextChange() {
		this.socket.emit("typing", {
			dialog: this.lead_id,
			user: this.user.id
		});
	}

	userIsTyping() {
		this.socket.on("typing", function (data) {
			console.log("typing", data);
			// document.getElementById('UserIsTyping').style.opacity = 1;
			// setTimeout(function(){
			//     document.getElementById('UserIsTyping').style.opacity = 0;
			// }, 2000);
		});
	}

	showTask(id) {
		console.log("showTask: " + this.taskId);
		let msgAlert = "";
		if (this.user.getCountry() === "PT") {
			msgAlert = "Por favor espere...";
		} else {
			msgAlert = "Por favor, espere...";
		}

		let loading = this.utils.createZaaskLoading();
		loading.present();

		this.zaaskServices.showProTask(id).subscribe(
			(data: any) => {
				//console.log(_response);
				this.response = data;
				this.taskInfo = data.task;
				this.lead_id = data.lead.id;
				this.messages = data.messages;
				this.autoScroll();
				this.other_user_id = null;

				this.messages.map((item) => {
					if (!this.other_user_id && item.notification_from !== this.userId) {
						console.log(1, item.notification_from);
						this.other_user_id = item.notification_from;
						this.getOnlineStatus();
					}
				});
				//group messages by date
				this.groupMessagesByDate();
				//check if pro was reviewed
				this.checkProReviews();
				//
				this.other_user_name = data.task.owner_name;
				loading.dismiss();
				this.getUsersOnlineStatus();
			},
			(error) => {
				loading.dismiss();
				var alert = this.Alert.create({
					title: "Erro",
					subTitle: "Erro no acesso à Zaask!",
					buttons: ["Fechar"]
				});
				alert.present();
				console.log("login error", error);
			}
		);
	}

	splitOwnerName(name) {
		const splitedName = name.split(" ");

		return splitedName[0] + " " + splitedName[1].charAt(0) + ".";
	}
	setStyleClass(id) {
		// left is ours
		return this.userId === id ? "chat-message left" : "chat-message right";
	}

	openRequestStatus(id) {
		const option = this.RequestTabs[id];

		if (option.id === 0) {
			this.nav.push("TaskDetailsPage", { taskInfo: this.response, updatePaid: true });
		} else if (option.id === 1) {
			if (this.filter === "archived") this.unarchiveTask();
			else this.archiveTask();
		} else if (option.id === 3) {
			this.nav.push("RequestStatusPage", { jobIsDone: true, taskInfo: this.taskInfo, parentScope: this, sendMessageCallback: this.send });
		} else {
			this.nav.push("RequestStatusPage", { jobIsDone: false, taskInfo: this.taskInfo, parentScope: this, sendMessageCallback: this.send });
		}
	}

	localDateToBackendDate() {
		const date = Date;
		return moment.tz(date.now(), this.getServerTimezone());
	}

	getServerTimezone() {
		return this.country === "PT" ? "Europe/Lisbon" : "Europe/Madrid";
	}

	// a function to auto scroll the chat until the bottom of the page.
	autoScroll() {
		setTimeout(function () {
			const chatContainer = document.getElementById("chat-autoscroll");
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}, 10);
	}

	archiveTask() {
		this.zaaskServices.archiveQuoteNew(this.taskId).subscribe(
			(data) => {
				this.nav.setRoot("QuotesPage", { filter: "archived" });
			},
			(err) => {
				var alert = this.Alert.create({
					title: this.alertTitleError,
					message: JSON.parse(err._body.error.message),
					buttons: [this.closeButtonText]
				});
				alert.present();
			},
			() => console.log("Archived task.")
		);
	}

	unarchiveTask() {
		this.zaaskServices.unarchiveQuoteNew(this.taskId).subscribe(
			(data) => {
				this.nav.setRoot("QuotesPage", { filter: "archived" });
			},
			(err) => {
				var alert = this.Alert.create({
					title: this.alertTitleError,
					message: JSON.parse(err._body.error.message),
					buttons: [this.closeButtonText]
				});
				alert.present();
			},
			() => console.log("Unarchived task.")
		);
	}

	attachFile(event) {
		if (event.target.files[0].size / 1024 / 1024 >= 8) {
			var alert = this.Alert.create({
				title: "",
				message: this.country === "PT" ? "o arquivo é muito grande" : "archivo es demasiado grande",
				buttons: ["Ok"]
			});
			alert.present();
		} else {
			this.attach = event.target.files[0];

			if (["image/jpeg", "image/png", "image/jpg"].indexOf(event.target.files[0].type) != -1) {
				this.attachType = "img";
				this.attachImage = URL.createObjectURL(event.target.files[0]);
			} else {
				this.attachType = "document";
			}
		}
	}

	call() {
		this.callNumber.callNumber(`${this.taskInfo.phone}`, true);
	}

	toBase64(file, callback) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			callback(reader.result);
		};
		reader.onerror = function (error) {
			console.log("Error: ", error);
		};
	}

	isItImage(url) {
		return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
	}

	modal(src) {
		const modal = document.getElementById("myModal");
		const modalImg = document.getElementById("img01");

		modal.style.display = "block";
		// modalImg.src = src;

		const span = document.getElementsByClassName("close-span")[0];

		// span.onclick = function () {
		// 	modal.style.display = "none";
		// };
	}

	dontKillMePlease() {
		this.socket.emit("dont-kill-me-please");
	}

	onPageWillLeave() {
		this.dontKillMePlease();
	}

	bidTypeTranslate(type) {
		if (this.country === "PT") {
			return type === "fixed" ? "fixo" : "por hora";
		} else {
			return type === "fixed" ? "fijo" : "por hora";
		}
	}

	groupMessagesByDate() {
		let messages = null;
		let lastDate = null;
		this.messages.forEach((msg) => {
			const msgDate = this.utils.getDayFromDateStr(msg.notification_posteddate);
			if (lastDate != msgDate) {
				messages = [];
				this.messagesPerDay.push({ date: msgDate, messages: messages });
			}
			messages.push(msg);
			lastDate = msgDate;
		});
	}

	getMessageDate(message) {
		const msgDateStr = message.seen_by_user ? message.seen_by_user_date : message.notification_posteddate;
		return this.utils.getDayFromDateStr(msgDateStr);
	}

	getMessageWeekDay(message) {
		const msgDateStr = message.seen_by_user ? message.seen_by_user_date : message.notification_posteddate;
		return this.utils.getWeekDayFromDateStr(msgDateStr);
	}

	getMessageHours(message) {
		const msgDateStr = message.seen_by_user_date ? message.seen_by_user_date.date || message.seen_by_user_date : message.notification_posteddate;
		return this.utils.getHoursFromDateStr(msgDateStr);
	}

	checkProReviews() {
		var reviewRegex = /{{rating-(\d)}}/g;
		this.messages.forEach((msg) => {
			var messageContent = msg.notification_description;
			//get pro review (if applicable)
			if (this.isAReviewMessage(msg)) {
				msg.notification_description = this.removeRegexFromText(messageContent, reviewRegex);
				this.reviewsAvg = this.getReviewsAvgFromMsg(messageContent, reviewRegex);
			}
		});
	}

	isAReviewMessage(chatMessage) {
		return chatMessage.notification_title == "system.REVIEW";
	}

	getReviewsAvgFromMsg(messageText, regex) {
		return regex.exec(messageText)[1];
	}

	removeRegexFromText(messageText, regex) {
		return messageText.replace(regex, "");
	}
}
