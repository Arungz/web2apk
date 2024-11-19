const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const app = express();

const upload = multer({ dest: 'uploads/' });

app.post('/generate-apk', upload.single('custom-logo'), (req, res) => {
  const { websiteUrl, appName, appDescription } = req.body;
  const logoPath = req.file?.path;

  // Command to build APK (e.g., Cordova/Capacitor)
  const buildCommand = `
    cordova create myApp com.example.${appName} "${appName}" &&
    cd myApp &&
    cordova platform add android &&
    cordova plugin add cordova-plugin-inappbrowser &&
    cordova build android --release
  `;

  exec(buildCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send('Error generating APK.');
    } else {
      res.sendFile('myApp/platforms/android/app/build/outputs/apk/release/app-release.apk');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
