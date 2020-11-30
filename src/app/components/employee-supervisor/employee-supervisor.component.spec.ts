import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSupervisorComponent } from './employee-supervisor.component';

describe('EmployeeSupervisorComponent', () => {
  let component: EmployeeSupervisorComponent;
  let fixture: ComponentFixture<EmployeeSupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
