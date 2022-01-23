import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestStatusPage } from './request-status';

@NgModule({
  declarations: [
    RequestStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestStatusPage),
  ],
})
export class RequestStatusPageModule {}
