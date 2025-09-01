export interface Feature {
  id: string;
  title: string;
  mount?: () => void;
  unmount?: () => void;
  getUi?: () => unknown;
}

export class FeatureRegistry {
  private features = new Map<string, Feature>();

  register(feature: Feature) {
    this.features.set(feature.id, feature);
    feature.mount?.();
  }

  unregister(id: string) {
    const f = this.features.get(id);
    f?.unmount?.();
    this.features.delete(id);
  }

  list() {
    return Array.from(this.features.values());
  }
}
