// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DataService, PackList, Item } from '../../services/data.service';
// import { ActivatedRoute } from '@angular/router';
// import { addIcons } from 'ionicons';
// import { refresh, add } from 'ionicons/icons';
// import { AlertController } from '@ionic/angular/standalone';

// import {
//   IonContent, IonHeader, IonTitle, IonToolbar,
//   IonButtons, IonBackButton,
//   IonList, IonItem, IonLabel,
//   IonButton, IonIcon,
//   IonFab, IonFabButton
// } from '@ionic/angular/standalone';

// @Component({
//   selector: 'app-list-detail',
//   templateUrl: './list-detail.page.html',
//   styleUrls: ['./list-detail.page.scss'],
//   standalone: true,
//   imports: [
//     CommonModule, FormsModule,
//     IonContent, IonHeader, IonTitle, IonToolbar,
//     IonButtons, IonBackButton,
//     IonList, IonItem, IonLabel,
//     IonButton, IonIcon
//   ]
// })
// export class ListDetailPage implements OnInit {

//   public packList: PackList | undefined;

//   constructor(
//     private dataService: DataService,
//     private route: ActivatedRoute,
//     private alertCtrl: AlertController
//   ) {
//     addIcons({refresh,add});
//   }

//   ngOnInit() {
//     this.route.paramMap.subscribe(params => {
//       const listId = +params.get('id')!;

//       this.packList = this.dataService.getListById(listId);

//     });
//   }
//   onItemClick(item: Item): void {
//     // Pokud list neexistuje, nic nedělej
//     if (!this.packList) {
//       return;
//     }

//     // Zavoláme naši službu, aby změnila stav
//     this.dataService.toggleItemStatus(this.packList.id, item.name);

//     // 'this.packList' o tom neví. Změna se projeví,
//   }

//   onResetClick(): void {
//     if (this.packList) {
//       // Zavoláme naši službu, aby resetovala data
//       this.dataService.resetList(this.packList.id);
//     }
//   }


// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, PackList, Item } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { refresh, add } from 'ionicons/icons';
import { AlertController } from '@ionic/angular/standalone';

import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton,
  IonList, IonItem, IonLabel,
  IonButton, IonIcon,
  IonFab, IonFabButton  // <-- CHYBA 1 A 2: Byly naimportované,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton,
    IonList, IonItem, IonLabel,
    IonButton, IonIcon,
    // OPRAVA CHYB 1 A 2: Přidáme je sem
    IonFab,
    IonFabButton
  ]
})
export class ListDetailPage implements OnInit {

  public packList: PackList | undefined;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController
  ) {
    addIcons({ refresh, add });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const listId = params.get('id');
      if (listId) {
        this.packList = this.dataService.getListById(+listId);
      }
    });
  }

  onItemClick(item: Item): void {
    if (this.packList) {
      this.dataService.toggleItemStatus(this.packList.id, item.name);
    }
  }

  onResetClick(): void {
    if (this.packList) {
      this.dataService.resetList(this.packList.id);
    }
  }

  // OPRAVA CHYBY 3: Tady je ta chybějící funkce
  async createNewItem() {
    if (!this.packList) {
      return;
    }
    const currentListId = this.packList.id;

    const alert = await this.alertCtrl.create({
      header: 'Nová položka',
      message: 'Jak se jmenuje věc, kterou chceš sbalit?',
      inputs: [
        {
          name: 'itemName',
          type: 'text',
          placeholder: 'Např. Nůž'
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
            if (data.itemName && data.itemName.trim() !== '') {
              this.dataService.addItemToList(currentListId, data.itemName);
            }
          }
        }
      ]
    });

    await alert.present();
  }

}