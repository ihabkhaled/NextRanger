import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import type { ReactElement } from 'react';

export interface AppImageProps extends Omit<NextImageProps, 'alt'> {
  /** Alt text is mandatory; pass an empty string only for purely decorative images. */
  readonly alt: string;
}

/** Optimized image rendering. Remote hosts must be allowlisted in next.config.ts. */
export function AppImage(props: Readonly<AppImageProps>): ReactElement {
  return <NextImage {...props} />;
}
