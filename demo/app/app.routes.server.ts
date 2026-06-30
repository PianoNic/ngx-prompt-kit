import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Every route is statically prerendered at build time. All routes in
 * app.routes.ts are static (no path params), so RenderMode.Prerender on
 * the wildcard discovers them via the Router config and emits one HTML
 * file per route under dist/demo/browser/.
 */
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Prerender }];
