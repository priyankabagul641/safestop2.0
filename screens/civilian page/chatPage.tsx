import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  Padding,
  Border,
  Color,
  FontFamily,
  FontSize,
} from '../globelstyle/globelstyle';
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

const OfficerCalling = props => {
  // let [fontsLoaded] = useFonts({
  //   DMSerifDisplay_400Regular,
  //   DMSerifDisplay_400Regular_Italic,
  // });

  // if (!fontsLoaded) {
  //   return <AppLoading />
  // } else {
  return (
    <View style={styles.officerCalling}>
      {/* <Image
        style={styles.officerCallingChild}
        resizeMode="cover"
        source={require("../../assets/pic1.jpg")}
      /> */}
      <View style={styles.badge453124Precinct13Parent}>
        <Text style={styles.badge453}>{`Badge #: 453 124
Precinct: 13`}</Text>
        <View style={styles.officerProfilePic}>
          <Image
            style={styles.profilePicIcon}
            resizeMode="cover"
            source={require('../../assets/pic1.jpg')}
          />
        </View>
        <Text
          style={[
            styles.officerDanBlitzermanContainer,
            styles.backToVideoPosition,
          ]}>
          <Text style={styles.officerDan}>
            <Text style={styles.officerDan1}>Officer Dan</Text>
            <Text style={styles.text}>{` `}</Text>
          </Text>
          <Text style={styles.doYouKnowTypo}>
            <Text style={styles.text}>{` 
`}</Text>
            <Text style={styles.blitzerman1}>Blitzerman</Text>
          </Text>
        </Text>
      </View>
      <View
        style={[
          styles.doYouKnowHowFastYouWereWrapper,
          styles.youWrapperBorder,
        ]}>
        <Text style={[styles.doYouKnow, styles.doYouKnowTypo]}>
          Do you know how fast you were going?
        </Text>
      </View>
      <View style={[styles.whatDidYouSayWrapper, styles.youWrapperBorder]}>
        <Text style={[styles.doYouKnow, styles.doYouKnowTypo]}>
          What did you say?
        </Text>
      </View>
      <View style={styles.frameParent}>
        <View style={[styles.frameChild, styles.frameLayout]} />
        <View style={[styles.frameItem, styles.frameLayout]} />
        <View style={[styles.frameInner, styles.frameLayout]} />
      </View>
      <View style={[styles.notFastEnoughWrapper, styles.youWrapperBorder]}>
        <Text style={[styles.notFastEnough, styles.doYouKnowTypo]}>
          Not fast enough
        </Text>
      </View>
      <View style={styles.backToVideoParent}>
        <Text style={[styles.backToVideo, styles.backToVideoPosition]}>
          Back to Video
        </Text>
        {/* <Image
          style={styles.vectorIcon}
          resizeMode="cover"
          source={require("../assets/vector-7.png")}
        /> */}
        <Text
          style={[styles.frameInner]}
          onPress={() => {
            props.navigation.navigate('CivilianFunction');
          }}>
          Login
        </Text>
      </View>
    </View>
  );
};
// };

const styles = StyleSheet.create({
  backToVideoPosition: {
    left: responsiveWidth(18),
    textAlign: 'left',
    position: 'absolute',
    marginTop: responsiveHeight(1),
  },
  youWrapperBorder: {
    // padding: Padding.p_5xs,
    borderWidth: 2,
    borderColor: '#78290f',
    borderStyle: 'solid',
    borderRadius: Border.br_5xs,
    flexDirection: 'row',
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: '#F5CBA7',
  },
  doYouKnowTypo: {
    fontFamily: FontFamily.dMSansRegular,
    fontWeight: '700',
  },
  frameLayout: {
    width: responsiveWidth(3.5),
    // borderRadius: Border.br_111xl,
    height: responsiveHeight(1.8),
    borderWidth: 2,
    borderColor: '#78290f',
    borderStyle: 'solid',
    top: 0,
    position: 'absolute',
    overflow: 'hidden',
    // backgroundColor: Color.cream,
  },
  officerCallingChild: {
    top: 142,
    width: 705,
    height: 772,
    left: 0,
    position: 'absolute',
  },
  badge453: {
    top: responsiveHeight(2),
    left: responsiveWidth(57),
    fontFamily: FontFamily.dMSansRegular,
    width: responsiveWidth(33),
    color: 'black',
    textAlign: 'right',
    fontSize: responsiveFontSize(1.8),
    position: 'absolute',
    fontWeight: '600',
  },
  profilePicIcon: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  officerProfilePic: {
    top: 4,
    borderRadius: 460,
    flexDirection: 'row',
    left: responsiveWidth(1),
    position: 'absolute',
    // backgroundColor: Color.cream,
  },
  officerDan1: {
    fontSize: responsiveFontSize(2.5),
  },
  text: {
    fontSize: responsiveFontSize(2),
  },
  officerDan: {
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  blitzerman1: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  officerDanBlitzermanContainer: {
    textAlign: 'left',
    top: 0,
    left: 61,
    width: 143,
  },
  badge453124Precinct13Parent: {
    top: responsiveHeight(20),
    width: responsiveWidth(50),
    height: 52,
    left: responsiveWidth(2.3),
    position: 'absolute',
  },
  doYouKnow: {
    flex: 1,
    color: '#78290F',
    textAlign: 'right',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.8),
  },
  doYouKnowHowFastYouWereWrapper: {
    top: responsiveHeight(32),
    width: responsiveWidth(75),
    left: responsiveWidth(20),
    padding: 10,
    borderWidth: 2,
    borderColor: '#78290f',
    borderStyle: 'solid',
    borderRadius: Border.br_5xs,
  },
  whatDidYouSayWrapper: {
    top: responsiveHeight(53),
    width: responsiveWidth(70),
    left: responsiveWidth(25),
    padding: 10,
    borderWidth: 2,
    borderColor: '#78290f',
    borderStyle: 'solid',
    borderRadius: Border.br_5xs,
  },
  frameChild: {
    left: 0,
    borderRadius: 50,
  },
  frameItem: {
    left: 18,
    borderRadius: 50,
  },
  frameInner: {
    left: 36,
    borderRadius: 50,
  },
  frameParent: {
    top: responsiveHeight(61),
    left: responsiveWidth(80),
    width: 45,
    height: 15,
    position: 'absolute',
  },
  notFastEnough: {
    color: '#78290F',
    textAlign: 'left',
    marginLeft: 11,
    fontSize: 15,
  },
  notFastEnoughWrapper: {
    top: responsiveHeight(43.5),
    padding: 10,
    borderWidth: 2,
    borderColor: '#78290f',
    borderStyle: 'solid',
    borderRadius: Border.br_5xs,
    left: responsiveWidth(8),
  },
  backToVideo: {
    top: responsiveHeight(5),
    fontSize: responsiveFontSize(3.3),
    fontWeight: '100',
    color: '#78290F',
    textAlign: 'left',
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  vectorIcon: {
    top: 19,
    left: 34,
    width: 14,
    height: 24,
    position: 'absolute',
  },
  backToVideoParent: {
    top: responsiveHeight(4),
    height: responsiveHeight(4),
    left: 0,
    position: 'absolute',
    width: responsiveWidth(50),
  },
  officerCalling: {
    height: responsiveHeight(105),
    overflow: 'hidden',
    backgroundColor: '#FFECD1',
    width: responsiveWidth(100),
  },
});

export default OfficerCalling;
