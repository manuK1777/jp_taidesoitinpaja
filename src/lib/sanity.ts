import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2026-07-11',
  useCdn: false, // false is correct for static builds — content is fetched once at build time anyway
});

const builder = imageUrlBuilder(sanityClient);

/**
 * Turns a Sanity image reference into a usable URL, with optional
 * transforms (width/height/etc via the Sanity CDN).
 *
 * Usage: urlFor(instrument.images[0]).width(800).url()
 */
export function urlFor(source: any) {
  return builder.image(source);
}
