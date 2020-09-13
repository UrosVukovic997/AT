import { TestBed } from '@angular/core/testing';

import { MyAdsService } from './my-ads.service';

describe('MyAdsService', () => {
  let service: MyAdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyAdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
