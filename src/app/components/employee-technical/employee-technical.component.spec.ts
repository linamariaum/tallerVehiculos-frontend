import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTechnicalComponent } from './employee-technical.component';

describe('EmployeeTechnicalComponent', () => {
  let component: EmployeeTechnicalComponent;
  let fixture: ComponentFixture<EmployeeTechnicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTechnicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTechnicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
