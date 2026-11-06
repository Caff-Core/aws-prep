import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getCertification } from '~/lib/certifications/registry';
import {
  allCertificationsLink,
  certificationIdFromPath,
  paginationFor,
  scopeSidebar,
} from '~/lib/navigation/sidebar';

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const id = certificationIdFromPath(context.url.pathname);
  const certification = id ? getCertification(id) : undefined;
  if (certification?.status !== 'available') return;

  const scoped = scopeSidebar(route.sidebar, certification);
  route.pagination = paginationFor(scoped);
  route.sidebar = [allCertificationsLink(), ...scoped];
});
