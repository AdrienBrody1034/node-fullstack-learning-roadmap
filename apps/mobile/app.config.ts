import type { ExpoConfig } from 'expo/config';

const webUrl = process.env.EXPO_PUBLIC_WEB_URL?.trim();
const isReleaseBuild = process.env.EAS_BUILD_PROFILE === 'production';
const androidDevNetworkConfig = isReleaseBuild ? {} : { usesCleartextTraffic: true };

if (isReleaseBuild && webUrl && !webUrl.startsWith('https://')) {
  throw new Error('Production builds must load the website over HTTPS.');
}

if (isReleaseBuild && !webUrl) {
  throw new Error(
    'EXPO_PUBLIC_WEB_URL is required for production builds. Set it to the deployed HTTPS website URL before building.',
  );
}

const config: ExpoConfig = {
  name: 'Node 全栈学习计划',
  slug: 'node-fullstack-roadmap',
  scheme: 'node-roadmap',
  version: '1.0.0',
  orientation: 'default',
  userInterfaceStyle: 'light',
  ios: {
    bundleIdentifier: 'dev.noderoadmap.app',
    supportsTablet: true,
    infoPlist: {
      NSLocalNetworkUsageDescription:
        'Local network access is used to preview the learning website during development.',
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
      },
    },
  },
  android: {
    package: 'dev.noderoadmap.app',
    ...androidDevNetworkConfig,
  },
  extra: {
    configuredWebUrl: webUrl ?? null,
  },
};

export default config;
