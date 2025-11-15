import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonFab, IonFabButton, IonIcon, AlertController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { DataService, PackList } from '../services/data.service';





@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    ExploreContainerComponent,

    IonFab,
    IonFabButton,
    IonIcon
  ],
})
export class Tab1Page implements OnInit {

  public packLists: PackList[] = [];

  constructor(
    private dataService: DataService,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ add });
  }
  ngOnInit() {
    this.packLists = this.dataService.getLists();
  }
  goToList(listId: number) {
    this.router.navigateByUrl(`/list-detail/${listId}`);
  }

  async createNewList() {
    const alert = await this.alertCtrl.create({
      header: 'Nový seznam',
      message: 'Jak se bude jmenovat?',
      inputs: [
        {
          name: 'listName',
          type: 'text',
          placeholder: 'Např. Dovolená'
        },
        {
          name: 'address',
          type: 'text',
          placeholder: 'Např. Karlštejn 18, 267 18 Karlštejn'
        }
      ],
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel'
        },
        {
          text: 'Vytvořit',
          handler: (data) => {
            if (data.listName && data.listName.trim() !== '') {
              
              this.dataService.addList(data.listName, data.address);

              this.packLists = this.dataService.getLists();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteList(event: Event, listId: number) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: 'Smazat seznam?',
      message: 'Opravdu chceš tento seznam trvale smazat?',
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel'
        },
        {
          text: 'Smazat',
          handler: () => {
            this.dataService.deleteList(listId);
            this.packLists = this.dataService.getLists();
          }
        }
      ]
    });

    await alert.present();
  }

}

