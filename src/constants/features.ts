type Feature = {
  name: string;
  free: boolean;
  premium: boolean;
};

export const FEATURES: Feature[] = [
  { name: "Feature 1", free: true, premium: true },
  { name: "Feature 2", free: false, premium: true },
  { name: "Feature 3", free: false, premium: true },
  { name: "Feature 4", free: true, premium: true },
];
