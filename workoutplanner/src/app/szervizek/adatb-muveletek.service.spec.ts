import { TestBed } from '@angular/core/testing';

import { AdatbMuveletekService } from './adatb-muveletek.service';

describe('AdatbMuveletekService', () => {
  let service: AdatbMuveletekService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdatbMuveletekService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
