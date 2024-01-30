'use server';

import { cookies } from 'next/headers';
import { Locale, defaultLocale } from '@/i18n/config';
import { headers } from 'next/headers';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  const headersList = await headers();
  const userAgent = headersList.get('accept-language');

  return (
    (await cookies()).get(COOKIE_NAME)?.value || userAgent || defaultLocale
  );
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
