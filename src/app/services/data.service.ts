import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences'; 
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

    constructor() {
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
}