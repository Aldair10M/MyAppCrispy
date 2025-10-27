import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonButton, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonText,
    IonImg,
    CommonModule,
    FormsModule
  ],
})
export class MainPage implements OnInit {
  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {}

  ionViewDidLeave() {
    // Remover el foco de cualquier elemento cuando la página se oculta
    const focusedElement = this.elementRef.nativeElement.querySelector(':focus');
    if (focusedElement) {
      focusedElement.blur();
    }
    
    // Hacer que todos los botones no sean focusables
    const buttons = this.elementRef.nativeElement.querySelectorAll('ion-button');
    buttons.forEach((button: HTMLElement) => {
      button.setAttribute('tabindex', '-1');
    });
  }

  ionViewWillEnter() {
    // Restaurar la capacidad de foco de los botones
    const buttons = this.elementRef.nativeElement.querySelectorAll('ion-button');
    buttons.forEach((button: HTMLElement) => {
      button.removeAttribute('tabindex');
    });
  }

  async goToLogin() {
    const buttons = this.elementRef.nativeElement.querySelectorAll('ion-button');
    buttons.forEach((button: HTMLElement) => {
      button.blur();
      button.setAttribute('tabindex', '-1');
    });
    await this.router.navigateByUrl('/auth/login');
  }

  async goToRegister() {
    const buttons = this.elementRef.nativeElement.querySelectorAll('ion-button');
    buttons.forEach((button: HTMLElement) => {
      button.blur();
      button.setAttribute('tabindex', '-1');
    });
    await this.router.navigateByUrl('/auth/register');
  }
}
