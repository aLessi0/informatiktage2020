import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeltDerInformatikComponent } from './welt-der-informatik.component';

describe('WeltDerInformatikComponent', () => {
  let component: WeltDerInformatikComponent;
  let fixture: ComponentFixture<WeltDerInformatikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeltDerInformatikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeltDerInformatikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
