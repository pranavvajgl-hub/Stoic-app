import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, PackList, Item } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { refresh, add, camera, locationOutline, createOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from '../../services/photo';
import { Browser } from '@capacitor/browser';
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
    private alertCtrl: AlertController,
    private photoService: PhotoService
  ) {
    addIcons({ refresh, camera, add, locationOutline, createOutline });
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

    console.log('START: takePicture() - Volám PhotoService...');


    if (!this.packList) return;
    const currentListId = this.packList.id;

    const base64String = await this.photoService.takePicture();

    console.log('CONTINUE: takePicture() - Volám PhotoService...');

    if (base64String) {
      const finalImage = 'data:image/jpeg;base64,' + base64String;
      this.dataService.setItemImage(currentListId, item.name, finalImage);
    }
  }

  public async openLocation() {
    if (!this.packList || !this.packList.address || this.packList.address.trim() === '') {
      return; 
    }

    const query = encodeURIComponent(this.packList.address); 
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

    await Browser.open({ url: mapUrl });
  }

  async editList() {
    if (!this.packList) {
      return; // Pojistka
    }

    const alert = await this.alertCtrl.create({
      header: 'Upravit seznam',
      inputs: [
        {
          name: 'listName',
          type: 'text',
          placeholder: 'Název seznamu',
          value: this.packList.name // Předvyplníme aktuální jméno
        },
        {
          name: 'address',
          type: 'text',
          placeholder: 'Adresa (volitelné)',
          value: this.packList.address || '' // Předvyplníme aktuální adresu
        }
      ],
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel'
        },
        {
          text: 'Uložit',
          handler: (data) => {
            if (data.listName && data.listName.trim() !== '' && this.packList) {
              // Zavoláme naši novou metodu ze služby
              this.dataService.updateList(this.packList.id, data.listName, data.address);

              // Také rovnou aktualizujeme data na této stránce
              this.packList.name = data.listName;
              this.packList.address = data.address;
            }
          }
        }
      ]
    });

    await alert.present();
  }

}

