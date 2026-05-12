# Daily System

## 1. PROJECT OVERVIEW
Daily System is a React Native app that combines Workout and Cooking flows with a session-based timer system. Users start a session, progress through steps/sets, and rely on timestamp-based countdowns for rest and cooking steps.

## 2. TECH STACK
- React Native via **Expo** (managed workflow)
- State management: **Zustand**
- Android build system: **EAS Build** (cloud builds) and **Gradle** (via `expo prebuild`)

## 3. PREREQUISITES
- **Node.js LTS**
- **npm** or **yarn**
- **Android Studio** + Android SDK (for local Gradle builds)
- **Java JDK 17** (required by modern Android toolchains)
- **Expo Go** app (for running on a real device during development)
- **EAS CLI** (for production builds)

## 4. INSTALLATION STEPS
```bash
git clone https://github.com/baonv-vn/test.git
cd test
npm install
```

Environment setup (no required env file by default):
```bash
touch .env
```

## 5. RUN APP (DEVELOPMENT)
Start the Metro bundler:
```bash
npx expo start
```

Run directly on Android (device or emulator):
```bash
npx expo start --android
```

## 6. ANDROID BUILD GUIDE (CRITICAL SECTION)

### A) DEBUG APK (quick install)
**Local Gradle debug build (generates an APK):**
```bash
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

**APK output path:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Install on device:**
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### B) RELEASE APK / AAB (production)
**Recommended (Expo EAS Build – generates AAB for Play Store):**
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile production
```

**Local Gradle release build (requires signing):**
```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
./gradlew bundleRelease
```

**Release output paths:**
```
android/app/build/outputs/apk/release/app-release.apk
android/app/build/outputs/bundle/release/app-release.aab
```

**Signing note:** For local release builds you must provide a keystore and configure `android/gradle.properties` and `android/app/build.gradle`. EAS Build can manage signing automatically.

Example keystore generation (PKCS12):
```bash
keytool -genkeypair -v -storetype PKCS12 -keyalg RSA -keysize 2048 -validity 10000 \
  -keystore my-release-key.p12 -alias my-key-alias
```

Example `android/gradle.properties` entries:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.p12
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

## 7. INSTALL APK ON DEVICE
ADB install (recommended):
```bash
adb install -r /absolute/path/to/app-release.apk
```

Manual install:
1. Copy the APK to your device (USB or cloud drive).
2. On the device, open the APK file.
3. Allow “Install unknown apps” when prompted.

## 8. TROUBLESHOOTING
- **Gradle build failure**: run `cd android && ./gradlew clean` and ensure JDK 17 + Android SDK are installed.
- **Metro bundler cache issues**: run `npx expo start -c`.
- **Android SDK path issues**: ensure `ANDROID_HOME` or `ANDROID_SDK_ROOT` is set and `platform-tools` is on your PATH.
- **Hermes / JS engine issues**: clear Metro cache and rebuild; if needed, disable Hermes in `app.json` and re-run `expo prebuild`.

## 9. PROJECT ARCHITECTURE SUMMARY
- **Session-based system**: both Workout and Cooking flows create a session ID and persist session snapshots for resume.
- **Timer system (timestamp-based)**: timers store `startedAt` and `endsAt` timestamps and render countdowns from the remaining time.
- **Cooking vs Workout flow**: Cooking progresses through recipe steps with optional timed durations; Workout progresses through exercises/sets with rest timers between sets.

## 10. FINAL OUTPUT
**This project is ready to be built into Android APK/AAB**
