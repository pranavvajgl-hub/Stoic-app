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

    private initialSampleLists: PackList[] = [
        {
            id: 1,
            name: "Vandr",
            address: "Sněžka, 542 21 Pec pod Sněžkou",
            items: [
                { name: "Nůž", isPacked: false, imageBase64: null },
                { name: "Spacák", isPacked: false, imageBase64: null },
                { name: "Kartáček", isPacked: false, imageBase64: null },
                { name: "Ešus", isPacked: false, imageBase64: null }
            ]
        },
        {
            id: 2,
            name: "Babička",
            items: [
                { name: "Kniha", isPacked: false, imageBase64: null },
                { name: "Mobil", isPacked: false, imageBase64: null },
                { name: "Nabíječka", isPacked: false, imageBase64: null }
            ]
        },
        {
            id: 3,
            name: "Škola",
            items: [
                { name: "Notebook", isPacked: false, imageBase64: null },
                { name: "Sešit", isPacked: false, imageBase64: null },
                { name: "Pero", isPacked: false, imageBase64: null }
            ]
        }
    ];

    constructor() {
        this.loadLists(); 
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


    public getLists(): PackList[] {
        return this.packLists;
    }
    
    public getListById(id: number): PackList | undefined {
        return this.packLists.find(list => list.id === id);
    }

    public addList(listName: string, address: string): void {
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
        this.saveLists(); 
    }

    public toggleItemStatus(listId: number, itemName: string): void {
        const list = this.getListById(listId);

        if (list) {
            const item = list.items.find(i => i.name === itemName);

            if (item) {
                item.isPacked = !item.isPacked;
                this.saveLists(); 
            }
        }
    }

    public resetList(listId: number): void {
        const list = this.getListById(listId);

        if (list) {
            for (const item of list.items) {
                item.isPacked = false;
            }
            this.saveLists(); 
        }
    }

    public addItemToList(listId: number, itemName: string): void {
        const list = this.getListById(listId);

        if (list) {
            const newItem: Item = {
                name: itemName,
                isPacked: false,
                imageBase64: null
            };

            list.items.push(newItem);
            this.saveLists(); 
        }
    }

    public getAllPackedItems(): PackedItemInfo[] {
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
    
    public setItemImage(listId: number, itemName: string, imageBase64: string): void {
        const list = this.getListById(listId);
        if (list) {
            const item = list.items.find(i => i.name === itemName);
            if (item) {
                item.imageBase64 = imageBase64;
                console.error("ulozeno");
                this.saveLists(); 
            }
        }
    }

    public updateList(listId: number, newName: string, newAddress: string): void {
        const list = this.getListById(listId);

        if (list) {
            list.name = newName;
            list.address = newAddress;
            this.saveLists();
        }
    }

    public deleteList(listId: number): void {
        const index = this.packLists.findIndex(list => list.id === listId);

        if (index > -1) {
            this.packLists.splice(index, 1);
            this.saveLists(); 
        }
    }
}