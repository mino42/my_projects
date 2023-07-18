import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SulyzosComponent } from './sulyzos.component';

describe('SulyzosComponent', () => {
  let component: SulyzosComponent;
  let fixture: ComponentFixture<SulyzosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SulyzosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SulyzosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
