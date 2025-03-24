import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseOverlayComponent } from './base-overlay.component';

describe('BaseOverlayComponent', () => {
  let component: BaseOverlayComponent;
  let fixture: ComponentFixture<BaseOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
