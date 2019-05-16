import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWreathComponent } from './view-wreath.component';

describe('ViewWreathComponent', () => {
  let component: ViewWreathComponent;
  let fixture: ComponentFixture<ViewWreathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWreathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWreathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
