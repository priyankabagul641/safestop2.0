/**
 * @format
 */

import {Alert, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  setJSExceptionHandler,
  getJSExceptionHandler,
} from 'react-native-exception-handler';
import {registerGlobals} from 'react-native-webrtc';
import RNCallKeep from 'react-native-callkeep';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
registerGlobals();

export const callKeepOptions = {
  ios: {
    appName: 'Safestop',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
    // additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: 'com.safestop',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    },
  },
};
// RNCallKeep.setup(callKeepOptions);
RNCallKeep.setAvailable(true);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  console.log('remoteMessage~~~~', remoteMessage);
  let data;
  if (remoteMessage.data) {
    data = remoteMessage.data;
  }
  let payload = JSON.parse(data.customData);
  console.log('Message handled', payload);
  let uuid = payload.calleeId;

  if (payload.notificationType === 'START_CALL') {
    await AsyncStorage.setItem('call_data', JSON.stringify(payload));
    console.log('backToForeground handled', payload);
    RNCallKeep.backToForeground();
    RNCallKeep.displayIncomingCall(
      uuid,
      payload.name,
      payload.name +
        ` (${payload.callType === 'VIDEO_CALL' ? 'Video' : 'Audio'} Call)`,
      'generic',
      true,
      {},
    );
  } else if (payload.notificationType === 'END_CALL') {
    RNCallKeep.endAllCalls();
    await AsyncStorage.removeItem('call_data');
  }
});

const exceptionhandler = (e, isFatal) => {
  //   Alert.alert('error', error.name, error.message);
  Alert.alert(
    'Unexpected error occurred',
    `
    Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}
    We will need to restart the app.
    `,
    [
      {
        text: 'Restart',
        onPress: () => {
          // RNRestart.Restart();s
        },
      },
    ],
  );
  //your error handler function
};
setJSExceptionHandler(exceptionhandler, true);

// function HeadlessCheck({isHeadless}) {
//   if (isHeadless) {
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }

//   return <App />;
// }

// AppRegistry.registerComponent(appName, () => HeadlessCheck);

AppRegistry.registerComponent(appName, () => App);
