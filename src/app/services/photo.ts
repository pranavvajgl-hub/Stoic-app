import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  // Tato funkce se stará JEN o focení
  public async takePicture(): Promise<string | null> {
    try {
      // Spustí foťák
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64, // Chceme data jako text
        source: CameraSource.Prompt // Zeptá se (Foťák / Galerie)
      });
      console.error("vyfoceno");

      // Pokud máme obrázek, vrátíme ho (jako text)
      if (image.base64String) {
        return image.base64String;
      }
      return null; // Pokud uživatel zrušil

    } catch (error) {
      console.error("Chyba při focení:", error);
      return null;
    }
  }
}