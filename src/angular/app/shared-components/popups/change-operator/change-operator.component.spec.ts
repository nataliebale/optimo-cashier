import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOperatorComponent } from './change-operator.component';

describe('ChangeOperatorComponent', () => {
  let component: ChangeOperatorComponent;
  let fixture: ComponentFixture<ChangeOperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
