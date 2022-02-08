import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryFilterComponent } from './order-history-filter.component';

describe('OrderHistoryFilterComponent', () => {
  let component: OrderHistoryFilterComponent;
  let fixture: ComponentFixture<OrderHistoryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHistoryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
