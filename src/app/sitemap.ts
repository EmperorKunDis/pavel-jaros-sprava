import { MetadataRoute } from 'next';
import { routing } from '../../i18n/routing';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pjsprava.cz';

  const localeEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    },
  ]);

  return [
    ...localeEntries,
  ];
}
