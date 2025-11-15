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
      // Získáme ':id' z naší 'app.routes.ts'
      // Znak '+' na začátku převede text z URL na číslo (např. "1" -> 1)
      const listId = +params.get('id')!; 

      // 2. Požádáme naši službu o data pro toto konkrétní ID
      this.packList = this.dataService.getListById(listId);
      
      // (Pokud by listId neexistovalo, bude v 'packList' hodnota 'undefined')
    });
  }

}