import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesApiService } from '../../../core/services/categories-api.service';
import { MilestonesApiService } from '../../../core/services/milestones-api.service';
import { RegionsApiService } from '../../../core/services/regions-api.service';
import { StaticPagesApiService } from '../../../core/services/static-pages-api.service';
import { StatsApiService } from '../../../core/services/stats-api.service';

type ResourceKey = 'categories' | 'regions' | 'milestones' | 'stats' | 'pages';

@Component({
  selector: 'app-admin-resources',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Resources</span>
          <h2>Categories, Regions, Milestones, Stats and Pages</h2>
        </div>
      </div>

      <div class="tabs">
        <button
          type="button"
          *ngFor="let item of resourceKeys"
          [class.active]="active() === item"
          (click)="switchResource(item)"
        >
          {{ labels[item] }}
        </button>
      </div>

      <div class="layout">
        <form class="panel" [formGroup]="form" (ngSubmit)="save()">
          <h3>{{ editing() ? 'Edit' : 'Create' }} {{ labels[active()] }}</h3>

          <div class="grid">
            <input formControlName="slug" placeholder="slug / key" />
            <input formControlName="nameEn" placeholder="name/title/label EN" />
            <input formControlName="nameAr" placeholder="name/title/label AR" />
            <input formControlName="descriptionEn" placeholder="description/body EN" />
            <input formControlName="descriptionAr" placeholder="description/body AR" />
            <input formControlName="icon" placeholder="icon" />
            <input formControlName="value" placeholder="value" />
            <input formControlName="unit" placeholder="unit" />
            <input formControlName="imageUrl" placeholder="image url" />
            <input formControlName="latitude" type="number" placeholder="latitude" />
            <input formControlName="longitude" type="number" placeholder="longitude" />
            <input formControlName="year" type="number" placeholder="year" />
            <input formControlName="sortOrder" type="number" placeholder="sort order" />
          </div>

          <label class="check" *ngIf="active() === 'categories' || active() === 'regions'">
            <input type="checkbox" formControlName="isActive" /> Active
          </label>

          <div class="actions">
            <button type="submit" [disabled]="form.invalid">Save</button>
            <button type="button" class="ghost" (click)="reset()">Clear</button>
          </div>
        </form>

        <div class="panel list">
          <article class="row" *ngFor="let item of items()">
            <div>
              <strong>{{ displayName(item) }}</strong>
              <small>{{ item.slug || item.key || item.year || item.id }}</small>
            </div>
            <div class="actions">
              <button type="button" *ngIf="active() !== 'pages'" (click)="edit(item)">Edit</button>
              <button type="button" class="danger" (click)="remove(item.id)">Delete</button>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page,
      form,
      .list {
        display: grid;
        gap: 14px;
      }

      .page-head,
      .row,
      .actions,
      .tabs {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .page-head,
      .row {
        justify-content: space-between;
        align-items: center;
      }

      .eyebrow {
        color: var(--color-primary);
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
      }

      h2,
      h3,
      small {
        margin: 0;
      }

      h2,
      h3,
      strong {
        color: var(--text-primary);
      }

      small {
        color: var(--text-secondary);
      }

      .tabs button,
      button {
        border: 0;
        border-radius: 6px;
        padding: 10px 13px;
        background: var(--border-color);
        color: var(--text-primary);
        font-weight: 800;
        cursor: pointer;
      }

      button[type='submit'],
      .tabs button.active {
        background: var(--color-primary);
        color: #fff;
      }

      .danger {
        background: #d32f2f;
        color: #fff;
      }

      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr);
        gap: 16px;
      }

      .panel {
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        border-radius: 8px;
        padding: 18px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      input {
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        color: var(--text-primary);
        border-radius: 6px;
        padding: 11px 12px;
        font: inherit;
      }

      .row {
        border-top: 1px solid var(--border-color);
        padding-top: 12px;
      }

      .check {
        color: var(--text-primary);
      }

      @media (max-width: 1050px) {
        .layout,
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminResourcesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoriesApi = inject(CategoriesApiService);
  private readonly regionsApi = inject(RegionsApiService);
  private readonly milestonesApi = inject(MilestonesApiService);
  private readonly statsApi = inject(StatsApiService);
  private readonly pagesApi = inject(StaticPagesApiService);

  readonly resourceKeys: ResourceKey[] = ['categories', 'regions', 'milestones', 'stats', 'pages'];
  readonly labels: Record<ResourceKey, string> = {
    categories: 'Categories',
    regions: 'Regions',
    milestones: 'Milestones',
    stats: 'Stats',
    pages: 'Static Pages',
  };

  readonly active = signal<ResourceKey>('categories');
  readonly items = signal<any[]>([]);
  readonly editing = signal<any | null>(null);

  readonly form = this.fb.group({
    slug: [''],
    nameEn: ['', Validators.required],
    nameAr: [''],
    descriptionEn: [''],
    descriptionAr: [''],
    icon: [''],
    value: [''],
    unit: [''],
    imageUrl: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
    year: [new Date().getFullYear()],
    sortOrder: [0],
    isActive: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  switchResource(resource: ResourceKey): void {
    this.active.set(resource);
    this.reset();
    this.load();
  }

  load(): void {
    const resource = this.active();
    const handler = {
      categories: () => this.categoriesApi.getAdminCategories(),
      regions: () => this.regionsApi.getAdminRegions(),
      milestones: () => this.milestonesApi.getAdminMilestones(),
      stats: () => this.statsApi.getAdminStats(),
      pages: () => this.pagesApi.getAdminPages(),
    }[resource];

    (handler() as any).subscribe({
      next: (items: any[]) => this.items.set(items),
      error: (error: unknown) => console.error(`Failed to load ${resource}`, error),
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const request = this.buildSaveRequest();
    (request as any).subscribe({
      next: () => {
        this.reset();
        this.load();
      },
      error: (error: unknown) => console.error(`Failed to save ${this.active()}`, error),
    });
  }

  edit(item: any): void {
    this.editing.set(item);
    this.form.patchValue({
      slug: item.slug ?? item.key ?? '',
      nameEn: item.name?.en ?? item.title?.en ?? item.label?.en ?? '',
      nameAr: item.name?.ar ?? item.title?.ar ?? item.label?.ar ?? '',
      descriptionEn: item.description?.en ?? item.body?.en ?? '',
      descriptionAr: item.description?.ar ?? item.body?.ar ?? '',
      icon: item.icon ?? '',
      value: item.value ?? '',
      unit: item.unit ?? '',
      imageUrl: item.imageUrl ?? '',
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
      year: item.year ?? new Date().getFullYear(),
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
  }

  reset(): void {
    this.editing.set(null);
    this.form.reset({
      year: new Date().getFullYear(),
      sortOrder: 0,
      isActive: true,
    });
  }

  remove(id: number): void {
    if (!confirm(`Delete this ${this.labels[this.active()]} item?`)) {
      return;
    }

    const resource = this.active();
    const request = {
      categories: () => this.categoriesApi.deleteCategory(id),
      regions: () => this.regionsApi.deleteRegion(id),
      milestones: () => this.milestonesApi.deleteMilestone(id),
      stats: () => this.statsApi.deleteStat(id),
      pages: () => this.pagesApi.deletePage(id),
    }[resource]();

    request.subscribe({
      next: () => this.load(),
      error: (error) => console.error(`Failed to delete ${resource}`, error),
    });
  }

  displayName(item: any): string {
    return (
      item.name?.en ??
      item.title?.en ??
      item.label?.en ??
      item.slug ??
      item.key ??
      String(item.year ?? item.id)
    );
  }

  private buildSaveRequest() {
    const value = this.form.getRawValue();
    const localizedName = { en: value.nameEn ?? '', ar: value.nameAr ?? '' };
    const localizedDescription = {
      en: value.descriptionEn ?? '',
      ar: value.descriptionAr ?? '',
    };
    const id = this.editing()?.id;

    switch (this.active()) {
      case 'categories': {
        const payload = {
          slug: value.slug ?? '',
          name: localizedName,
          description: localizedDescription,
          icon: value.icon ?? '',
          sortOrder: value.sortOrder ?? 0,
          isActive: Boolean(value.isActive),
        };
        return id ? this.categoriesApi.updateCategory(id, payload) : this.categoriesApi.createCategory(payload);
      }
      case 'regions': {
        const payload = {
          slug: value.slug ?? '',
          name: localizedName,
          description: localizedDescription,
          latitude: Number(value.latitude ?? 0),
          longitude: Number(value.longitude ?? 0),
          imageUrl: value.imageUrl ?? '',
          sortOrder: value.sortOrder ?? 0,
          isActive: Boolean(value.isActive),
        };
        return id ? this.regionsApi.updateRegion(id, payload) : this.regionsApi.createRegion(payload);
      }
      case 'milestones': {
        const payload = {
          year: value.year ?? new Date().getFullYear(),
          title: localizedName,
          description: localizedDescription,
          sortOrder: value.sortOrder ?? 0,
        };
        return id
          ? this.milestonesApi.updateMilestone(id, payload)
          : this.milestonesApi.createMilestone(payload);
      }
      case 'stats': {
        const payload = {
          key: value.slug ?? '',
          label: localizedName,
          value: value.value ?? '',
          unit: value.unit ?? '',
          icon: value.icon ?? '',
          sortOrder: value.sortOrder ?? 0,
        };
        return id ? this.statsApi.updateStat(id, payload) : this.statsApi.createStat(payload);
      }
      case 'pages': {
        return this.pagesApi.createPage({
          slug: value.slug ?? '',
          title: localizedName,
          body: localizedDescription,
        });
      }
    }
  }
}
