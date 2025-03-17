import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { OverlayService } from '../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { MatDrawer } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "../toolbar/toolbar.component";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  imports: [CommonModule, MaterialModule, RouterOutlet, ToolbarComponent],
})
export class OverlayComponent {
  @ViewChild('overlayContainer', { read: ViewContainerRef }) overlayContainer!: ViewContainerRef;
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(private readonly overlayService: OverlayService) {}

  ngAfterViewInit() {
    this.overlayService.setContainerRef(this.overlayContainer);
    this.overlayService.setDrawer(this.drawer);
  }
}
