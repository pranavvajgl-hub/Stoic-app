import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, PackList, Item } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { refresh, add, camera } from 'ionicons/icons';
import { AlertController } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton,
  IonList, IonItem, IonLabel,
  IonButton, IonIcon,
  IonFab, IonFabButton,
  IonThumbnail
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
    IonFab,
    IonFabButton, IonThumbnail
  ]
})
export class ListDetailPage implements OnInit {

  public packList: PackList | undefined;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController
  ) {
    addIcons({ refresh, camera, add });
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

  async takePicture(item: Item) {

    if (!this.packList) {
      return;
    }
    const currentListId = this.packList.id;

    try {
      // 2. SPUŠTĚNÍ FOŤÁKU
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true, 
        resultType: CameraResultType.Base64, 
        source: CameraSource.Prompt 
      });

      if (image.base64String) {
        const finalImage = 'data:image/jpeg;base64,' + image.base64String;
        
        // 3. ULOŽENÍ OBRÁZKU
        // Teď použijeme tu bezpečnou proměnnou 'currentListId'
        this.dataService.setItemImage(currentListId, item.name, finalImage);
      }

    } catch (error) {
      // Pokud uživatel focení zruší, nic se neděje.
      // Pokud nastane jiná chyba, vypíšeme ji.
      console.error("Chyba při focení:", error);
    }
  }

}