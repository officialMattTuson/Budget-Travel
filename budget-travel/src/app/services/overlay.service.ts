import { Injectable, ComponentRef, ViewContainerRef, EventEmitter, Type } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BaseOverlayComponent } from '../components/overlays/base-overlay/base-overlay.component';
import { Expense } from '../models/expense.model';
import { Budget } from '../models/budgets.model';
import { OverlayType } from '../models/overlay-result.model';

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

  open(component: Type<BaseOverlayComponent>, data?: Budget | Expense, type?: OverlayType): ComponentRef<BaseOverlayComponent> | null {
    if (!this.containerRef || !this.drawer) {
      console.error('❌ MatDrawer or ContainerRef is not available!');
      return null;
    }

    this.drawer.open();
    this.containerRef.clear();
    const componentRef = this.containerRef.createComponent(component);

    if (data) {
      componentRef.instance.data = data;
      componentRef.instance.type = type;
      componentRef.instance.initializeWithData();
    }

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
