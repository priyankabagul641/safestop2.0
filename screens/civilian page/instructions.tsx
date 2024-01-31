import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  FontFamily,
  Color,
  FontSize,
  Border,
  Padding,
} from '../globelstyle/globelstyle';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

// import {
//   useFonts,
//   DMSerifDisplay_400Regular,
// } from '@expo-google-fonts/dm-serif-display';

// import AppLoading from 'expo-app-loading';

const SplashScreen = props => {
  // let [fontsLoaded] = useFonts({
  //   DMSerifDisplay_400Regular,
  // });

  // if (!fontsLoaded) {
  //   return <AppLoading />
  // }
  // else {

  return (
    <View style={styles.splashScreen}>
      <View style={[styles.frameParent, styles.framePosition]}>
        {/* <Image
          style={styles.frameChild}
          resizeMode="cover"
          source={require("../assets/frame-1.png")}
        /> */}
        <Text style={[styles.safeStop, styles.textTypo]}>Stop Wise</Text>
      </View>
      <View style={[styles.frameGroup, styles.framePosition]}>
        <View style={styles.frameContainer}>
          <View style={[styles.wrapper, styles.wrapperFlexBox]}>
            <Text style={[styles.text, styles.textTypo]}>1</Text>
          </View>
          <Text style={[styles.ensureYouAre, styles.iFeelUnsafeTypo]}>
            Ensure you are stopped in a safe place
          </Text>
        </View>
        <View style={styles.frameView}>
          <View style={[styles.wrapper, styles.wrapperFlexBox]}>
            <Text style={[styles.text, styles.textTypo]}>2</Text>
          </View>
          <Text style={[styles.ensureYouAre, styles.iFeelUnsafeTypo]}>
            Take a deep breath and relax
          </Text>
        </View>
        <View style={styles.frameView}>
          <View style={[styles.wrapper, styles.wrapperFlexBox]}>
            <Text style={[styles.text, styles.textTypo]}>3</Text>
          </View>
          <Text style={[styles.ensureYouAre, styles.iFeelUnsafeTypo]}>
            Put both hands on the wheel
          </Text>
        </View>
        <View style={styles.frameView}>
          <View style={[styles.wrapper, styles.wrapperFlexBox]}>
            <Text style={[styles.text, styles.textTypo]}>4</Text>
          </View>
          <Text style={[styles.ensureYouAre, styles.iFeelUnsafeTypo]}>
            Wait for the officer to call you or walk over to you
          </Text>
        </View>
      </View>
      <View style={[styles.splashScreenInner, styles.splashScreenInnerLayout]}>
        <View
          style={[styles.iFeelUnsafeWrapper, styles.splashScreenInnerLayout]}>
          <Text style={[styles.iFeelUnsafe, styles.iFeelUnsafeTypo]}>
            I feel unsafe
          </Text>
        </View>
        <Text
          style={{margin: 90}}
          onPress={() => {
            props.navigation.navigate('ChatPage');
          }}>
          ChatPage
        </Text>
      </View>
    </View>
  );
};
// };

const styles = StyleSheet.create({
  framePosition: {
    left: '50%',
    position: 'absolute',
  },
  textTypo: {
    textAlign: 'left',
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  wrapperFlexBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15616D',
    overflow: 'hidden',
    borderRadius: 50,
  },
  iFeelUnsafeTypo: {
    fontSize: responsiveFontSize(2.4),
    textAlign: 'left',
  },
  splashScreenInnerLayout: {
    width: responsiveWidth(74),
    marginLeft: responsiveWidth(2),
    position: 'absolute',
  },
  frameChild: {
    top: 9,
    width: 16,
    height: 36,
    left: 0,
    position: 'absolute',
  },
  safeStop: {
    top: responsiveHeight(5),
    left: 10,
    fontSize: responsiveFontSize(4.5),
    color: '#15616D',
    position: 'absolute',
  },
  frameParent: {
    marginLeft: responsiveWidth(-24),
    top: responsiveHeight(5),
    width: responsiveWidth(50),
    height: responsiveHeight(6),
  },
  text: {
    fontSize: responsiveFontSize(2.5),
    color: 'white',
  },
  wrapper: {
    borderRadius: 50,
    width: 40,
    height: 40,
    paddingHorizontal: 1,
    paddingVertical: 1,
  },
  ensureYouAre: {
    fontFamily: 'DMSerifDisplay_400Regular',
    width: 237,
    marginLeft: 21,
    color: '#15616D',
    fontSize: 17,
  },
  frameContainer: {
    flexDirection: 'row',
  },
  frameView: {
    marginTop: responsiveHeight(4),
    flexDirection: 'row',
  },
  frameGroup: {
    marginTop: -248,
    marginLeft: -149,
    top: '50%',
  },
  iFeelUnsafe: {
    fontWeight: '700',
    fontFamily: 'DMSerifDisplay_400Regular',
    color: 'white',
  },
  iFeelUnsafeWrapper: {
    top: responsiveHeight(2),
    borderRadius: Border.br_5xs,
    height: 64,
    padding: Padding.p_base,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15616D',
    overflow: 'hidden',
    flexDirection: 'row',
    left: responsiveWidth(2),
  },
  splashScreenInner: {
    top: responsiveHeight(75),
    left: responsiveWidth(8.5),
  },
  splashScreen: {
    backgroundColor: '#FFECD1',
    flex: 1,
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    overflow: 'hidden',
  },
});

export default SplashScreen;
