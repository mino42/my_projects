import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaptarComponent } from './naptar.component';

describe('NaptarComponent', () => {
  let component: NaptarComponent;
  let fixture: ComponentFixture<NaptarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaptarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaptarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
