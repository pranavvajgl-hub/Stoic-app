import { Component, OnInit } from '@angular/core';
// Z @angular/common
import { CommonModule } from '@angular/common';

// Z @ionic/angular/standalone
// PŘIDALI JSME: IonFab, IonFabButton, IonIcon, AlertController
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
  private alertCtrl: AlertController
) {
  addIcons({ add });
}
  ngOnInit() {
    this.packLists = this.dataService.getLists();
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
            this.dataService.addList(data.listName);

            this.packLists = this.dataService.getLists();
          }
        }
      }
    ]
  });

  await alert.present();
}
}

