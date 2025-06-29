import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTripComponent } from './view-trip.component';

describe('ViewTripComponent', () => {
  let component: ViewTripComponent;
  let fixture: ComponentFixture<ViewTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
