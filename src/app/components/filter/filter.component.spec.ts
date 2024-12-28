import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let componentRef: ComponentRef<FilterComponent>;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('search', 'test');
    componentRef.setInput('sort', 'ASC');

    fixture.detectChanges();
  });

  it('should set initial form control values based on inputs', () => {
    expect(component.searchQuery.value).toBe('test');
    expect(component.sortQuery.value).toBe('ASC');
  });

  it('should update filters when form values change', () => {
    spyOn(component.applyFilters, 'emit');

    component.searchQuery.setValue('Updated Search');
    component.sortQuery.setValue('DESC');

    component.onSubmit();

    expect(component.applyFilters.emit).toHaveBeenCalledWith({
      search: 'Updated Search',
      sort: 'DESC',
    });
  });

  it('should emit filters when sort value changes', () => {
    spyOn(component.applyFilters, 'emit');

    const newSort = 'DESC';
    component.sortQuery.setValue(newSort);

    expect(component.applyFilters.emit).toHaveBeenCalledWith({
      search: 'test',
      sort: newSort,
    });
  });
});
