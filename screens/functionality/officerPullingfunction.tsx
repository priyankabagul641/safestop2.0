import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Color, FontFamily} from '../globelstyle/globelstyle';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

// import {
//   useFonts,
//   DMSerifDisplay_400Regular,
//   DMSerifDisplay_400Regular_Italic,
// } from '@expo-google-fonts/dm-serif-display';
// import AppLoading from 'expo-app-loading';

const CoreFunctionality = () => {
  // let [fontsLoaded] = useFonts({
  //   DMSerifDisplay_400Regular,
  //   DMSerifDisplay_400Regular_Italic,
  // // });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // } else {
  return (
    <View style={styles.coreFunctionality}>
      <Text
        style={[
          styles.policeOfficerCore,
          styles.policeOfficerCorePosition,
        ]}>{`Police Officer
Core Functionality`}</Text>
      <Text
        style={[styles.callAndChatContainer, styles.policeOfficerCorePosition]}>
        <Text style={styles.callAndChat}>{`1. Call and chat with Driver
2. Trigger driver to open app
`}</Text>
        <Text
          style={
            styles.enterLicenseInfo
          }>{`3. Enter License info to pull up key driver documents/details 
 4. Verify driver identity (AI Assisted)
5. Create and send ticket to driver
6. Sync with other officer Systems`}</Text>
      </Text>
    </View>
  );
};
// };

const styles = StyleSheet.create({
  policeOfficerCorePosition: {
    textAlign: 'left',
    // color: Color.cream,
    left: responsiveWidth(12.5),
    position: 'absolute',
  },
  policeOfficerCore: {
    top: responsiveHeight(15),
    fontSize: responsiveFontSize(4),
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#F4DCC1',
  },
  callAndChat: {
    fontWeight: '700',
    // fontFamily: FontFamily.dMSansBold,
  },
  enterLicenseInfo: {
    fontStyle: 'italic',
    // fontFamily: FontFamily.dMSansItalic,
    textAlign: 'left',
  },
  callAndChatContainer: {
    top: responsiveHeight(30),
    fontSize: responsiveFontSize(2.2),
    width: responsiveWidth(90),
    lineHeight: responsiveHeight(5),
    color: '#F4DCC1',
  },
  coreFunctionality: {
    borderRadius: 50,
    backgroundColor: Color.teal,
    width: responsiveWidth(100),
    height: responsiveHeight(105),
    overflow: 'hidden',
  },
});

export default CoreFunctionality;
