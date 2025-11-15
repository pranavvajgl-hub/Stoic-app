import { Injectable } from '@angular/core';

export interface Item {
  name: string;
  isPacked: boolean;
}

export interface PackList {
  id: number;
  name: string;
  items: Item[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private packLists: PackList[] = [
    {
      id: 1,
      name: "Vandr",
      items: [
        { name: "Nůž", isPacked: false },
        { name: "Spacák", isPacked: false },
        { name: "Kartáček", isPacked: false },
        { name: "Ešus", isPacked: false }
      ]
    },
    {
      id: 2,
      name: "Babička",
      items: [
        { name: "Kniha", isPacked: false },
        { name: "Mobil", isPacked: false },
        { name: "Nabíječka", isPacked: false }
      ]
    },
    {
      id: 3,
      name: "Škola",
      items: [
        { name: "Notebook", isPacked: false },
        { name: "Sešit", isPacked: false },
        { name: "Pero", isPacked: false }
      ]
    }
  ];

  constructor() { }

  public getLists(): PackList[] {
    return this.packLists;
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
}
