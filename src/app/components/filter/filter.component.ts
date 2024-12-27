import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchIcon } from '../../shared/icons/search.component';
import { SortIcon } from '../../shared/icons/sort.component';
import { TFilter, TSortQuery } from './filter.types';

@Component({
  selector: 'filter',
  imports: [CommonModule, ReactiveFormsModule, SortIcon, SearchIcon],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);

  searchQuery = input<string>();
  sortQuery = input<TSortQuery>();
  applyFilters = output<TFilter>();

  search = new FormControl<string>('');
  sort = new FormControl<TSortQuery>('DEFAULT');

  ngOnInit(): void {
    this.search.setValue(this.searchQuery() ?? '');
    this.sort.setValue(this.sortQuery() ?? 'DEFAULT');

    this.initListener();
  }

  initListener() {
    this.sort.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => this.onSubmit(),
    });
  }

  onSubmit(e?: Event) {
    e?.preventDefault();

    this.applyFilters.emit({
      searchQuery: this.search.value,
      sortQuery: this.sort.value,
    });
  }
}
