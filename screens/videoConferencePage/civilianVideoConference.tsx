import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
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
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Home = () => {
  // let [fontsLoaded] = useFonts({
  //   DMSerifDisplay_400Regular,
  //   DMSerifDisplay_400Regular_Italic,
  // });

  // if(!fontsLoaded){
  //   return <AppLoading/>
  // }

  // else{
  return (
    <View style={[styles.home, styles.homeBg]}>
      <View style={styles.frameParent}>
        <Image
          style={styles.frameChild}
          resizeMode="cover"
          source={require('../../assets/Frame4.png')}
        />
        <Text style={[styles.safeStop, styles.janeFlexBox]}>Stop Wise</Text>
      </View>
      <View style={styles.vectorParent}>
        {/* <Image
          style={styles.frameItem}
          resizeMode="cover"
          source={require("../assets/rectangle-13.png")}
        /> */}
        <View style={[styles.ellipseParent, styles.framePosition]}>
          <Image
            style={styles.frameInner}
            resizeMode="cover"
            source={require('../../assets/img.png')}
          />
          <View style={styles.frameWrapper}>
            <View style={[styles.cameraAltWrapper, styles.wrapperFlexBox]}>
              {/* <Image
                style={styles.cameraAltIcon}
                resizeMode="cover"
                source={require("../assets/camera-alt.png")}
              /> */}
            </View>
          </View>
        </View>
        <View style={[styles.frameContainer, styles.framePosition]}>
          <View style={[styles.frameGroup, styles.homeBg]}>
            <View style={[styles.vectorWrapper, styles.wrapperFlexBox]}>
              <Image
                style={styles.vectorIcon}
                resizeMode="cover"
                source={require('../../assets/Vector266.png')}
              />
            </View>
            <Text style={[styles.swipeForVideo, styles.janeFlexBox]}>
              Swipe For Video Call
            </Text>
          </View>
        </View>
        <View style={[styles.frameView, styles.framePosition]}>
          <View style={styles.janeParent}>
            <Text style={[styles.jane, styles.janeFlexBox]}>Jane</Text>
            <Text style={[styles.smith, styles.janeFlexBox]}>
              <Text style={styles.text}>{` `}</Text>
              <Text style={styles.smith1}>Smith</Text>
            </Text>
          </View>
          <View style={styles.dlF45312434Wrapper}>
            <Text style={styles.dlF45312434}>DL #: F45312434</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
// };

const styles = StyleSheet.create({
  homeBg: {
    // backgroundColor: Color.papayawhip,
    alignItems: 'center',
  },
  janeFlexBox: {
    textAlign: 'left',
    // color: Color.darkslategray,
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  framePosition: {
    left: '50%',
    position: 'absolute',
  },
  wrapperFlexBox: {
    justifyContent: 'center',
    // backgroundColor: Color.darkslategray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameChild: {
    top: responsiveHeight(0.7),
    left: 0,
    width: responsiveWidth(2.5),
    height: responsiveHeight(4.5),
    position: 'absolute',
  },
  safeStop: {
    top: 0,
    left: responsiveWidth(5),
    fontSize: responsiveFontSize(4.3),
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#15616D',
    position: 'absolute',
  },
  frameParent: {
    width: responsiveWidth(45),
    height: responsiveHeight(5),
  },
  frameItem: {
    top: 39,
    left: -16,
    // borderRadius: Border.br_lg,
    width: 746,
    height: 709,
    position: 'absolute',
  },
  frameInner: {
    top: responsiveHeight(-0.5),
    left: responsiveWidth(-0.5),
    width: responsiveWidth(75),
    height: responsiveHeight(40),
    position: 'absolute',
  },
  cameraAltIcon: {
    width: 30,
    height: 30,
    overflow: 'hidden',
  },
  cameraAltWrapper: {
    width: responsiveWidth(13),
    height: responsiveHeight(7),
    borderRadius: 101,
  },
  frameWrapper: {
    top: responsiveHeight(30.3),
    left: responsiveWidth(51.5),
    borderStyle: 'solid',
    borderColor: '#ffecd1',
    borderWidth: 7,
    flexDirection: 'row',
    borderRadius: responsiveWidth(10),
    position: 'absolute',
  },
  ellipseParent: {
    marginLeft: responsiveWidth(-36.5),
    top: responsiveHeight(-2),
    width: responsiveWidth(10),
    height: 295,
  },
  vectorIcon: {
    width: 34,
    height: 34,
  },
  vectorWrapper: {
    borderRadius: 86,
    width: 63,
    height: 63,
    paddingHorizontal: 10,
    paddingVertical: 23,
    overflow: 'hidden',
  },
  swipeForVideo: {
    fontSize: FontSize.size_xl,
    fontWeight: '700',
    fontFamily: 'DMSerifDisplay_400Regular',
    marginLeft: responsiveWidth(1),
    marginBottom: responsiveHeight(10),
  },
  frameGroup: {
    borderRadius: responsiveWidth(20),
    width: responsiveWidth(70),
    // padding: Padding.p_5xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameContainer: {
    marginLeft: responsiveWidth(-33),
    top: responsiveHeight(72),
    alignItems: 'center',
  },
  jane: {
    fontSize: responsiveFontSize(7),
    lineHeight: responsiveHeight(8),
    top: responsiveHeight(1),
    color: '#78290F',
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  text: {
    fontSize: responsiveFontSize(5),
  },
  smith1: {
    fontSize: responsiveFontSize(4.5),
    lineHeight: 49,
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  smith: {
    fontFamily: FontFamily.dMSerifDisplayRegular,
    color: '#78290F',
  },
  janeParent: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  dlF45312434: {
    fontSize: responsiveFontSize(2.7),
    lineHeight: 28,
    fontWeight: '500',
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#78290F',
    textAlign: 'center',
  },
  dlF45312434Wrapper: {
    marginTop: 14.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameView: {
    marginLeft: responsiveWidth(-33),
    top: responsiveHeight(45),
    width: responsiveWidth(70),
    alignItems: 'center',
  },
  vectorParent: {
    alignSelf: 'stretch',
    height: responsiveHeight(85),
    marginTop: 34,
    // backgroundColor:'#15616D'
  },
  home: {
    flex: 1,
    width: responsiveWidth(100),
    height: responsiveHeight(80),
    paddingHorizontal: Padding.p_base,
    // paddingTop: Padding.p_21xl,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFECD1',
  },
});

export default Home;
