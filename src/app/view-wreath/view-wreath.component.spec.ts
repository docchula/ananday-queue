import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewWreathComponent } from './view-wreath.component';

describe('ViewWreathComponent', () => {
  let component: ViewWreathComponent;
  let fixture: ComponentFixture<ViewWreathComponent>;

  beforeEach(waitForAsync(() => {
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
