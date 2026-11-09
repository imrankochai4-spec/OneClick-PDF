// File: capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.emerald.pdftoolkit',
  appName: 'Emerald PDF Toolkit',
  webDir: 'public',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
    cleartext: false
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#064e3b',
      overlaysWebView: false
    },
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#064e3b',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#064e3b',
    buildOptions: {
      keystorePath: undefined,
      releaseType: 'AAB'
    }
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: true,
    backgroundColor: '#064e3b',
    preferredContentMode: 'mobile'
  }
};

export default config;
