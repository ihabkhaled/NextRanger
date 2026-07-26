/**
 * Explicit process.env typing.
 *
 * Declaring the variables here keeps dot-access legal under
 * noPropertyAccessFromIndexSignature while Next.js can still statically
 * inline NEXT_PUBLIC_* references into the client bundle.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_APP_ENV?: string;
    readonly NEXT_PUBLIC_APP_URL?: string;
    readonly NEXT_PUBLIC_CONTACT_EMAIL?: string;
    readonly SERVER_API_BASE_URL?: string;
    readonly SERVER_API_MOCKING?: string;
  }
}
