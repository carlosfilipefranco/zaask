import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AlertController, IonicPage, NavController, NavParams, Platform, ToastController } from "ionic-angular";
import { QuotesListProvider } from "../../providers/quotes-list/quotes-list";
import { ZaaskServices } from "../../providers/zaask-services/zaask-services";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { APP_VERSION } from "../../env";

@IonicPage()
@Component({
	selector: "page-quote-details",
	templateUrl: "quote-details.html"
})
export class QuoteDetailsPage {
	requestID;
	askerName;
	taskPrice;
	filter;
	quote;
	askerPhone = "";
	segment = "chat";
	quoteArchived = false;
	quoteClosed = true;
	keyboardOpen = false;
	keyboardAlreadyOpen = false;
	taskTitle;
	postDate: any;
	postAgo: any;
	taskCredits: any;
	askerValidPhone: any;
	when: any;
	here: any;
	questions: any;
	askerPhoto: any;
	googleMapPoint: string;
	chat: any;
	errorSendMessage: boolean;
	chatForm: any;
	message: any;
	formDataBackup: any[];
	alertTitleError: any;
	closeButtonText: any;
	alertTitleSuccess: any;
	msgTooShortError: any;
	sending: boolean;
	requestDetails: any;
	msgSendQuoteTo: string;
	msgSeeAttach: string;
	msgErrorSendAgain: string;
	msgCredits: string;
	msgPhone: string;
	msgNotValidated: string;
	msgValidated: string;
	msgWhat: string;
	msgWhen: string;
	msgHere: string;
	msgSend: string;
	msgChat: string;
	msgRequest: string;
	msgWriteMessage: string;
	constructor(public nav: NavController, public params: NavParams, public zaaskServices: ZaaskServices, public form: FormBuilder, keyboard, public platform: Platform, public quotesList: QuotesListProvider, public Alert: AlertController, public Toast: ToastController, public ga: GoogleAnalytics) {
		this.requestID = params.data.requestID;
		this.askerName = params.data.askerName;
		this.taskPrice = params.data.taskPrice;
		this.filter = params.data.filter;
		this.quote = params.data.quote;

		if (this.filter == 6) {
			this.quoteArchived = true;
		}

		if (this.filter == 1 || this.filter == 2) {
			this.quoteClosed = false;
		}

		// this.keyboard.onClose(this.closeCallback);
		// this.keyboard.close(this.closeCallback);

		this.zaaskServices.getQuoteDetails(this.requestID).subscribe(
			(data) => {
				console.log(data);
				if (data.status) {
					console.log(data);
					this.askerName = data.askerName;
					this.taskTitle = data.taskTitle;
					this.postDate = data.postDate;
					this.postAgo = data.postAgo;
					this.taskCredits = data.taskCredits;
					this.askerPhone = data.askerPhone;
					this.askerValidPhone = data.askerValidPhone;
					this.when = data.when;
					this.here = data.here;
					this.questions = data.what;
					this.askerPhoto = data.askerPhoto;
					this.googleMapPoint = "https://maps.googleapis.com/maps/api/staticmap?sensor=false&center=" + data.centroidX + "," + data.centroidY + "&zoom=13&size=350x175&maptype=roadmap%20&markers=color:red|label:|" + data.centroidX + "," + data.centroidY + "&key=AIzaSyDH0ikt5YpHdBU6iqqVOy5eB1FZCUcZxOo";
					// loading.dismiss();
				} else {
					var alert = Alert.create({
						title: "Erro",
						subTitle: data.message,
						buttons: ["close"]
					});
					// loading.dismiss();
					alert.present();
				}
			},
			(err) => {
				var alert = Alert.create({
					title: "Erro",
					subTitle: err,
					buttons: ["close"]
				});
				// loading.dismiss();
				alert.present();
			},
			() => console.log("Get tasks details complete.")
		);

		/*
    tentando explicar este array:
    é o array as mensagens q supostamente recebo do BE
    os valores iniciais tem a ver com valores repetidos
    para cada pessoa do chat (tasker, asker ou zaask),
    depois tem a conversation, onde cada mensagem preciso de 4 coisas:
    message ->  a mensagem em si,
    who ->      aqui preciso de saber se é do "asker", "tasker"
                ou "zaask" (mensagem interna ex: "rita marcou-o como selecionado")
                pois isso é o q define as classes de cada msg (alinhamento e cores)
                e permite-me aceder ao array tasker / asker / zaask.
                É crucial que o value do who seja igual ao array tasker, asker, zaask
    when ->     a data já tratada tal como no resto da app:
                    qd no prórpio dia -> 16h30,
                    há poucos dias -> 1 dia, 3 dias,
                    há mais de uma semana -> 16/6
    attach ->   caso acha algum attachment nessa mensagem

    type ->     este aplica-se só qd "who" == "zaask", é o que define a
                cor da mensagem interna (info || success || error), tal como na zaask

    Qualquer dúvida que tenhas, re-lê isto e analisa o código do html.
    Se continuares com dúvidas falas comigo ou com o Messias
    que ele ajudou-me a fazer isto x)
    */

		// this.chat = [
		//     {
		//
		//         asker: [
		//             {
		//                 avatar:'/aasker.jpg',
		//                 name:'Rita',
		//                 id:'12345',
		//             }
		//         ],
		//
		//         conversation: [
		//             {
		//                 message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magst laborum.',
		//                 who: 'tasker',
		//                 when: '2 day',
		//                 attach: null,
		//             },
		//             {
		//                 message: 'Rita saw your quote.',
		//                 who: 'zaask',
		//                 when: '16h12',
		//                 type: 'info',
		//             },
		//             {
		//                 message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magst laborum.',
		//                 who: 'asker',
		//                 when: '1 day',
		//                 attach: null,
		//             },
		//             {
		//                 message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magst laborum.',
		//                 who: 'tasker',
		//                 when: '15h43',
		//                 attach: null,
		//             },
		//             {
		//                 message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magst laborum.',
		//                 who: 'asker',
		//                 when: '16h12',
		//                 attach: null,
		//             },
		//             {
		//                 message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magst laborum.',
		//                 who: 'tasker',
		//                 when: 'just now',
		//                 attach: 'http://i.telegraph.co.uk/multimedia/archive/03589/Wellcome_Image_Awa_3589699k.jpg',
		//             },
		//             {
		//                 message: 'Congrats! Rita marked you as hired.',
		//                 who: 'zaask',
		//                 when: '16h12',
		//                 type: 'success',
		//             },
		//         ]
		//
		//         tasker: [
		//             {
		//                 avatar:'/tasker.jpg',
		//                 name:'You',
		//                 id:'54321',
		//             }
		//         ],
		//         zaask: [
		//             {
		//                 avatar:null,
		//                 name:null,
		//                 id:null,
		//             }
		//         ],
		//
		//     }
		// ]

		// console.log(this.chat);
		//

		//NOTE : testing old (hardcode) vs new (param) array
		// console.dir(this.chat);
		// console.log('OLD');
		// console.log(JSON.parse(JSON.stringify(this.chat)));

		this.chat = params.data.chat;
		console.log(this.chat);

		this.errorSendMessage = false;
		this.chatForm = form.group({
			message: ["", Validators.compose([Validators.required, Validators.minLength(1)])]
			// , this.initTryRows()
		});

		this.message = this.chatForm.controls["message"];

		if (this.segment == "chat") {
			this.autoScroll();
		}

		this.formDataBackup = [];

		this.setText();
	}

