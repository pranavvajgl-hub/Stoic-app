import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'; 
import { BehaviorSubject, Observable } from 'rxjs';

// --- NOVÉ KONSTANTY ---
const STORAGE_KEY = 'packListsData';

export interface Item {
    name: string;
    isPacked: boolean;
    imageBase64: string | null;
}

export interface PackList {
    id: number;
    name: string;
    address?: string;
    items: Item[];
}

export interface PackedItemInfo {
    itemName: string;
    listName: string;
};

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private packLists: PackList[] = [];

    private dataLoadedPromise: Promise<void> | undefined;

    private initialSampleLists: PackList[] = [
        {
            id: 1,
            name: "Example List",
            address: "Pražský hrad, 119 08, Hradčany, Praha 1",
            items: [
                { name: "Item1", isPacked: false, imageBase64: null },
                { name: "Item2", isPacked: false, imageBase64: null },
                { name: "Item3", isPacked: false, imageBase64: null },
                { name: "Item4", isPacked: false, imageBase64: null }
            ]
        }
    ];

    constructor(
        private http: HttpClient
    ) {
        // this.loadLists(); 
        this.dataLoadedPromise = this.loadLists();
    }


    private async loadLists() {
        const { value } = await Preferences.get({ key: STORAGE_KEY });

        if (value) {
            this.packLists = JSON.parse(value);
        } else {
            this.packLists = this.initialSampleLists;
            this.saveLists();
        }
    }

    private async saveLists() {
        await Preferences.set({
            key: STORAGE_KEY,
            value: JSON.stringify(this.packLists)
        });
    }


    public async getLists(): Promise<PackList[]> {
        await this.dataLoadedPromise;
        return this.packLists;
    }

    public async getListById(id: number): Promise<PackList | undefined> {
        await this.dataLoadedPromise; // Počkáme na data
        return this.packLists.find(list => list.id === id);
    }

    public async addList(listName: string, address: string): Promise<void> {
        await this.dataLoadedPromise; // Počkáme na data

        const maxId = this.packLists.reduce(
            (max, current) => (current.id > max ? current.id : max), 0
        );

        const newList: PackList = {
            id: maxId + 1,
            name: listName,
            address: address || '',
            items: [],
        };

        this.packLists.push(newList);
        await this.saveLists(); // Počkáme na uložení
    }

    public async toggleItemStatus(listId: number, itemName: string): Promise<void> {
        await this.dataLoadedPromise; // Počkáme na data

        // getListById teď vrací Promise, ale my už data máme,
        // můžeme použít 'find' přímo na pole v paměti.
        const list = this.packLists.find(l => l.id === listId);

        if (list) {
            const item = list.items.find(i => i.name === itemName);
            if (item) {
                item.isPacked = !item.isPacked;
                await this.saveLists(); // Počkáme na uložení
            }
        }
    }

    public async resetList(listId: number): Promise<void> {
        await this.dataLoadedPromise; // Počkáme na data
        const list = this.packLists.find(l => l.id === listId);

        if (list) {
            for (const item of list.items) {
                item.isPacked = false;
            }
            await this.saveLists(); // Počkáme na uložení
        }
    }

    public async addItemToList(listId: number, itemName: string): Promise<void> {
        await this.dataLoadedPromise; // Počkáme na data
        const list = this.packLists.find(l => l.id === listId);

        if (list) {
            const newItem: Item = {
                name: itemName,
                isPacked: false,
                imageBase64: null
            };
            list.items.push(newItem);
            await this.saveLists(); // Počkáme na uložení
        }
    }

    public async getAllPackedItems(): Promise<PackedItemInfo[]> {
        await this.dataLoadedPromise; // Počkáme na data
        const allPackedItems: PackedItemInfo[] = [];

        for (const list of this.packLists) {
            for (const item of list.items) {
                if (item.isPacked) {
                    allPackedItems.push({
                        itemName: item.name,
                        listName: list.name
                    });
                }
            }
        }
        return allPackedItems;
    }

    public async setItemImage(listId: number, itemName: string, imageBase64: string): Promise<void> {
        await this.dataLoadedPromise; // Počkáme na data
        const list = this.packLists.find(l => l.id === listId);

        if (list) {
            const item = list.items.find(i => i.name === itemName);
            if (item) {
                item.imageBase64 = imageBase64;
                console.log("ulozeno"); // Upravil jsem na .log
                await this.saveLists(); // Počkáme na uložení
            }
        }
    }

    public async updateList(listId: number, newName: string, newAddress: string): Promise<void> {
        await this.dataLoadedPromise; // Počkáme na data
        const list = this.packLists.find(l => l.id === listId);

        if (list) {
            list.name = newName;
            list.address = newAddress;
            await this.saveLists(); // Počkáme na uložení
        }
    }

    public async deleteList(listId: number): Promise<void> {
        await this.dataLoadedPromise; // Počkáme na data
        const index = this.packLists.findIndex(list => list.id === listId);

        if (index > -1) {
            this.packLists.splice(index, 1);
            await this.saveLists(); // Počkáme na uložení
        }
    }

    public async deleteItemFromList(listId: number, itemName: string): Promise<void> {
        await this.dataLoadedPromise; // Počkáme na data
        const list = this.packLists.find(l => l.id === listId);

        if (list) {
            // Najdeme index (pozici) položky v seznamu
            const index = list.items.findIndex(item => item.name === itemName);

            if (index > -1) {
                // Pomocí splice ji "vystřihneme" pryč
                list.items.splice(index, 1);
                await this.saveLists(); // A uložíme změny
            }
        }
    }

    public async updateItemInList(listId: number, oldName: string, newName: string): Promise<void> {
        await this.dataLoadedPromise; // Počkáme na data
        const list = this.packLists.find(l => l.id === listId);

        if (list) {
            // Najdeme položku podle STARÉHO jména
            const item = list.items.find(item => item.name === oldName);

            if (item) {
                // Aktualizujeme její jméno
                item.name = newName;
                await this.saveLists(); // A uložíme změny
            }
        }
    }
    public async getSampleApiData(): Promise<any> {
    console.log('Volám externí API...');
    
    // 1. Vytvoříme "volání" (request)
    const request = this.http.get('https://jsonplaceholder.typicode.com/todos/1');

    // 2. Převedeme "Observable" na "Promise" (abychom mohli použít 'await')
    try {
      const data = await firstValueFrom(request);
      console.log('API vrátilo data:', data);
      return data;
    } catch (error) {
      console.error('Chyba při volání API:', error);
      return null;
    }
  }

  
  private async getCoordinatesForAddress(address: string): Promise<{lat: string, lon: string} | null> {
    console.log('Hledám souřadnice pro:', address);
    
    // Musíme adresu "zakódovat" pro URL
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    try {
      // Použijeme náš HttpClient
      const request = this.http.get<any[]>(url);
      const result = await firstValueFrom(request);

      // Zkontrolujeme, jestli jsme něco našli
      if (result && result.length > 0) {
        const data = result[0];
        console.log('Nalezeny souřadnice:', data.lat, data.lon);
        return { lat: data.lat, lon: data.lon };
      } else {
        console.warn('Pro adresu nebyly nalezeny souřadnice:', address);
        return null;
      }
    } catch (error) {
      console.error('Chyba při geocodingu:', error);
      return null;
    }
  }
  
  
  public async getWeatherForAddress(address: string): Promise<number | null> {
    
    // Krok 1: Získáme souřadnice (tato funkce nám zůstala)
    const coords = await this.getCoordinatesForAddress(address);

    if (!coords) {
      return null; // Adresa nebyla nalezena
    }

    // Krok 2: Voláme Open-Meteo (je zdarma a bez klíče)
    console.log('Volám API pro počasí (Open-Meteo)...');
    
    // Tato URL nevyžaduje žádný API klíč!
    // Jen chceme aktuální počasí ('current_weather=true')
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;

    try {
      const request = this.http.get<any>(url);
      const data = await firstValueFrom(request);

      // Open-Meteo vrací data trochu jinak
      if (data && data.current_weather && data.current_weather.temperature) {
        
        const temp = Math.round(data.current_weather.temperature); // Zaokrouhlíme
        
        console.log('Aktuální teplota:', temp, '°C');
        return temp;
        
      } else {
        console.warn('Open-Meteo nevrátilo data o teplotě.');
        return null;
      }
    } catch (error) {
      console.error('Chyba při volání API počasí (Open-Meteo):', error);
      return null;
    }
  }


}
