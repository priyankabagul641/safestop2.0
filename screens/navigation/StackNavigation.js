import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../login/login';
import LoginSignUp from '../loginSignuppage/loginsignup';
import SignUp from '../signup/signup';
import Home from '../homepage/homepage';
import ChatPage from '../civilian page/chatPage';
import Instruction from '../civilian page/instructions';
import OfficerCalling from '../civilian page/officerCalling';
import CivilianFunction from '../functionality/civilianFunction';
import OfficerPullingFunction from '../functionality/officerPullingfunction';
import CivilianVideoConference from '../videoConferencePage/civilianVideoConference';
// import auth from '@react-native-firebase/auth';
import VideoCall from '../videocall';
import DeshbordScreen from '../Deshbord';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  // const [appIsReady, setAppIsReady] = React.useState(false);

  const [initialRouteName, setInitialRouteName] = React.useState('');
  //   React.useEffect(() => {
  //     const user = auth().onAuthStateChanged(userExist => {
  //       console.log(userExist);
  //       if (userExist) {
  //         setInitialRouteName('Home');
  //       } else {
  //         setInitialRouteName('Login/SignUp');
  //       }
  //     });
  //     return () => {
  //       user();
  //     };
  //   }, []);

  React.useEffect(() => {
    async function fetchData() {
      const loginState = await AsyncStorage.getItem('LOGIN');
      let data = await JSON.parse(loginState);
      if (data) {
        if (data.user.role === 'user') {
          setInitialRouteName('Home');
        } else {
          setInitialRouteName('Deshbord');
        }
      } else {
        setInitialRouteName('Login/SignUp');
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {initialRouteName && (
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={initialRouteName}>
          {/* <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{headerShown: false}}
            /> */}
          <Stack.Screen
            name="Login/SignUp"
            component={LoginSignUp}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="VideoCall"
            component={VideoCall}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Deshbord"
            component={DeshbordScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OfficerCalling"
            component={OfficerCalling}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChatPage"
            component={ChatPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Instruction"
            component={Instruction}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CivilianFunction"
            component={CivilianFunction}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OfficerPullingFunction"
            component={OfficerPullingFunction}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CivilianVideoConference"
            component={CivilianVideoConference}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      )}
    </>
  );
};
export default StackNavigation;
