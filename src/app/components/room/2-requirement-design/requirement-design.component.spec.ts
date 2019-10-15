import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementDesignComponent } from './requirement-design.component';

describe('RequirementDesignComponent', () => {
  let component: RequirementDesignComponent;
  let fixture: ComponentFixture<RequirementDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
