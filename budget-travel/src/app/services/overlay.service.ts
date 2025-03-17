import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private containerRef!: ViewContainerRef;
  private drawer!: MatDrawer; // Store MatDrawer reference

  setContainerRef(containerRef: ViewContainerRef) {
    this.containerRef = containerRef;
  }

  setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  open(component: any, data?: any): ComponentRef<any> | null {
    if (!this.containerRef || !this.drawer) {
      console.error('MatDrawer or ContainerRef is not available!');
      return null;
    }

    this.drawer.open();
    this.containerRef.clear();
    const componentRef = this.containerRef.createComponent(component);

    if (data) {
      Object.assign(componentRef.instance as object, data);
    }

    return componentRef;
  }

  close() {
    if (this.containerRef) {
      this.containerRef.clear();
    }
    if (this.drawer) {
      this.drawer.close();
    }
  }
}
