import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminArticle } from '../../../core/models/article.model';
import { AdminArticleCategory } from '../../../core/models/article-category.model';
import { ArticleCategoriesApiService } from '../../../core/services/article-categories-api.service';
import { ArticlesApiService } from '../../../core/services/articles-api.service';

@Component({
  selector: 'app-admin-articles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Articles</span>
          <h2>Blog Articles and Categories</h2>
        </div>
      </div>

      <div class="layout">
        <div class="panel">
          <h3>{{ editingArticle() ? 'Edit Article' : 'Create Article' }}</h3>
          <form [formGroup]="articleForm" (ngSubmit)="saveArticle()">
            <div class="grid">
              <input formControlName="slug" placeholder="slug" />
              <input formControlName="coverImageUrl" placeholder="cover image url" />
              <input formControlName="titleEn" placeholder="title EN" />
              <input formControlName="titleAr" placeholder="title AR" />
              <select formControlName="categoryId">
                <option [ngValue]="null">Category</option>
                <option *ngFor="let category of categories()" [ngValue]="category.id">
                  {{ category.name['en'] || category.slug }}
                </option>
              </select>
              <input formControlName="publishedAt" type="datetime-local" />
            </div>
            <textarea formControlName="excerptEn" rows="2" placeholder="excerpt EN"></textarea>
            <textarea formControlName="excerptAr" rows="2" placeholder="excerpt AR"></textarea>
            <textarea formControlName="bodyEn" rows="5" placeholder="body EN"></textarea>
            <textarea formControlName="bodyAr" rows="5" placeholder="body AR"></textarea>
            <label class="check"><input type="checkbox" formControlName="isPublished" /> Published</label>
            <div class="actions">
              <button type="submit" [disabled]="articleForm.invalid">Save article</button>
              <button type="button" class="ghost" (click)="resetArticle()">Clear</button>
            </div>
          </form>
        </div>

        <div class="panel">
          <h3>Categories</h3>
          <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()" class="category-form">
            <input formControlName="slug" placeholder="slug" />
            <input formControlName="nameEn" placeholder="name EN" />
            <input formControlName="nameAr" placeholder="name AR" />
            <button type="submit" [disabled]="categoryForm.invalid">
              {{ editingCategory() ? 'Update category' : 'Add category' }}
            </button>
          </form>
          <div class="mini-list">
            <article *ngFor="let category of categories()">
              <span>{{ category.name['en'] || category.slug }}</span>
              <div>
                <button type="button" (click)="editCategory(category)">Edit</button>
                <button type="button" class="danger" (click)="deleteCategory(category.id)">Delete</button>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div class="table panel">
        <article class="row" *ngFor="let article of articles()">
          <div>
            <strong>{{ article.title['en'] || article.slug }}</strong>
            <small>{{ article.slug }} · {{ article.categorySlug }} · {{ article.isPublished ? 'Published' : 'Draft' }}</small>
          </div>
          <div class="row-actions">
            <button type="button" (click)="editArticle(article)">Edit</button>
            <button type="button" class="danger" (click)="deleteArticle(article.id)">Delete</button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page,
      form,
      .panel,
      .mini-list {
        display: grid;
        gap: 14px;
      }

      .page-head,
      .row,
      .mini-list article {
        display: flex;
        justify-content: space-between;
        gap: 14px;
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
        display: block;
      }

      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.8fr);
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

      input,
      select,
      textarea {
        width: 100%;
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        color: var(--text-primary);
        border-radius: 6px;
        padding: 11px 12px;
        font: inherit;
      }

      button {
        border: 0;
        border-radius: 6px;
        padding: 10px 13px;
        background: var(--color-primary);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
      }

      .ghost {
        background: var(--border-color);
        color: var(--text-primary);
      }

      .danger {
        background: #d32f2f;
      }

      .actions,
      .row-actions,
      .mini-list article div {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .check {
        color: var(--text-primary);
      }

      .row {
        border-top: 1px solid var(--border-color);
        padding: 12px 0;
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
export class AdminArticlesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly articlesApi = inject(ArticlesApiService);
  private readonly categoriesApi = inject(ArticleCategoriesApiService);

  readonly articles = signal<AdminArticle[]>([]);
  readonly categories = signal<AdminArticleCategory[]>([]);
  readonly editingArticle = signal<AdminArticle | null>(null);
  readonly editingCategory = signal<AdminArticleCategory | null>(null);

  readonly articleForm = this.fb.group({
    slug: ['', Validators.required],
    titleEn: ['', Validators.required],
    titleAr: [''],
    excerptEn: [''],
    excerptAr: [''],
    bodyEn: ['', Validators.required],
    bodyAr: [''],
    coverImageUrl: [''],
    categoryId: [null as number | null, Validators.required],
    publishedAt: [''],
    isPublished: [true],
  });

  readonly categoryForm = this.fb.group({
    slug: ['', Validators.required],
    nameEn: ['', Validators.required],
    nameAr: [''],
  });

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.articlesApi.getAdminArticles({ page: 1, pageSize: 100 }).subscribe({
      next: (response) => this.articles.set(response.items ?? []),
      error: (error) => console.error('Failed to load admin articles', error),
    });
    this.categoriesApi.getAdminCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => console.error('Failed to load article categories', error),
    });
  }

  saveArticle(): void {
    if (this.articleForm.invalid) {
      return;
    }

    const value = this.articleForm.getRawValue();
    const payload = {
      slug: value.slug ?? '',
      title: { en: value.titleEn ?? '', ar: value.titleAr ?? '' },
      excerpt: { en: value.excerptEn ?? '', ar: value.excerptAr ?? '' },
      body: { en: value.bodyEn ?? '', ar: value.bodyAr ?? '' },
      coverImageUrl: value.coverImageUrl ?? '',
      categoryId: value.categoryId ?? 0,
      publishedAt: value.publishedAt ? new Date(value.publishedAt).toISOString() : new Date().toISOString(),
      isPublished: Boolean(value.isPublished),
    };

    const request = this.editingArticle()
      ? this.articlesApi.updateArticle(this.editingArticle()!.id, payload)
      : this.articlesApi.createArticle(payload);

    request.subscribe({
      next: () => {
        this.resetArticle();
        this.loadAll();
      },
      error: (error) => console.error('Failed to save article', error),
    });
  }

  editArticle(article: AdminArticle): void {
    this.editingArticle.set(article);
    this.articleForm.patchValue({
      slug: article.slug,
      titleEn: article.title?.['en'] ?? '',
      titleAr: article.title?.['ar'] ?? '',
      excerptEn: article.excerpt?.['en'] ?? '',
      excerptAr: article.excerpt?.['ar'] ?? '',
      bodyEn: article.body?.['en'] ?? '',
      bodyAr: article.body?.['ar'] ?? '',
      coverImageUrl: article.coverImageUrl,
      categoryId: article.categoryId,
      publishedAt: article.publishedAt ? article.publishedAt.slice(0, 16) : '',
      isPublished: article.isPublished,
    });
  }

  resetArticle(): void {
    this.editingArticle.set(null);
    this.articleForm.reset({ isPublished: true });
  }

  deleteArticle(id: number): void {
    if (!confirm('Delete this article?')) {
      return;
    }
    this.articlesApi.deleteArticle(id).subscribe({
      next: () => this.loadAll(),
      error: (error) => console.error('Failed to delete article', error),
    });
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const value = this.categoryForm.getRawValue();
    const payload = {
      slug: value.slug ?? '',
      name: { en: value.nameEn ?? '', ar: value.nameAr ?? '' },
    };
    const request = this.editingCategory()
      ? this.categoriesApi.updateCategory(this.editingCategory()!.id, payload)
      : this.categoriesApi.createCategory(payload);

    request.subscribe({
      next: () => {
        this.editingCategory.set(null);
        this.categoryForm.reset();
        this.loadAll();
      },
      error: (error) => console.error('Failed to save article category', error),
    });
  }

  editCategory(category: AdminArticleCategory): void {
    this.editingCategory.set(category);
    this.categoryForm.patchValue({
      slug: category.slug,
      nameEn: category.name?.['en'] ?? '',
      nameAr: category.name?.['ar'] ?? '',
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this article category?')) {
      return;
    }
    this.categoriesApi.deleteCategory(id).subscribe({
      next: () => this.loadAll(),
      error: (error) => console.error('Failed to delete article category', error),
    });
  }
}
