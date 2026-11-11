// File: scripts/patch-android-webview.cjs
const fs = require('fs');
const path = require('path');

const mainActivityJavaPath = path.join(
  __dirname,
  '..',
  'android',
  'app',
  'src',
  'main',
  'java',
  'com',
  'oneclick',
  'suite',
  'MainActivity.java'
);

const javaSource = `package com.oneclick.suite;

import android.app.DownloadManager;
import android.content.ContentValues;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        configureDownloadSupport();
    }

    private void configureDownloadSupport() {
        if (this.bridge == null || this.bridge.getWebView() == null) return;
        WebView webView = this.bridge.getWebView();
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setTextZoom(100);

        final AndroidDownloadBridge downloadBridge = new AndroidDownloadBridge(this);
        webView.addJavascriptInterface(downloadBridge, "AndroidDownloader");

        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            try {
                if (url != null && url.startsWith("data:")) {
                    String fileName = URLUtil.guessFileName(url, contentDisposition, mimeType);
                    int idx = url.indexOf("base64,");
                    if (idx != -1) {
                        String b64 = url.substring(idx + 7);
                        downloadBridge.saveBase64File(b64, fileName, mimeType != null ? mimeType : "application/octet-stream");
                    }
                } else if (url != null && (url.startsWith("http://") || url.startsWith("https://"))) {
                    String fileName = URLUtil.guessFileName(url, contentDisposition, mimeType);
                    DownloadManager.Request req = new DownloadManager.Request(Uri.parse(url));
                    req.setMimeType(mimeType);
                    req.addRequestHeader("User-Agent", userAgent);
                    req.setTitle(fileName);
                    req.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                    req.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
                    DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                    if (dm != null) dm.enqueue(req);
                    Toast.makeText(getApplicationContext(), "Downloading " + fileName + "...", Toast.LENGTH_SHORT).show();
                }
            } catch (Exception e) {
                Toast.makeText(getApplicationContext(), "Download error: " + e.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    public static class AndroidDownloadBridge {
        private final Context context;

        public AndroidDownloadBridge(Context context) {
            this.context = context;
        }

        @JavascriptInterface
        public boolean saveBase64File(String base64Data, String fileName, String mimeType) {
            try {
                String clean = base64Data.contains(",") ? base64Data.substring(base64Data.indexOf(",") + 1) : base64Data;
                byte[] bytes = Base64.decode(clean, Base64.DEFAULT);
                final String safeName = (fileName == null || fileName.trim().isEmpty()) ? "oneclick-output.pdf" : fileName.trim();
                String safeMime = (mimeType == null || mimeType.trim().isEmpty()) ? "application/octet-stream" : mimeType.trim();

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.Downloads.DISPLAY_NAME, safeName);
                    values.put(MediaStore.Downloads.MIME_TYPE, safeMime);
                    values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                    values.put(MediaStore.Downloads.IS_PENDING, 1);

                    Uri uri = context.getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (uri == null) throw new IllegalStateException("Cannot create file in Downloads");
                    try (OutputStream out = context.getContentResolver().openOutputStream(uri)) {
                        if (out != null) {
                            out.write(bytes);
                            out.flush();
                        }
                    }
                    values.clear();
                    values.put(MediaStore.Downloads.IS_PENDING, 0);
                    context.getContentResolver().update(uri, values, null, null);
                } else {
                    File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                    if (!dir.exists()) dir.mkdirs();
                    File outFile = new File(dir, safeName);
                    try (FileOutputStream out = new FileOutputStream(outFile)) {
                        out.write(bytes);
                        out.flush();
                    }
                }

                new Handler(Looper.getMainLooper()).post(() ->
                    Toast.makeText(context.getApplicationContext(), "Saved to Downloads: " + safeName, Toast.LENGTH_LONG).show()
                );
                return true;
            } catch (Exception e) {
                new Handler(Looper.getMainLooper()).post(() ->
                    Toast.makeText(context.getApplicationContext(), "Save error: " + e.getMessage(), Toast.LENGTH_LONG).show()
                );
                return false;
            }
        }
    }
}
`;

fs.mkdirSync(path.dirname(mainActivityJavaPath), { recursive: true });
fs.writeFileSync(mainActivityJavaPath, javaSource, 'utf8');
console.log('Patched Android MainActivity.java with native download support.');

// Apply Option 1 (Folded Emerald & Amber Book PDF) Android Launcher Icon
const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const fgPngSrc = path.join(__dirname, 'oc-android-fg.png');
const fullPngSrc = path.join(__dirname, '..', 'public', 'icons', 'icon-192.png');

if (fs.existsSync(fgPngSrc) && fs.existsSync(fullPngSrc)) {
  const drawableDir = path.join(resDir, 'drawable');
  const drawableNodpiDir = path.join(resDir, 'drawable-nodpi');
  const mipmapV26Dir = path.join(resDir, 'mipmap-anydpi-v26');

  fs.mkdirSync(drawableDir, { recursive: true });
  fs.mkdirSync(drawableNodpiDir, { recursive: true });
  fs.mkdirSync(mipmapV26Dir, { recursive: true });

  const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <gradient android:type="linear" android:angle="315" android:startColor="#065f46" android:endColor="#022c22" />
</shape>
`;
  fs.writeFileSync(path.join(drawableDir, 'oc_ic_launcher_bg.xml'), bgXml, 'utf8');
  fs.copyFileSync(fgPngSrc, path.join(drawableNodpiDir, 'oc_ic_launcher_fg.png'));

  const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/oc_ic_launcher_bg"/>
    <foreground android:drawable="@drawable/oc_ic_launcher_fg"/>
</adaptive-icon>
`;
  fs.writeFileSync(path.join(mipmapV26Dir, 'ic_launcher.xml'), adaptiveXml, 'utf8');
  fs.writeFileSync(path.join(mipmapV26Dir, 'ic_launcher_round.xml'), adaptiveXml, 'utf8');

  if (fs.existsSync(resDir)) {
    for (const entry of fs.readdirSync(resDir, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith('mipmap-') && entry.name !== 'mipmap-anydpi-v26') {
        const mDir = path.join(resDir, entry.name);
        for (const legacyName of ['ic_launcher.png', 'ic_launcher_round.png']) {
          const target = path.join(mDir, legacyName);
          if (fs.existsSync(target)) fs.copyFileSync(fullPngSrc, target);
        }
        const fgTarget = path.join(mDir, 'ic_launcher_foreground.png');
        if (fs.existsSync(fgTarget)) fs.copyFileSync(fgPngSrc, fgTarget);
      }
    }
  }
  console.log('Applied OneClick Option 1 launcher icon resources to Android res/.');
}

