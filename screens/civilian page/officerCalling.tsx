import * as React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {
  Color,
  FontSize,
  FontFamily,
  Border,
  Padding,
} from '../globelstyle/globelstyle';
// import {
//   useFonts,
//   DMSerifDisplay_400Regular,
//   DMSerifDisplay_400Regular_Italic,
// } from '@expo-google-fonts/dm-serif-display';
// import AppLoading from 'expo-app-loading';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const OfficerCalling = props => {
  // let [fontsLoaded] = useFonts({
  //   DMSerifDisplay_400Regular,
  //   DMSerifDisplay_400Regular_Italic,
  // });

  // if (!fontsLoaded) {
  //   return <AppLoading />
  // }

  // else {
  return (
    <View style={styles.officerCalling}>
      {/* <Image
        style={styles.officerCallingChild}
        resizeMode="cover"
        source={require("../assets/vector-1.png")}
        /> */}
      <View style={[styles.frameParent, styles.frameParentPosition]}>
        <View style={styles.officerWrapper}>
          <Text style={[styles.officer, styles.officerTypo]}>Officer</Text>
        </View>
        <View style={styles.frameGroupSpaceBlock}>
          <View style={styles.danWrapper}>
            <Text style={[styles.dan, styles.danTypo]}>Dan</Text>
          </View>
          <View style={styles.danWrapper}>
            <Text style={[styles.blitzerman, styles.danTypo]}>Blitzerman</Text>
          </View>
        </View>
        <View style={[styles.badge453124Wrapper, styles.frameGroupSpaceBlock]}>
          <Text style={styles.officerTypo}>
            <Text style={styles.badgeTypo}>{`Badge #: `}</Text>
            <Text style={styles.text}>453 124</Text>
          </Text>
        </View>
      </View>
      <View style={[styles.officerProfilePicWrapper, styles.officerLayout]}>
        <View style={[styles.officerProfilePic, styles.frameContainerBg]}>
          <Image
            style={styles.profilePicIcon}
            resizeMode="cover"
            source={require('../../assets/pic1.jpg')}
          />
        </View>
      </View>
      <Text style={[styles.youAreGetting, styles.youAreGettingClr]}>
        You are getting a call...
      </Text>
      <View style={[styles.officerCallingInner, styles.frameParentPosition]}>
        <View style={[styles.frameContainer, styles.frameContainerBg]}>
          <View style={[styles.frameWrapper, styles.wrapperFlexBox]}>
            <View style={[styles.vectorWrapper, styles.wrapperFlexBox]}>
              {/* <Image
                style={styles.frameChild}
                resizeMode="cover"
                source={require("../assets/vector-266.png")}
              /> */}
            </View>
          </View>
          <Text style={[styles.swipeForVideo, styles.youAreGettingClr]}>
            Swipe For Video Call
          </Text>
          <View>
            <Text
              style={[styles.swipeForVideo]}
              onPress={() => {
                props.navigation.navigate('Instruction');
              }}>
              Login
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
// };

const styles = StyleSheet.create({
  frameParentPosition: {
    left: '50%',
    position: 'absolute',
  },
  officerTypo: {
    textAlign: 'center',
    color: '#78290F',
    lineHeight: responsiveHeight(3),
    fontSize: responsiveFontSize(2.7),
    left: responsiveWidth(2),
  },
  danTypo: {
    textAlign: 'left',
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#78290F',
  },
  frameGroupSpaceBlock: {
    marginTop: responsiveHeight(1),
    alignItems: 'center',
  },
  officerLayout: {
    height: 269,
    width: 269,
    position: 'absolute',
  },
  frameContainerBg: {
    color: '#78290F',
    flexDirection: 'row',
  },
  youAreGettingClr: {
    color: '#78290F',
    textAlign: 'left',
  },
  wrapperFlexBox: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  officerCallingChild: {
    top: 236,
    width: 693,
    height: 791,
    left: 0,
    position: 'absolute',
  },
  officer: {
    fontFamily: 'DMSerifDisplay_400Regular_Italic',
    fontWeight: '700',
  },
  officerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dan: {
    fontSize: responsiveFontSize(4.5),
    lineHeight: responsiveHeight(7),
    marginLeft: 5,
  },
  danWrapper: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  blitzerman: {
    fontSize: responsiveFontSize(6),
    lineHeight: responsiveHeight(6.5),
    left: 6.5,
  },
  badgeTypo: {
    fontFamily: FontFamily.dMSansRegular,
    fontWeight: '500',
  },
  text: {
    fontFamily: FontFamily.dMSansRegular,
  },
  badge453124Wrapper: {
    flexDirection: 'row',
  },
  frameParent: {
    marginLeft: responsiveWidth(-36),
    top: responsiveHeight(55),
    width: responsiveWidth(70),
    alignItems: 'center',
  },
  profilePicIcon: {
    width: responsiveWidth(70),
    height: responsiveHeight(35),
    borderRadius: responsiveWidth(50),
    marginLeft: responsiveWidth(3.5),
  },
  officerProfilePic: {
    top: 0,
    borderRadius: 500,
    height: 269,
    width: 269,
    position: 'absolute',
    left: 0,
  },
  officerProfilePicWrapper: {
    top: responsiveHeight(16),
    left: responsiveWidth(12),
  },
  youAreGetting: {
    marginLeft: responsiveWidth(-26),
    top: responsiveHeight(10),
    fontSize: responsiveFontSize(2.5),
    width: responsiveWidth(60),
    fontWeight: '700',
    left: '50%',
    position: 'absolute',
  },
  frameChild: {
    width: 23,
    height: 33,
  },
  vectorWrapper: {
    width: 48,
    height: 48,
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
  frameWrapper: {
    borderRadius: 86,
    // backgroundColor: Color.saddlebrown,
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(10),
    overflow: 'hidden',
  },
  swipeForVideo: {
    fontWeight: '700',
    fontFamily: 'DMSerifDisplay_400Regular',
    marginLeft: responsiveWidth(4),
    fontSize: FontSize.size_xl,
    // color: Color.saddlebrown,
  },
  frameContainer: {
    // borderRadius: Border.br_37xl,
    width: responsiveWidth(78),
    // padding: Padding.p_5xs,
    alignItems: 'center',
  },
  officerCallingInner: {
    marginLeft: -162,
    top: 715,
    alignItems: 'center',
  },
  officerCalling: {
    backgroundColor: '#F4DCC1',
    width: responsiveWidth(100),
    height: responsiveHeight(105),
    overflow: 'hidden',
  },
});

export default OfficerCalling;
