import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuoteDetailsPage } from './quote-details';

@NgModule({
  declarations: [
    QuoteDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(QuoteDetailsPage),
  ],
})
export class QuoteDetailsPageModule {}
