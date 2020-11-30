import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAssistantComponent } from './employee-assistant.component';

describe('EmployeeAssistantComponent', () => {
  let component: EmployeeAssistantComponent;
  let fixture: ComponentFixture<EmployeeAssistantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAssistantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
