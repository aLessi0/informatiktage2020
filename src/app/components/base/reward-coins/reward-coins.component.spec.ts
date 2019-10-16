import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardCoinsComponent } from './reward-coins.component';

describe('RewardCoinsComponent', () => {
  let component: RewardCoinsComponent;
  let fixture: ComponentFixture<RewardCoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardCoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