	onPageWillEnter() {
		//Google Analytics
		this.platform.ready().then(() => {
			this.ga.trackView("QuotesDetails Screen", "quote-details.html");
		});
	}

	// console.log('AQUI!!'+this.chat);

	autoScroll() {
		// a function to auto scroll the chat until the bottom of the page.
		setTimeout(function () {
			var chatContainer = document.getElementById("chat-autoscroll");
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}, 10);
	}

	keyboardCheck() {
		// var tab0 = document.getElementById("tab-0-0");
		// var tab1 = document.getElementById("tab-0-1");
		// var tab2 = document.getElementById("tab-0-2");
		//
		// this.keyboardOpen = true;
		// // setTimeout(()  => console.log('is the keyboard open ', this.keyboard.isOpen()));
		//
		// if (this.keyboard.isOpen && !this.keyboardAlreadyOpen) {
		//     tab0.className += " js-hidden";
		//     tab1.className += " js-hidden";
		//     tab2.className += " js-hidden";
		//     console.log('kb open '+tab2);
		//     this.keyboardAlreadyOpen = true;
		// }
		//
		// if (!this.keyboard.isOpen) {
		//     tab0.classList.className = "";
		//     tab1.classList.className = "";
		//     tab2.classList.className = "";
		//     console.log('kb close');
		//     this.keyboardAlreadyOpen = false;
		// }
	}

