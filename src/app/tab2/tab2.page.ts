import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importujeme náš datový servis a nový typ
import { DataService, PackedItemInfo } from '../services/data.service';

// Importujeme komponenty, co budeme potřebovat
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonNote
} from '@ionic/angular/standalone';

import { ViewWillEnter } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonNote
  ]
})
export class Tab2Page implements ViewWillEnter {

  public allPackedItems: PackedItemInfo[] = [];

  constructor(private dataService: DataService) { }

  ionViewWillEnter() {
    this.allPackedItems = this.dataService.getAllPackedItems();
  }

}