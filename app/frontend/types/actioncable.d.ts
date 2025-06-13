declare module '@rails/actioncable' {
  // The actual Cable type lives in the ActionCable JS implementation.
  // We declare it as `any` to avoid TypeScript complaints without
  // requiring additional type packages.
  export type Cable = any;

  export function createConsumer(url?: string | undefined): Cable
} 