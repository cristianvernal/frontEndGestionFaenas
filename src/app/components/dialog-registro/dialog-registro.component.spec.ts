import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistroComponent } from './dialog-registro.component';

describe('DialogRegistroComponent', () => {
  let component: DialogRegistroComponent;
  let fixture: ComponentFixture<DialogRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
