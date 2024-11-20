import { TestBed } from '@angular/core/testing';

import { AttendanceEndpointService } from './attendance-endpoint.service';

describe('AttendanceEndpointService', () => {
  let service: AttendanceEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
