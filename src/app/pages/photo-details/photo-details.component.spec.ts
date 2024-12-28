import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MOCK_ALBUM } from '../../core/sample-response/album';
import { MOCK_PHOTO } from '../../core/sample-response/photos';
import { ApiService } from '../../core/services/api/api.service';
import { PhotoDetailsPage } from './photo-details.component';

fdescribe('PhotoDetailsPage', () => {
  let component: PhotoDetailsPage;
  let fixture: ComponentFixture<PhotoDetailsPage>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['getPhotoDetails$', 'getAlbumDetails$']);

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ApiService, useValue: apiService }],
    });

    fixture = TestBed.createComponent(PhotoDetailsPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    apiService.getPhotoDetails$.and.returnValue(of(MOCK_PHOTO));
    apiService.getAlbumDetails$.and.returnValue(of(MOCK_ALBUM));
  });

  it('should fetch photo and album details on ngOnInit', () => {
    activatedRoute.snapshot.params = { id: 1 };

    fixture.detectChanges();

    expect(apiService.getPhotoDetails$).toHaveBeenCalledWith(1);
    expect(apiService.getAlbumDetails$).toHaveBeenCalledWith(MOCK_PHOTO.id);
    expect(component.photo).toEqual(MOCK_PHOTO);
    expect(component.album).toEqual(MOCK_ALBUM);
    expect(component.loading).toBeFalse();
  });

  it('should navigate to error page on API error', () => {
    apiService.getPhotoDetails$.and.returnValue(throwError(() => new Error('API error')));

    const routerSpy = spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['error']);
  });

  it('should call history.back when back is called', () => {
    spyOn(history, 'back');

    component.back();

    expect(history.back).toHaveBeenCalled();
  });
});
