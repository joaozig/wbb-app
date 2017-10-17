import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import {
  AlertController,
  ViewController,
  NavParams,
  Events } from 'ionic-angular';

import { Util } from '../../app/util';

@Component({
  selector: 'page-print',
  templateUrl: 'print.html',
})
export class PrintPage {

  bet: any;
  util: any = Util;
  unpairedDevices: any;
  pairedDevices: any;
  loading: boolean = true;

  constructor(
    public bluetoothSerial: BluetoothSerial,
    public params: NavParams,
    public events: Events,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController) {

    this.bet = params.get('bet');
    bluetoothSerial.enable();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  startScanning() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.loading = true;

    this.bluetoothSerial.discoverUnpaired().then((success) => {
      this.unpairedDevices = success;
      this.loading = false;
    },(error) => {
      console.log('unpaired devices error');
      console.log(error);
    });

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    });
  }

  success = (data) => {
    //alert(data);
    this.bluetoothSerial.write(
		'29/08/2017           2 Via 20:51\n'+
		'  \n'+
		'          * WORLDBETS *         \n'+
		'  \n'+
		'================================\n'+
		'Cliente: NOME DO CLIENTE QUE E UM NOME GRANDE\n'+
		'Vendedor: NOME DO VENDEDOR\n'+
		'Data/Hora: 29/08/2017 20:52\n'+
		'Codigo: 98S7S8DF7SD9F89S87F\n'+
		'================================\n'+
		'            PALPITES            \n'+
		'--------------------------------\n'+
		'Palmeiras 5 x 0 Sao Paulo\n'+
		'20/08/2017 - 19:05 \n'+
		'Palpite: VENCEDOR DO JOGO\n'+
		'* Palmeiras x 1.29\n'+
		'                         [ERROU]\n'+
		'--------------------------------\n'+
		'Palmeiras 5 x 0 Sao Paulo\n'+
		'20/08/2017 - 19:05 \n'+
		'Palpite: DUPLA CHANCE\n'+
		'* Palmeiras ou empate x 2.25\n'+
		'                       [ACERTOU]\n'+
		'--------------------------------\n'+
		'Palmeiras 5 x 0 Sao Paulo\n'+
		'20/08/2017 - 19:05 \n'+
		'Palpite: DUPLA CHANCE\n'+
		'* Palmeiras ou empate x 2.25\n'+
		'                      [PENDENTE]\n'+
		'================================\n'+
		'Valor da aposta: R$ 5,00\n'+
		'Palpites: 2\n'+
		'Premio Possivel: R$ 50,00\n'+
		'--------------------------------\n'+
		'* Sera considerado somente o \n'+
		'resultado dos 90 minutos de jogo\n'+
		'e acrescimos.\n'+
		'* Prorrogacao e penaltis sao \n'+
		'ignorados.\n'+
		'* Premio valido somente com a \n'+
		'apresentacao deste bilhete.\n'+
		'\n'+
		'\n'+
		'________________________________\n'+
		'    NOME DO VENDEDOR\n'+
		' \n \n \n').then((success)=>{console.log(success);
    }, (failed)=>{
      console.log(failed);
    });
  }
  fail = (error) => console.log(error);

  selectDevice(address: any) {
    this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
          }
        }
      ]
    }).present();
  }

  disconnect() {
    this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    }).present();
  }
}