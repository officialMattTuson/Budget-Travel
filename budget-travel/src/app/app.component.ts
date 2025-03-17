import { Component } from '@angular/core';
import { MaterialModule } from './modules/material.module';
import { OverlayComponent } from "./components/overlay/overlay.component";

@Component({
  selector: 'app-root',
  imports: [MaterialModule, OverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'budget-travel';
}
