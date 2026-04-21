import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Milestone } from '../../core/models/milestone.model';
import { PublicStat } from '../../core/models/stat.model';
import { Region } from '../../core/models/region.model';
import { MilestonesApiService } from '../../core/services/milestones-api.service';
import { RegionsApiService } from '../../core/services/regions-api.service';
import { StatsApiService } from '../../core/services/stats-api.service';

@Component({
  selector: 'app-public-data-sections',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="data-band" id="insights">
      <div class="inner">
        <div class="stats-grid" *ngIf="stats().length">
          <article class="stat" *ngFor="let stat of stats()">
            <span>{{ stat.icon || stat.key }}</span>
            <strong>{{ stat.value }}{{ stat.unit }}</strong>
            <small>{{ stat.label }}</small>
          </article>
        </div>

        <div class="split-grid">
          <div>
            <span class="eyebrow">Growing Regions</span>
            <h2>Verified sourcing regions</h2>
            <div class="region-list">
              <article class="row-card" *ngFor="let region of regions()">
                <img *ngIf="region.imageUrl" [src]="region.imageUrl" [alt]="region.name" />
                <div>
                  <strong>{{ region.name }}</strong>
                  <p>{{ region.description }}</p>
                </div>
              </article>
            </div>
          </div>

          <div>
            <span class="eyebrow">Company Milestones</span>
            <h2>Export timeline</h2>
            <div class="timeline">
              <article class="milestone" *ngFor="let milestone of milestones()">
                <strong>{{ milestone.year }}</strong>
                <div>
                  <h3>{{ milestone.title }}</h3>
                  <p>{{ milestone.description }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .data-band {
        padding: clamp(60px, 8vw, 110px) 20px;
        background: var(--bg-secondary);
      }

      .inner {
        width: min(1180px, 100%);
        margin: 0 auto;
        display: grid;
        gap: 34px;
      }

      .stats-grid,
      .split-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      .split-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px;
      }

      .stat,
      .row-card,
      .milestone {
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        border-radius: 8px;
      }

      .stat {
        padding: 18px;
        display: grid;
        gap: 8px;
      }

      .stat span,
      .eyebrow {
        color: var(--color-primary);
        font-weight: 800;
        text-transform: uppercase;
        font-size: 0.78rem;
      }

      .stat strong {
        font-size: 1.8rem;
        color: var(--text-primary);
      }

      .stat small,
      p {
        color: var(--text-secondary);
      }

      h2,
      h3,
      p {
        margin: 0;
      }

      h2 {
        margin: 8px 0 18px;
        color: var(--text-primary);
      }

      .region-list,
      .timeline {
        display: grid;
        gap: 12px;
      }

      .row-card {
        display: grid;
        grid-template-columns: 88px 1fr;
        gap: 14px;
        padding: 12px;
      }

      .row-card img {
        width: 88px;
        height: 72px;
        object-fit: cover;
        border-radius: 6px;
      }

      .row-card strong,
      .milestone strong,
      .milestone h3 {
        color: var(--text-primary);
      }

      .milestone {
        display: grid;
        grid-template-columns: 92px 1fr;
        gap: 14px;
        padding: 16px;
      }

      @media (max-width: 900px) {
        .stats-grid,
        .split-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class PublicDataSectionsComponent implements OnInit {
  private readonly statsApi = inject(StatsApiService);
  private readonly regionsApi = inject(RegionsApiService);
  private readonly milestonesApi = inject(MilestonesApiService);

  readonly stats = signal<PublicStat[]>([]);
  readonly regions = signal<Region[]>([]);
  readonly milestones = signal<Milestone[]>([]);

  ngOnInit(): void {
    forkJoin({
      stats: this.statsApi.getPublicStats(),
      regions: this.regionsApi.getPublicRegions(),
      milestones: this.milestonesApi.getPublicMilestones(),
    }).subscribe({
      next: ({ stats, regions, milestones }) => {
        this.stats.set(stats.sort((a, b) => a.sortOrder - b.sortOrder));
        this.regions.set(regions.sort((a, b) => a.sortOrder - b.sortOrder));
        this.milestones.set(milestones.sort((a, b) => a.sortOrder - b.sortOrder));
      },
      error: (error) => console.error('Failed to load public data sections', error),
    });
  }
}
