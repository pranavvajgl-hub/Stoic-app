import { Injectable } from '@angular/core';

export interface Item {
    name: string;
    isPacked: boolean;
    imageBase64: string | null;
}

export interface PackList {
    id: number;
    name: string;
    items: Item[];
}

export interface PackedItemInfo {
    itemName: string;
    listName: string; // Přidáme jméno seznamu, ať víme, odkud je

};

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private packLists: PackList[] = [
        {
            id: 1,
            name: "Vandr",
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

    constructor() { }

    public getLists(): PackList[] {
        return this.packLists;
    }

    public getListById(id: number): PackList | undefined {
        // Projde pole "packLists" a vrátí ten,
        // který má shodné ID.
        // Pokud nic nenajde, vrátí "undefined".
        return this.packLists.find(list => list.id === id);
    }

    public addList(listName: string): void {
        const maxId = this.packLists.reduce(
            (max, current) => (current.id > max ? current.id : max), 0
        );

        const newList: PackList = {
            id: maxId + 1,
            name: listName,
            items: []
        };

        this.packLists.push(newList);
    }

    public toggleItemStatus(listId: number, itemName: string): void {
        // 1. Najdeme seznam podle ID
        const list = this.getListById(listId);

        if (list) {
            // 2. Najdeme věc v seznamu podle jména
            const item = list.items.find(i => i.name === itemName);

            if (item) {
                // 3. Přepneme její stav (z true na false, nebo z false na true)
                item.isPacked = !item.isPacked;
            }
        }
    }

    public resetList(listId: number): void {
        const list = this.getListById(listId);

        if (list) {
            for (const item of list.items) {
                item.isPacked = false;
            }
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
        }
    }

    public getAllPackedItems(): PackedItemInfo[] {
        const allPackedItems: PackedItemInfo[] = [];

        // Projdeme všechny seznamy (bubliny)
        for (const list of this.packLists) {

            // V každém seznamu projdeme všechny věci
            for (const item of list.items) {

                // Pokud je věc sbalená...
                if (item.isPacked) {
                    // ...přidáme ji do našeho finálního seznamu
                    allPackedItems.push({
                        itemName: item.name,
                        listName: list.name // A připojíme jméno seznamu!
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
                // Uložíme textovou podobu obrázku
                item.imageBase64 = imageBase64;
            }
        }
    }

}
