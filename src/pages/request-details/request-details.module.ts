import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestDetailsPage } from './request-details';

@NgModule({
  declarations: [
    RequestDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestDetailsPage),
  ],
})
export class RequestDetailsPageModule {}
