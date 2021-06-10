import { TestBed } from '@angular/core/testing';

import { VigenereCipherService } from './vigenere-cipher.service';

describe('VigenereCipherService', () => {
  let service: VigenereCipherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VigenereCipherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
