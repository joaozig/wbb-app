import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

import { LoginService } from '../pages/login/login.service';

@Component({
  templateUrl: 'app.html',
  providers: [LoginService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;
  user: any = {};
  limit: any = {limit: '-', limit_used: '-'};

  constructor(
    public platform: Platform,
    public events: Events,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public loginService: LoginService) {

    this.initializeApp();

    this.loginService.getLoggedUser().then((user) => {
      if (user) {
        this.user = user;
        this.limit.limit = 'R$ ' + this.user.limit;
        this.limit.limit_used = 'R$ ' + this.user.limit_used;
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    });

    events.subscribe('user:logged', (user) => {
      if (user) {
        this.user = user;
        this.limit.limit = 'R$ ' + this.user.limit;
        this.limit.limit_used = 'R$ ' + this.user.limit_used;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.loginService.removeUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }

  refreshLimit() {
    this.limit.limit = 'atualizando...';
    this.limit.limit_used = 'atualizando...';

    this.loginService.getLimit(this.user).then((response) => {
      this.limit = response;
      this.limit.limit = 'R$ ' + this.limit.limit;
      this.limit.limit_used = 'R$ ' + this.limit.limit_used;
    });
  }
}
