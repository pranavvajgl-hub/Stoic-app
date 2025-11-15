import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, PackList, Item } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton,
  IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton,
    IonList, IonItem, IonLabel
  ]
})
export class ListDetailPage implements OnInit {

  public packList: PackList | undefined;

  constructor(private dataService: DataService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const listId = +params.get('id')!;

      this.packList = this.dataService.getListById(listId);

    });
  }
  onItemClick(item: Item): void {
    // Pokud list neexistuje, nic nedělej
    if (!this.packList) {
      return;
    }

    // Zavoláme naši službu, aby změnila stav
    this.dataService.toggleItemStatus(this.packList.id, item.name);

    // 'this.packList' o tom neví. Změna se projeví,
  }

}