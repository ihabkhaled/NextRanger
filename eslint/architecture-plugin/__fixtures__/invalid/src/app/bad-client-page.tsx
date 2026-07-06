'use client';

// FIXTURE: deliberate violations — missing client-boundary-reason (the comment
// above is not on the line directly after the directive in the tested code),
// server-only import in a client file, and an inline query key.
import { readFileSync } from 'node:fs';

import { serverEnv } from '@/packages/env/server';

export function badUseArticles(): { queryKey: string[] } {
  void readFileSync;
  void serverEnv;

  return { queryKey: ['articles', 'list'] };
}
