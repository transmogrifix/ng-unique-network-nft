import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from "./core/components/header/header.component";
import {HttpClientModule} from "@angular/common/http";
import {NodeService} from './core/services/node.service';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireModule} from "@angular/fire/compat";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HeaderComponent,
		HttpClientModule,
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideStorage(() => getStorage()),
		AngularFirestoreModule,
		AngularFireModule.initializeApp(environment.firebase),
		MatSnackBarModule
	],
	providers: [
		NodeService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
