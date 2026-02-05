# main Tool App

Aplikasi mobile berbasis Expo/React Native dengan monorepo structure menggunakan Bun sebagai package manager.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstal:

- [Bun](https://bun.sh) v1.3.0 atau lebih baru
- [Node.js](https://nodejs.org) v18 atau lebih baru
- [Android Studio](https://developer.android.com/studio) (untuk pengembangan Android)
- [Xcode](https://developer.apple.com/xcode/) (untuk pengembangan iOS - hanya di macOS)

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd main-tool-app
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment untuk Development Build

Ikuti panduan lengkap dari Expo untuk menyiapkan environment development:
👉 [Expo Development Environment Setup](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build)

#### Untuk Android:

**Opsi A: Menggunakan EAS Build (Recommended)**

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login ke Expo account:
```bash
eas login
```

3. Configure project:
```bash
cd apps/main-app
eas build:configure
```

4. Create development build:
```bash
eas build --platform android --profile development
```

**Opsi B: Local Build**

1. Setup Android Studio dan Android SDK
2. Configure environment variables (ANDROID_HOME)
3. Build locally:
```bash
cd apps/main-app
bunx expo run:android
```

#### Untuk iOS (macOS only):

1. Install Xcode dari App Store
2. Install CocoaPods:
```bash
sudo gem install cocoapods
```

3. Build untuk iOS:
```bash
cd apps/main-app
bunx expo run:ios
```

## 💻 Development

### Menjalankan Development Server

```bash
cd apps/main-app
bunx expo start
```

Atau jalankan dari root project:

```bash
bun run index.ts
```

### Menjalankan di Platform Tertentu

**Android:**
```bash
cd apps/main-app
bunx expo run:android
```

**iOS:**
```bash
cd apps/main-app
bunx expo run:ios
```

## 🔧 Troubleshooting

### Masalah Cache atau Build Error

Jika Anda mengalami error atau masalah build yang tidak jelas, coba clear cache:

```bash
cd apps/main-app
bunx expo start --clear
```

### Error: "Metro bundler not starting"

1. Clear metro cache:
```bash
bunx expo start --clear
```

2. Clear watchman cache (jika terinstall):
```bash
watchman watch-del-all
```

3. Clear node modules dan reinstall:
```bash
rm -rf node_modules
bun install
```

### Android Build Errors

1. Clean Android build:
```bash
cd apps/main-app/android
./gradlew clean
```

2. Rebuild:
```bash
cd apps/main-app
bunx expo run:android
```

### Port Already in Use

Jika port 8081 sudah digunakan:

```bash
bunx expo start --port 8082
```

Atau matikan proses yang menggunakan port:
```bash
lsof -ti:8081 | xargs kill
```

## 📁 Struktur Project

```
main-tool-app/
├── apps/
│   └── main-app/          # Main Expo application
│       ├── src/
│       │   ├── app/         # App screens (Expo Router)
│       │   ├── components/  # React components
│       │   └── lib/         # Utilities
│       └── android/         # Android native code
├── packages/
│   ├── api/                 # API client package
│   ├── feature/             # Feature modules
│   └── ui/                  # Shared UI components
└── tooling/
    ├── eslint-config/       # ESLint configurations
    └── typescript-config/   # TypeScript configurations
```

## 📚 Resource Tambahan

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Bun Documentation](https://bun.sh/docs)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

[Specify your license here]
