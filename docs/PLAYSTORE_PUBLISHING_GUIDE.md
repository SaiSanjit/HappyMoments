# 📱 Happy Moments - Android App & Google Play Store Publishing Guide

This guide details how your mobile Android version is configured, how to test it immediately, and how to publish it to the **Google Play Store**.

---

## 🎯 Architecture & Setup Summary

The mobile app has been built using **Capacitor** integrated directly into your existing Vite + React frontend (`frontend/`):
- **Single Codebase**: Every update you make to the website is synced to the mobile app.
- **Native Android Studio Project**: Located at [`frontend/android`](file:///Users/sivamarella/Desktop/HM_MAY/frontend/android).
- **Target SDK**: Android 14 / Android 15 (Target SDK 36), fully exceeding Google Play's modern API requirements.
- **Package Name / Application ID**: `com.happymoments.app`
- **Native Integrations Configured**:
  - Branded status bar (Brand orange `#f58200` with dark icons)
  - Smooth native splash screen with auto-hide
  - Hardware back button handling in React Router (prevents abrupt app closing)
  - Branded launcher icons across all screen densities (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`)
  - Camera, Audio (`SmartVoiceRequest`), and Storage permissions properly defined

---

## 📦 Generated Build Artifacts

Your builds have already been compiled and verified:

| File Type | Location | Purpose |
|---|---|---|
| **Debug APK** (Test on Phone) | [`frontend/android/app/build/outputs/apk/debug/app-debug.apk`](file:///Users/sivamarella/Desktop/HM_MAY/frontend/android/app/build/outputs/apk/debug/app-debug.apk) | Direct installation on your Android phone via USB/WhatsApp/Drive |
| **Release Bundle** (`.aab`) | [`frontend/android/app/build/outputs/bundle/release/app-release.aab`](file:///Users/sivamarella/Desktop/HM_MAY/frontend/android/app/build/outputs/bundle/release/app-release.aab) | **Google Play Console** submission file |

---

## 🚀 Everyday Mobile Commands

Run these inside `frontend/`:

```bash
# 1. Sync web changes to the Android app
npm run mobile:sync

# 2. Open project in Android Studio
npm run mobile:open

# 3. Build a fresh debug APK (for testing)
npm run mobile:build

# 4. Build a fresh Google Play release bundle (.aab)
npm run mobile:bundle
```

---

## 📲 How to Test the App on Your Phone Now

### Method A: Direct Transfer (Fastest)
1. Copy the file [`app-debug.apk`](file:///Users/sivamarella/Desktop/HM_MAY/frontend/android/app/build/outputs/apk/debug/app-debug.apk) to your Android phone (via Google Drive, USB transfer, or AirDrop/Bluetooth).
2. Tap the APK on your phone and select **Install** (allow "Install unknown apps" if prompted).
3. Open **Happy Moments** and test vendor listings, login, search, and voice features.

### Method B: Via ADB (USB Cable)
Connect your Android phone to your Mac via USB with Developer Options & USB Debugging enabled, then run:
```bash
/Users/sivamarella/Library/Android/sdk/platform-tools/adb install -r frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🛍️ Google Play Store Publishing Walkthrough

### Step 1: Create a Google Play Developer Account
1. Visit [Google Play Console](https://play.google.com/console/signup).
2. Sign in with your Google account.
3. Pay the one-time registration fee ($25 USD).
4. Complete identity verification.

---

### Step 2: Generate Your Production Signing Keystore
To publish to the Play Store, Android requires your release bundle to be digitally signed with a private key. Run this command once in your terminal:

```bash
keytool -genkey -v -keystore ~/happymoments-release.keystore -alias happymoments -keyalg RSA -keysize 2048 -validity 10000
```
> ⚠️ **IMPORTANT**: Store `happymoments-release.keystore` and your password in a safe backup (e.g. 1Password / Google Drive). If you lose this key, you cannot update your app on the Play Store.

---

### Step 3: Configure Release Signing in Gradle (Automated)
In [`frontend/android/app/build.gradle`](file:///Users/sivamarella/Desktop/HM_MAY/frontend/android/app/build.gradle), add your signing config under `android { ... }`:

```groovy
android {
    ...
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "/Users/sivamarella/happymoments-release.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: "your_password_here"
            keyAlias "happymoments"
            keyPassword System.getenv("KEY_PASSWORD") ?: "your_password_here"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```
*(Alternatively, you can let **Google Play App Signing** manage the key if you opt in during app creation in Google Play Console).*

---

### Step 4: Create the App on Google Play Console
1. In Google Play Console, click **Create app**.
2. **App name**: `Happy Moments`
3. **Default language**: `English (United States)` or `English (India)`
4. **App or game**: `App`
5. **Free or paid**: `Free`
6. Agree to the declarations and click **Create app**.

---

### Step 5: Complete the Store Listing Details
Under **Grow > Store presence > Main store listing**:
1. **Short description** (up to 80 chars):
   > *Premier decorators, photographers, venues & event services for celebrations.*
2. **Full description** (up to 4000 chars):
   > Explain Happy Moments features: vendor browsing, wedding planners, event spaces, photography, catering, instant quotations, and AI event matching.
3. **App icon**: 512 x 512 px PNG (use [`frontend/public/pwa-512x512.png`](file:///Users/sivamarella/Desktop/HM_MAY/frontend/public/pwa-512x512.png)).
4. **Feature graphic**: 1024 x 500 px JPG or PNG (banner representing Happy Moments).
5. **Phone screenshots**: At least 4 screenshots (take high-quality screenshots from your running app or Chrome responsive emulator: 1080x1920 or 1080x2400).

---

### Step 6: App Content & Policy Declarations
Under **Policy and programs > App content**:
- **Privacy Policy URL**: Provide your live URL (e.g. `https://happymomentsindia.com/privacy` or your hosted privacy policy).
- **Target audience**: 18 and over (or 13+ depending on user base).
- **Ads**: Check "No, my app does not contain ads".
- **App access**: If parts of the app require login, provide test credentials (e.g., test customer account).
- **Data safety**: Declare that user data (email, name) is transmitted securely via HTTPS and used for account management.

---

### Step 7: Upload the App Bundle & Launch
1. In Google Play Console, navigate to **Release > Testing > Closed testing** (or **Internal testing** first to test with colleagues).
2. Click **Create new release**.
3. Upload [`app-release.aab`](file:///Users/sivamarella/Desktop/HM_MAY/frontend/android/app/build/outputs/bundle/release/app-release.aab).
4. Enter Release notes (e.g., `Initial release of Happy Moments`).
5. Click **Next** > **Save** > **Review release** > **Start rollout**.

Once your testing track looks good, promote the release to **Production** for public download worldwide!
