import { Component } from '@angular/core'; // Odebrali jsme OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, PackList, Item } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { refresh, add, camera, locationOutline, createOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular/standalone';
import { PhotoService } from '../../services/photo'; // Tvůj import je správný
import { Browser } from '@capacitor/browser';

// ZMĚNA 1: Importujeme ViewWillEnter ze správného místa
import { ViewWillEnter } from '@ionic/angular'; 

import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel,
  IonButton, IonIcon, IonFab, IonFabButton, IonThumbnail
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonButton,
    IonIcon, IonFab, IonFabButton, IonThumbnail
  ]
})
export class ListDetailPage implements ViewWillEnter { // ZMĚNA 2: Používáme ViewWillEnter

  public packList: PackList | undefined;
  private currentListId: number = 0; // Pomocná proměnná pro ID

  constructor(
    private dataService: DataService,
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController
  ) {
    addIcons({ refresh, add, camera, locationOutline, createOutline });
  }

  // ZMĚNA 3: Místo ngOnInit používáme ionViewWillEnter
  async ionViewWillEnter() {
    // Přečteme ID z URL
    // Použijeme snapshot, protože jsme na detailní stránce, která se vždy znovu načte
    const listIdString = this.route.snapshot.paramMap.get('id');
    
    if (listIdString) {
      this.currentListId = +listIdString;
      
      // ZMĚNA 4: Počkáme, až nám služba vrátí data
      this.packList = await this.dataService.getListById(this.currentListId);
    }
  }

  // ZMĚNA 5: Všechny ostatní funkce musí být také 'async' a 'await'
  
  async onItemClick(item: Item): Promise<void> {
    // Teď, když máme dataService asynchronní, musíme počkat na každou operaci
    await this.dataService.toggleItemStatus(this.currentListId, item.name);
    // A znovu načteme data, aby se změna projevila
    this.packList = await this.dataService.getListById(this.currentListId);
  }

  async onResetClick(): Promise<void> {
    await this.dataService.resetList(this.currentListId);
    this.packList = await this.dataService.getListById(this.currentListId);
  }

  async createNewItem(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nová položka',
      message: 'Jak se jmenuje věc, kterou chceš sbalit?',
      inputs: [{ name: 'itemName', type: 'text', placeholder: 'Např. Nůž' }],
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        {
          text: 'Vytvořit',
          handler: async (data) => { // Handler musí být 'async'
            if (data.itemName && data.itemName.trim() !== '') {
              await this.dataService.addItemToList(this.currentListId, data.itemName);
              this.packList = await this.dataService.getListById(this.currentListId);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async takePicture(item: Item): Promise<void> {
    console.log('START: takePicture() - Volám PhotoService...');
    const base64String = await this.photoService.takePicture();
    console.log('CONTINUE: takePicture() - PhotoService odpověděl.');

    if (base64String) {
      const finalImage = 'data:image/jpeg;base64,' + base64String;
      await this.dataService.setItemImage(this.currentListId, item.name, finalImage);
      // Znovu načteme data, aby se zobrazil obrázek
      this.packList = await this.dataService.getListById(this.currentListId);
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
      return;
    }
    // Uložíme si data, protože this.packList se může uvnitř handleru chovat divně
    const currentName = this.packList.name;
    const currentAddress = this.packList.address || '';

    const alert = await this.alertCtrl.create({
      header: 'Upravit seznam',
      inputs: [
        { name: 'listName', type: 'text', placeholder: 'Název seznamu', value: currentName },
        { name: 'address', type: 'text', placeholder: 'Adresa (volitelné)', value: currentAddress }
      ],
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        {
          text: 'Uložit',
          handler: async (data) => { // Handler musí být 'async'
            if (data.listName && data.listName.trim() !== '') {
              await this.dataService.updateList(this.currentListId, data.listName, data.address);
              // Znovu načteme data od zdroje
              this.packList = await this.dataService.getListById(this.currentListId);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}