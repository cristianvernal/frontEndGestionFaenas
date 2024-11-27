import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalEmpresaComponent } from './personal-empresa.component';

describe('PersonalEmpresaComponent', () => {
  let component: PersonalEmpresaComponent;
  let fixture: ComponentFixture<PersonalEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalEmpresaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