	closeCallback() {
		//FIXME this seems not working, so i can't reopen tabs again :/
		// this.keyboardOpen = false;
		// console.log('Closing KB time');
		// this.keyboardCheck();
	}

	// no need for this. phone is directly on button click
	// showContactSheet() {
	//     let actionSheet = ActionSheet.create({
	//         title: 'Contacto',
	//         cssClass: 'action-sheets-basic-page',
	//         buttons: [
	//             {
	//                 text: '<a href="'+this.contact+'">'+this.contact+'</a>',
	//                 //   icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
	//                 icon: 'call',
	//                 handler: () => {
	//                     console.log('phone clicked');
	//                 }
	//             },
	//         ]
	//     });
	//
	//     this.nav.present(actionSheet);
	// }

	archiveQuote(quote) {
		let toast = this.Toast.create({
			message: "Pedido arquivado.",
			duration: 3000,
			showCloseButton: true,
			closeButtonText: "Undo",
			dismissOnPageChange: true
		});

		var index = this.quotesList.quotes.indexOf(this.quote);
		var self = this;
		console.log("Quote to be archived: " + index);
		this.zaaskServices.archiveTask(this.quote.id).subscribe(
			(data) => {
				console.log(data);
				if (data.status) {
					this.quotesList.quotes.splice(index, 1); // remove item

					toast.onDidDismiss((resolved, rejected) => {
						if (rejected == "close") {
							this.zaaskServices.unArchiveTask(this.quote.id).subscribe(
								(data) => {
									console.log(data);
									if (data.status) {
										this.quotesList.quotes.splice(index, 0, this.quote); // put it back
									} else {
										var alert = this.Alert.create({
											title: self.alertTitleError,
											message: data.message,
											buttons: [self.closeButtonText]
										});
										alert.present();
									}
								},
								(err) => {
									// var alert = Alert.create({
									//     title: "Zaask PRO",
									//     subTitle: err,
									//     buttons: [self.closeButtonText]
									// });
									// alert.present();
									console.log(err);
								},
								() => console.log("Not Archived task.")
							);
						}
					});

					toast.present();
				} else {
					var alert = this.Alert.create({
						title: this.alertTitleError,
						message: data.message,
						buttons: [this.closeButtonText]
					});
					alert.present();
				}
			},
			(err) => {
				// var alert = Alert.create({
				//     title: "Erro",
				//     subTitle: err,
				//     buttons: ["close"]
				// });
				// alert.present();
				console.log(err);
			},
			() => console.log("Archived task.")
		);
	}

