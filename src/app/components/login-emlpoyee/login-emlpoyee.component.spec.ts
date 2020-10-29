import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEmlpoyeeComponent } from './login-emlpoyee.component';

describe('LoginEmlpoyeeComponent', () => {
  let component: LoginEmlpoyeeComponent;
  let fixture: ComponentFixture<LoginEmlpoyeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginEmlpoyeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEmlpoyeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
