declare module 'social-url' {
  export function parse(url: string): { network?: string } | null;
}