	sendMessage(formData) {
		console.log("Form submission is ", formData);

		// fills the array with the info I need,
		formData.who = "tasker"; //leave as it is
		if (this.zaaskServices.getUserCountry() == "PT") {
			formData.when = "agora"; // leave as it is (w/trad)
		} else {
			formData.when = "ahora"; // leave as it is (w/trad)
		}
		formData.id = this.chat[0].asker[0].id; // id do asker relativo à conversa

		this.errorSendMessage = false;

		if (this.chatForm.valid && formData.message.length >= 1) {
			/*
        (1) instantaneamente põe a mensagem offline no array. (à pata)
        por trás (no if() ), faz a submissão:
        (2) se houver net, retira o q foi posto à pata ,
        (3)e substitui pela verdadeira chamada ao servidor,
        (4)caso contrário, guarda a msg em formDataBackup,
        (5)retirar-a do array à pata (a*),
        (6)e mostra o erro.

        o timeout aqui é para "simular" uma net lenta para ver as coisas a acontecer.
        */

			this.chat[0].conversation.push(formData); //1

			var debugNet = true; //if there is or not connection
			var self = this;
			setTimeout(
				function (zaaskServices, taskId, nav) {
					if (debugNet) {
						zaaskServices.sendReply(taskId, formData.id, formData.message).subscribe(
							(data) => {
								console.log("quote-details::sendMessage - data received: " + data);
								if (data.status) {
									var alert = this.Alert.create({
										title: self.alertTitleSuccess,
										message: data.message,
										buttons: [
											{
												text: self.closeButtonText,
												type: "button-positive",
												onTap: function (e) {
													nav.setRoot("TabsPage");
												}
											}
										]
									});
									nav.present(alert);
								} else {
									var alert = this.Alert.create({
										title: self.alertTitleError,
										message: data.message,
										buttons: [self.closeButtonText]
									});
									nav.present(alert);
								}
							},
							(err) => {
								// var alert = Alert.create({
								// 	title: "Erro",
								// 	subTitle: err,
								// 	buttons: ["close"]
								// });
								// nav.present(alert);
								console.log(err);
							},
							() => console.log("Send Reply to asker.")
						);
						self.chat[0].conversation.splice(-1, 1); //2
						self.chat[0].conversation.push(formData); //3
						console.log("msg success, sent");
					} else {
						self.formDataBackup = formData; //4
						self.chat[0].conversation.splice(-1, 1); //5
						self.errorSendMessage = true; //6
						console.log("msg error, show error");
					}
				},
				1500,
				this.zaaskServices,
				this.requestID,
				this.nav
			);
		} else {
			var alert = this.Alert.create({
				title: this.alertTitleError,
				message: this.msgTooShortError,
				buttons: [this.closeButtonText]
			});
			alert.present();
		}

		this.chatForm.controls["message"].updateValue("");
	}

	sendAgain() {
		// console.log('sendAgain: '+this.formDataBackup);
		this.sending = true;

		var self = this;
		/*
        simplificando o que isto faz:
        se houver net, ele faz push para o chat[] e oculta o botão
        caso contrário, oculta o spinner (sending), oculta o botão e mostra-o outra vez 500ms depois.

        o timeout aqui é para "simular" uma net lenta para ver as coisas a acontecer.
    */
		var debugWithNet = true;
		if (debugWithNet) {
			setTimeout(function () {
				self.chat[0].conversation.push(self.formDataBackup);
				self.autoScroll();
				self.sending = false;
				self.errorSendMessage = false;
			}, 1500);
		} else {
			setTimeout(function () {
				self.sending = false;
				self.errorSendMessage = false;

				setTimeout(function () {
					self.errorSendMessage = true;
					self.autoScroll();
				}, 50);
			}, 1500);
		}
	}

	editPrice() {
		if (!this.quoteClosed) {
			this.requestDetails.showModal(2, this.filter);
		}
	}

	initTryRows() {
		var self = this;
		setTimeout(function () {
			var elem = document.getElementById("elastic");
			var container = document.getElementById("elasticContainer");
			console.log(elem);
			elem.onkeyup = function (evt) {
				self.tryRows(container, elem, false);
			};
		}, 10);
	}

