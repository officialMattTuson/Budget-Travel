import { Injectable, ComponentRef, ViewContainerRef, EventEmitter, Type } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BaseOverlayComponent } from '../components/overlays/add-budget/base-overlay/base-overlay.component';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private containerRef!: ViewContainerRef;
  private drawer!: MatDrawer;
  afterClosed = new EventEmitter<void>();

  setContainerRef(containerRef: ViewContainerRef) {
    this.containerRef = containerRef;
  }

  setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  open(component: Type<BaseOverlayComponent>): ComponentRef<BaseOverlayComponent> | null {
    if (!this.containerRef || !this.drawer) {
      console.error('❌ MatDrawer or ContainerRef is not available!');
      return null;
    }

    this.drawer.open();
    this.containerRef.clear();
    const componentRef = this.containerRef.createComponent(component);

    return componentRef;
  }

  close() {
    if (this.drawer) {
      this.drawer.close();
    }
    if (this.containerRef) {
      this.containerRef.clear();
    }
  }
}
