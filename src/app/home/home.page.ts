import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  encodedData = '';
  QRSCANNED_DATA: string;
  isOn = false;
  scannedData: {};
  
  constructor(public qrScanCtrl: QRScanner) {}

}
