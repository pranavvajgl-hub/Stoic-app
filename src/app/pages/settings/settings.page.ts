import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Důležité

// Importujeme naši službu (se správným názvem 'Theme')
import { Theme } from '../../services/theme'; 

// Importujeme komponenty, které použijeme v HTML
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonListHeader, IonRadioGroup, IonRadio, IonItem, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, // Důležité
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonListHeader, IonRadioGroup, IonRadio, IonItem, IonLabel
  ]
})
export class SettingsPage implements OnInit {

  public availableThemes: string[] = []; 
  public currentTheme: string = ''; 

  constructor(
    private themeService: Theme
  ) { }

  ngOnInit() {
    this.availableThemes = this.themeService.getAvailableThemes();
    
    this.themeService.activeTheme.subscribe(themeName => {
      this.currentTheme = themeName;
      // DETEKTIV 1:
      console.log('TÉMA NASTAVENO NA (z vysílače):', themeName);
    });
  }

  /**
   * Tato funkce se zavolá, když uživatel klikne na jiné téma.
   */
  public onThemeChange(event: any) {
    const themeName = event.detail.value;

    // DETEKTIV 2:
    console.log('KLIKNUTO NA ZMĚNU TÉMATU! Chci téma:', themeName);

    // Řekneme službě, aby téma změnila
    this.themeService.setTheme(themeName);
  }

}