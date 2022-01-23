import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicPageModule } from "ionic-angular";
import { LoginPage } from "./login";

@NgModule({
	declarations: [LoginPage],
	imports: [IonicPageModule.forChild(LoginPage), FormsModule, ReactiveFormsModule]
})
export class LoginPageModule {}
