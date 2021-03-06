import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { ErrorHandler, NgModule } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { BetFooterComponent } from '../components/bet-footer/bet-footer';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { BetPage } from '../pages/bet/bet';
import { CurrentBetPage } from '../pages/current-bet/current-bet';
import { EditBetPage } from '../pages/current-bet/edit-bet';
import { FinishedBetPage } from '../pages/finished-bet/finished-bet';
import { ResultsPage } from '../pages/results/results';
import { ManagerPage } from '../pages/manager/manager';
import { FinancialPage } from '../pages/financial/financial';
import { TicketsPage } from '../pages/tickets/tickets';
import { PrintPage } from '../pages/print/print';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    BetFooterComponent,
    LoginPage,
    HomePage,
    BetPage,
    CurrentBetPage,
    EditBetPage,
    FinishedBetPage,
    ResultsPage,
    ManagerPage,
    FinancialPage,
    TicketsPage,
    PrintPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {pageTransition: 'md-transition'}),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    BetPage,
    CurrentBetPage,
    EditBetPage,
    FinishedBetPage,
    ResultsPage,
    ManagerPage,
    FinancialPage,
    TicketsPage,
    PrintPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
