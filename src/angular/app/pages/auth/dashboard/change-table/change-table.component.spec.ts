import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTableComponent } from './change-table.component';

describe('ChangeTableComponent', () => {
  let component: ChangeTableComponent;
  let fixture: ComponentFixture<ChangeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
