export abstract class BaseSubscription {
  abstract handler(obj: any): void;
}
