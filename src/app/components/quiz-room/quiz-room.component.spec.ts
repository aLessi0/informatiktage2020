import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizRoomComponent } from './quiz-room.component';

describe('QuizRoomComponent', () => {
  let component: QuizRoomComponent;
  let fixture: ComponentFixture<QuizRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
