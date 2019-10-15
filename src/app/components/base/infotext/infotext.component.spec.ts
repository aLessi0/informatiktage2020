import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotextComponent } from './infotext.component';

describe('InfotextComponent', () => {
  let component: InfotextComponent;
  let fixture: ComponentFixture<InfotextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
