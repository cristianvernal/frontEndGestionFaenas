import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWithTemplateComponent } from './dialog-with-template.component';

describe('DialogWithTemplateComponent', () => {
  let component: DialogWithTemplateComponent;
  let fixture: ComponentFixture<DialogWithTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogWithTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogWithTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
