import { TestBed } from '@angular/core/testing';

// Musíme importovat SPRÁVNÉ jméno
import { PhotoService } from './photo';

describe('PhotoService', () => { // Musí odpovídat jménu třídy
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoService); // Musí odpovídat jménu třídy
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});