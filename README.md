# React Native Notification Reader

## Build a direct-install APK with Expo EAS
1. Install Node.js LTS and npm.
2. Extract this ZIP and open a terminal in the project folder.
3. Run:
   `npm install`
   `npx eas login`
   `npx eas build:configure`
   `npx eas build --platform android --profile preview`
4. Accept the prompt to create an Expo project. When the cloud build finishes, download the APK from the build page.

You need an Expo account for EAS cloud builds. The APK build itself runs in the cloud; you do not need Android Studio.

## App behavior
- Native Android Notification Listener Service captures notification title/body previews from WhatsApp and Instagram.
- Stores up to 200 records in private app SharedPreferences on the phone.
- Search, refresh and clear history are provided in the React Native interface.
- The app does not add an INTERNET permission or upload notification content.
- Android requires the phone owner to enable Notification Access manually.
- It cannot read hidden chats or message content that is not included in a notification. Use only with the device owner's informed consent.

Note: Expo/RN native templates can change. If EAS reports a native package-registration build error, share the build log so the plugin can be adjusted to that template version.
