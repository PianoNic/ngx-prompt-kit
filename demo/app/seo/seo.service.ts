import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SITE, metaForUrl } from './seo-data';

/**
 * Listens to router navigation and rewrites the document <head> for the
 * active route — title, description, Open Graph, Twitter cards, canonical.
 * Pulls all values from the shared metaForUrl() map so the sitemap and the
 * runtime <head> can never drift.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  /** Wire up router events and apply tags for the initial URL. */
  public init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.applyForUrl(e.urlAfterRedirects));
    this.applyForUrl(this.router.url || '/');
  }

  private applyForUrl(url: string): void {
    const m = metaForUrl(url);
    const fullUrl = SITE.baseUrl + m.path;
    const ogImageUrl = SITE.baseUrl + (m.ogImage ?? SITE.defaultOgImage);

    this.title.setTitle(m.title);

    this.upsert({ name: 'description', content: m.description });

    // Open Graph
    this.upsert({ property: 'og:title', content: m.title });
    this.upsert({ property: 'og:description', content: m.description });
    this.upsert({ property: 'og:url', content: fullUrl });
    this.upsert({ property: 'og:type', content: 'website' });
    this.upsert({ property: 'og:site_name', content: SITE.name });
    this.upsert({ property: 'og:image', content: ogImageUrl });

    // Twitter
    this.upsert({ name: 'twitter:card', content: 'summary_large_image' });
    this.upsert({ name: 'twitter:site', content: SITE.twitterHandle });
    this.upsert({ name: 'twitter:title', content: m.title });
    this.upsert({ name: 'twitter:description', content: m.description });
    this.upsert({ name: 'twitter:image', content: ogImageUrl });

    this.setCanonical(fullUrl);
  }

  /**
   * Update by `name` attribute when present, otherwise fall back to
   * `property` — Meta.updateTag's auto-selector logic only matches the
   * first attribute key, so we route by which one is set.
   */
  private upsert(tag: { name?: string; property?: string; content: string }): void {
    if (tag.name) {
      this.meta.updateTag({ name: tag.name, content: tag.content });
    } else if (tag.property) {
      this.meta.updateTag({ property: tag.property, content: tag.content });
    }
  }

  private setCanonical(href: string): void {
    let link = this.doc.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link') as HTMLLinkElement;
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
