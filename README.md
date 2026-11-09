
node_modules/
dist/
.DS_Store
*.log

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

{
  "name": "emerald-pdf-toolkit",
  "version": "1.0.0",
  "description": "100% Client-Side Ultra-Fast PDF Toolkit (PWA, Android, iOS)",
  "private": true,
  "scripts": {
    "start": "npx serve public -l 3000",
    "cap:sync": "npx cap sync",
    "cap:android": "npx cap open android",
    "cap:ios": "npx cap open ios"
  },
  "dependencies": {
    "@capacitor/android": "^6.1.2",
    "@capacitor/app": "^6.0.1",
    "@capacitor/core": "^6.1.2",
    "@capacitor/filesystem": "^6.0.1",
    "@capacitor/haptics": "^6.0.1",
    "@capacitor/ios": "^6.1.2",
    "@capacitor/share": "^6.0.1",
    "@capacitor/status-bar": "^6.0.1",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "^3.11.174"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.1.2",
    "serve": "^14.2.3",
    "typescript": "^5.5.4"
  }
}
