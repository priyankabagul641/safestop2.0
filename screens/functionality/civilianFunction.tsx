import React, {memo} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Color, FontSize, FontFamily} from '../globelstyle/globelstyle';
// import {
//   useFonts,
//   DMSerifDisplay_400Regular,
//   DMSerifDisplay_400Regular_Italic,
// } from '@expo-google-fonts/dm-serif-display';
// import AppLoading from 'expo-app-loading';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const CoreFunctionality = props => {
  // let [fontsLoaded] = useFonts({
  //   DMSerifDisplay_400Regular,
  //   DMSerifDisplay_400Regular_Italic,
  // });

  // if (!fontsLoaded) {
  //   return <AppLoading />
  // }
  // else {
  return (
    <View style={styles.coreFunctionality}>
      <Text
        style={[
          styles.civilianCoreFunctionality,
          styles.haveANotifiationPosition,
        ]}>{`Civilian
Core Functionality`}</Text>
      <Text
        style={[
          styles.haveANotifiation,
          styles.haveANotifiationPosition,
        ]}>{`1.   Have a notifiation delivered when getting pulled over
 2.   Instructions displayed when getting pulled over
   3.  Ability to receive video call from officer
 4.  Ability to upload and update profile picture`}</Text>
      <View>
        <Text
          style={[styles.new]}
          onPress={() => {
            props.navigation.navigate('OfficerPullingFunction');
          }}>
          CivilianVideoConference
        </Text>
      </View>
    </View>
  );
};
// };

const styles = StyleSheet.create({
  haveANotifiationPosition: {
    textAlign: 'left',
    color: '#F4DCC1',
    left: responsiveWidth(13),
    position: 'absolute',
    fontFamily: FontFamily.dMSansRegular,
  },
  civilianCoreFunctionality: {
    top: responsiveHeight(14),
    fontSize: responsiveFontSize(4),
    fontFamily: FontFamily.dMSerifDisplayRegular,
  },
  haveANotifiation: {
    top: responsiveHeight(30),
    fontSize: responsiveFontSize(2.2),
    lineHeight: 50,
    fontWeight: '700',
    width: responsiveWidth(80),
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  coreFunctionality: {
    borderRadius: 50,
    backgroundColor: Color.teal,
    width: responsiveWidth(100),
    height: responsiveHeight(105),
    overflow: 'hidden',
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  new: {
    top: 40,
    alignItems: 'center',
  },
});

export default CoreFunctionality;
