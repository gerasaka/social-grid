import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ListContainerComponent } from './list-container.component';

describe('ListContainerComponent', () => {
  let component: ListContainerComponent;
  let componentRef: ComponentRef<ListContainerComponent>;
  let fixture: ComponentFixture<ListContainerComponent>;
  let router: Router;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(ListContainerComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    router = TestBed.inject(Router);

    componentRef.setInput('pageState', {
      currPage: 1,
      pageSize: 10,
      totalContent: 50,
      loading: false,
    });
    componentRef.setInput('pageFilter', {
      search: '',
      sort: 'DEFAULT',
    });

    fixture.detectChanges();
  });

  it('should initialize the component', () => {
    expect(component).toBeTruthy();
    expect(component.currPage).toBe(1);
  });

  it('should set currPage and apply filters on pagination', () => {
    const newPage = 2;
    const applyFiltersSpy = spyOn(component, 'applyFilters');

    component.currPage = newPage;

    expect(component.currPage).toBe(newPage);
    expect(applyFiltersSpy).toHaveBeenCalledWith({
      search: component.pageFilter().search,
      sort: component.pageFilter().sort,
    });
  });

  it('should call router.navigate with updated queryParams when applyFilters is invoked', () => {
    const routerSpy = spyOn(router, 'navigate');
    const filter = { search: 'test', sort: 'ASC' };

    component.applyFilters(filter);

    expect(routerSpy).toHaveBeenCalledWith(['/'], {
      queryParams: { search: 'test', sort: 'ASC', page: component.currPage },
    });
  });

  it('should exclude default sort in queryParams when applying filters', () => {
    const routerSpy = spyOn(router, 'navigate');
    const filter = { search: null, sort: 'DEFAULT' };

    component.applyFilters(filter);

    expect(routerSpy).toHaveBeenCalledWith(['/'], {
      queryParams: { search: undefined, sort: undefined, page: component.currPage },
    });
  });

  it('should navigate to current route when applying filters', () => {
    const routerSpy = spyOn(router, 'navigate');
    const filter = { search: null, sort: 'DEFAULT' };

    component.applyFilters(filter);

    expect(routerSpy).toHaveBeenCalledWith(['/'], {
      queryParams: { search: undefined, sort: undefined, page: component.currPage },
    });
  });
});
