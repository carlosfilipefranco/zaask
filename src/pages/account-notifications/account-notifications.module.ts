import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountNotificationsPage } from './account-notifications';

@NgModule({
  declarations: [
    AccountNotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountNotificationsPage),
  ],
})
export class AccountNotificationsPageModule {}
