import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { counterComponent } from './counter.component';

describe('counterComponent', () => {
  let component: counterComponent;
  let fixture: ComponentFixture<counterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ counterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(counterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
