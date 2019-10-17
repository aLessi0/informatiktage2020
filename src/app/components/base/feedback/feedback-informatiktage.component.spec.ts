import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeedbackInformatiktageComponent} from './feedback-informatiktage.component';

describe('FeedbackComponent', () => {
  let component: FeedbackInformatiktageComponent;
  let fixture: ComponentFixture<FeedbackInformatiktageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackInformatiktageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackInformatiktageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
