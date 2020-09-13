import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherAdsComponent } from './other-ads.component';

describe('OtherAdsComponent', () => {
  let component: OtherAdsComponent;
  let fixture: ComponentFixture<OtherAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
