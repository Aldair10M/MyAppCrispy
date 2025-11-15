import { Component } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule]
})
export class PanelPage {
  title = 'Panel Admin';
  constructor(private router: Router) {}

  goRegisterChef() {
    this.router.navigateByUrl('/admin/register-chef');
  }

  goCreatePromos() {
    this.router.navigateByUrl('/admin/create-promos');
  }
}
