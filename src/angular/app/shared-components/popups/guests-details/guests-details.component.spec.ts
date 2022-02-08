import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestsDetailsComponent } from './guests-details.component';

describe('GuestsDetailsComponent', () => {
  let component: GuestsDetailsComponent;
  let fixture: ComponentFixture<GuestsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestsDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
