// civilian ID :
// civilianuser01@gmail.com
// Test@1234
// civilianuser02@gmail.com
// Test@1234

// Officer :
// officeruser01@gmail.com
// Test@1234

import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StackNavigation from './screens/navigation/StackNavigation';
import SplashScreen from './screens/splashscreen/splashscreen';
import {LogBox, Text, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {callKeepOptions} from '.';
import {NetworkInfo} from 'react-native-network-info';


const Stack = createNativeStackNavigator();

const App = () => {
  LogBox.ignoreAllLogs();
  // React.useEffect(() => {
  //   // const unsubscribe = messaging().onMessage(async remoteMessage => {
  //   //   console.log('remoteMessage:', remoteMessage);
  //   //   // let data;
  //   //   // if (remoteMessage.data) {
  //   //   //   data = remoteMessage.data;
  //   //   // }
  //   //   // let payload = JSON.parse(data.customData);
  //   //   // console.log('Message handled', payload);
  //   //   // let uuid = payload.calleeId;
  //   //   // if (payload.notificationType === 'START_CALL') {
  //   //   //   await AsyncStorage.setItem('call_data', JSON.stringify(payload));
  //   //   //   RNCallKeep.backToForeground();
  //   //   //   RNCallKeep.displayIncomingCall(
  //   //   //     uuid,
  //   //   //     payload.name,
  //   //   //     payload.name +
  //   //   //       ` (${payload.callType === 'VIDEO_CALL' ? 'Video' : 'Audio'} Call)`,
  //   //   //     'generic',
  //   //   //     true,
  //   //   //     {},
  //   //   //   );
  //   //   // } else if (payload.notificationType === 'END_CALL') {
  //   //   //   RNCallKeep.endAllCalls();
  //   //   //   await AsyncStorage.removeItem('call_data');
  //   //   // }
  //   // });
  //   // // RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
  //   // return () => {
  //   //   unsubscribe();
  //   // };
  // }, []);

  // React.useEffect(() => {
  //   RNCallKeep.setup(callKeepOptions).then(res => {
  //     AsyncStorage.getItem('call_data').then(data => {
  //       if (data !== null) {
  //         let payload = JSON.parse(data);
  //         let uuid = payload.userId;
  //         RNCallKeep.displayIncomingCall(
  //           uuid,
  //           payload.name,
  //           payload.name +
  //             ` (${
  //               payload.callType === 'VIDEO_CALL' ? 'Video' : 'Audio'
  //             } Call)`,
  //           'generic',
  //           true,
  //           {},
  //         );
  //       }
  //     });
  //     RNCallKeep.setAvailable(true);
  //   });
  // }, []);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={'SplashScreen'}>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="StackNavigation"
            component={StackNavigation}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <View style={{backgroundColor: 'red'}}>
        <Text>HElo</Text>
      </View> */}
    </>
  );
};



export default App;
