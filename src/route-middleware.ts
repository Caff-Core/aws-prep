import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getPracticeQuestions } from '~/lib/assessment/bank';
import { getCertification } from '~/lib/certifications/registry';
import {
  allCertificationsLink,
  certificationIdFromPath,
  paginationFor,
  practiceLink,
  scopeSidebar,
} from '~/lib/navigation/sidebar';

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const id = certificationIdFromPath(context.url.pathname);
  const certification = id ? getCertification(id) : undefined;
  if (certification?.status !== 'available') return;

  // Practice comes last, so the lesson flow leads into it through next links.
  const scoped = [
    ...scopeSidebar(route.sidebar, certification),
    ...(getPracticeQuestions(certification.id).length > 0
      ? [practiceLink(certification.id, context.url.pathname)]
      : []),
  ];
  route.pagination = paginationFor(scoped);
  route.sidebar = [allCertificationsLink(), ...scoped];
});
