import {
  Component,
  NgZone,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { OverlayService } from '../../services/shared/overlay.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { MatDrawer } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterOutlet, ToolbarComponent],
})
export class OverlayComponent implements AfterViewInit {
  @ViewChild('overlayContainer', { read: ViewContainerRef })
  overlayContainer!: ViewContainerRef;

  @ViewChild('drawer', { static: true, read: ElementRef })
  drawerRef!: ElementRef;

  @ViewChild('drawer', { static: true })
  drawer!: MatDrawer;

  constructor(
    private readonly overlayService: OverlayService,
    private readonly renderer: Renderer2,
    private readonly ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.overlayService.setContainerRef(this.overlayContainer);
    this.overlayService.setDrawer(this.drawer);

    this.drawer.openedChange.subscribe((opened: boolean) => {
      if (!opened) {
        this.handleDrawerClosed();
      }
    });

    this.ngZone.runOutsideAngular(() => {
      this.drawerRef.nativeElement.addEventListener(
        'transitionend',
        (e: TransitionEvent) => {
          if (this.drawer.opened) {
            this.lockScroll();
          }
        }
      );
    });
  }

  private lockScroll(): void {
    this.renderer.setStyle(document.body, 'position', 'fixed');
    this.renderer.setStyle(document.body, 'width', '100%');
    this.renderer.setStyle(document.body, 'overflow-y', 'scroll');
  }

  private handleDrawerClosed(): void {
    this.renderer.removeStyle(document.body, 'position');
    this.renderer.removeStyle(document.body, 'width');
    this.renderer.removeStyle(document.body, 'overflow-y');
  }
}
