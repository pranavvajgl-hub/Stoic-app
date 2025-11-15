import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'list-detail/:id',
    loadComponent: () =>
      import('./pages/list-detail/list-detail.page').then(m => m.ListDetailPage)
  },
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes),
  },
];