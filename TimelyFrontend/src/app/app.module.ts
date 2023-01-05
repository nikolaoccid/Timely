import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';
import { ButtonComponent } from './components/button/button.component';
import { LogEntryComponent } from './components/log-entry/log-entry.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogBodyComponent } from './components/dialog-body/dialog-body.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    ButtonComponent,
    LogEntryComponent,
    DialogBodyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
