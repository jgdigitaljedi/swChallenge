// core imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// modules, components, and services
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { StorageService } from './services/storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartComponent } from './components/chart/chart.component';
import { InstructionsDialogComponent } from './components/instructions-dialog/instructions-dialog.component';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [AppComponent, UserFormComponent, ChartComponent, InstructionsDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatListModule
  ],
  providers: [StorageService],
  bootstrap: [AppComponent],
  entryComponents: [InstructionsDialogComponent]
})
export class AppModule { }
