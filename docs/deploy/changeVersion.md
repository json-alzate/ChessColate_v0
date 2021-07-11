So, Capacitor is neat! The android and ios configs are actually committed to source control. To update version number, simply update the following files:

Android - android/app/build.gradle (you're looking for the versionName variable)
iOS - ios/App/App/Info.plist *(you're looking for the CFBundleShortVersionString key)