import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuotesFilterPage } from './quotes-filter';

@NgModule({
  declarations: [
    QuotesFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(QuotesFilterPage),
  ],
})
export class QuotesFilterPageModule {}
