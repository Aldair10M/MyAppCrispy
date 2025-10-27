import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import 'ionicons/icons';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp({
      projectId: "myappcrispy-a56d2",
      appId: "1:525342644089:web:2803eaf1310c5e73b341a8",
      storageBucket: "myappcrispy-a56d2.firebasestorage.app",
      apiKey: "AIzaSyB9U7LdefaySx4r5wiRlaXbQya5DGejgXo",
      authDomain: "myappcrispy-a56d2.firebaseapp.com",
      messagingSenderId: "525342644089",
      measurementId: "G-YCB1XXGEV6"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});
