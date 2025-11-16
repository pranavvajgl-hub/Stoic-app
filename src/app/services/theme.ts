import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs'; // 1. IMPORTUJEME "VYSÍLAČ"

// ... definice interface (ThemePalette, ThemeCollection) ...
interface ThemePalette { [key: string]: string; }
interface ThemeCollection { [key: string]: ThemePalette; }


@Injectable({
  providedIn: 'root'
})
export class Theme {

  private renderer: Renderer2;
  private readonly THEME_KEY = 'selectedTheme';
  private themes: ThemeCollection = { /* ... tvoje palety wine, ocean, forest ... */ 
    wine: {
      '--ion-color-primary': '#9D2235', '--ion-color-primary-shade': '#8a1e2f',
      '--ion-color-primary-tint': '#a73849', '--ion-color-light': '#1e1e1e',
      '--ion-color-light-shade': '#1a1a1a', '--ion-color-light-tint': '#353535',
    },
    ocean: {
      '--ion-color-primary': '#3880ff', '--ion-color-primary-shade': '#3171e0',
      '--ion-color-primary-tint': '#4c8dff', '--ion-color-light': '#22262f',
      '--ion-color-light-shade': '#1e2229', '--ion-color-light-tint': '#383d45',
    },
    forest: {
      '--ion-color-primary': '#2dd36f', '--ion-color-primary-shade': '#28ba62',
      '--ion-color-primary-tint': '#42d77d', '--ion-color-light': '#2a2f22',
      '--ion-color-light-shade': '#252a1e', '--ion-color-light-tint': '#3f4538',
    }
  };
  
  // 2. VYTVOŘÍME VEŘEJNÝ "VYSÍLAČ", VÝCHOZÍ JE 'wine'
  public activeTheme = new BehaviorSubject('wine'); 

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadAndApplyTheme();
  }

  private async loadAndApplyTheme() {
    const { value } = await Preferences.get({ key: this.THEME_KEY });
    const themeToApply = value && this.themes[value] ? value : 'wine';
    this.setTheme(themeToApply); // Zavoláme naši hlavní funkci
  }

  public async setTheme(themeName: string) {
    const theme = this.themes[themeName];
    if (!theme) {
      console.warn('Téma nebylo nalezeno:', themeName);
      return;
    }

    for (const [property, value] of Object.entries(theme)) {
      this.renderer.setStyle(document.documentElement, property, value);
    }

    await Preferences.set({ key: this.THEME_KEY, value: themeName });
    
    // 3. OZNÁMÍME VŠEM, KTEŘÍ POSLOUCHAJÍ, ŽE SE ZMĚNILO TÉMA
    this.activeTheme.next(themeName); 
  }

  public getAvailableThemes() {
    return Object.keys(this.themes);
  }
}