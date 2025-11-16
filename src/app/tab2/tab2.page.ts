import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common'; // Přidán NgIf
// Importujeme náš datový servis a nový typ
import { DataService, PackedItemInfo } from '../services/data.service';
// Importujeme PhotoService
import { PhotoService } from '../services/photo';
// Importujeme komponenty, co budeme potřebovat
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonNote,
  IonFab, IonFabButton, IonIcon // Přidány komponenty pro tlačítko
} from '@ionic/angular/standalone';

import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons'; // Funkce pro přidání ikon
import { camera } from 'ionicons/icons'; // Ikona foťáku

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf, // Přidáno NgIf
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonNote,
    IonFab, IonFabButton, IonIcon // Přidány komponenty
  ]
})
export class Tab2Page implements ViewWillEnter {

  public allPackedItems: PackedItemInfo[] = [];
  public capturedImage: string | null = null; // Proměnná pro obrázek

  constructor(
    private dataService: DataService,
    private photoService: PhotoService // Vytvoření instance služby
  ) {
    // Přidáme ikonu, aby ji tlačítko mohlo použít
    addIcons({ camera });
  }

  async ionViewWillEnter() {
    this.allPackedItems = await this.dataService.getAllPackedItems();
  }
  /**
   * Spustí focení a uloží obrázek
   */
  public async takePhoto() {
    const photoData = await this.photoService.takePicture(); //

    if (photoData) {
      // Uložíme obrázek jako Base64 řetězec s prefixem pro HTML
      this.capturedImage = "data:image/jpeg;base64," + photoData;
    }
  }
}