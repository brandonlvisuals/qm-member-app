import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'se.qualitymovement.app',
  appName: 'Quality Movement',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