	tryRows(cont, elem, increment = false) {
		// this.keyboardCheck();
		var computedStyle = getComputedStyle(elem);
		var elemHeight = elem.offsetHeight;
		var scroll = elem.scrollHeight;
		var theight = parseInt(computedStyle.getPropertyValue("border-top-width")) + parseInt(computedStyle.getPropertyValue("border-bottom-width"));

		var containerStyle = getComputedStyle(cont);
		var contMinHeight = parseInt(containerStyle.getPropertyValue("min-height"));

		if (elemHeight - theight < scroll) {
			console.log("ui");
			var rows = elem.getAttribute("rows");
			if (rows < 4) {
				cont.style.minHeight = contMinHeight / 10 + 1 + "rem";
				elem.rows = ++rows;
				this.tryRows(elem, true);
			}
		}
		// else if (false && !increment) {
		// 	console.log("hey");
		// 	var rows = elem.getAttribute("rows");
		// 	elem.rows = --rows;
		// 	this.tryRows(elem, false);
		// }
	}

	setText() {
		console.log("filter: " + this.filter);
		if (this.zaaskServices.getUserCountry() == "PT") {
			if (this.filter == 1 || this.filter == 2) {
				this.msgSendQuoteTo = "Enviar orçamento para";
			} else if (this.filter == 3) {
				this.msgSendQuoteTo = "Orçamento ganho de";
			} else if (this.filter == 4) {
				this.msgSendQuoteTo = "Orçamento perdido de";
			} else if (this.filter == 5) {
				this.msgSendQuoteTo = "Orçamento reembolsado de";
			} else if (this.filter == 6) {
				this.msgSendQuoteTo = "Orçamento arquivado de";
			}
			this.msgSeeAttach = "Ver anexo";
			this.msgErrorSendAgain = "Erro. Clica para enviar novamente";
			this.msgCredits = "créditos";
			this.msgPhone = "Telefone";
			this.msgNotValidated = "não validado";
			this.msgValidated = "validado";
			this.msgWhat = "O quê?";
			this.msgWhen = "Quando?";
			this.msgHere = "Onde?";
			this.msgSend = "Enviar";
			this.closeButtonText = "Fechar";
			this.msgTooShortError = "Mensagem muito curta.";
			this.alertTitleSuccess = "Sucesso";
			this.alertTitleError = "Erro";
			this.msgChat = "Conversa";
			this.msgRequest = "Pedido";
			this.msgWriteMessage = "Escreva sua mensagem";
		} else {
			if (this.filter < 3) {
				this.msgSendQuoteTo = "Envía presupuesto a";
			} else if (this.filter == 3) {
				this.msgSendQuoteTo = "Presupuesto ganho a";
			} else if (this.filter == 4) {
				this.msgSendQuoteTo = "Orçamento perdió a";
			} else if (this.filter == 5) {
				this.msgSendQuoteTo = "Orçamento reintegrado a";
			} else if (this.filter == 6) {
				this.msgSendQuoteTo = "Orçamento archivado a";
			}
			this.msgSeeAttach = "Ver archivo";
			this.msgErrorSendAgain = "Error. Clic para enviar de nuevo";
			this.msgCredits = "créditos";
			this.msgPhone = "Teléfono";
			this.msgNotValidated = "no validado";
			this.msgValidated = "validado";
			this.msgWhat = "¿El qué?";
			this.msgWhen = "¿Cuándo?";
			this.msgHere = "¿Dónde?";
			this.msgSend = "Enviar";
			this.closeButtonText = "Cerrar";
			this.msgTooShortError = "Mensaje muy corto.";
			this.alertTitleSuccess = "Éxito";
			this.alertTitleError = "Error";
			this.msgChat = "Conversación";
			this.msgRequest = "Petición";
			this.msgWriteMessage = "Escriba su mensaje";
		}
	}
}
