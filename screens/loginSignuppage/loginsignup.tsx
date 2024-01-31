import * as React from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {Border, Color, FontSize} from '../globelstyle/globelstyle';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const LoginSignUp = ({navigation}) => {
  return (
    <View style={styles.loginsignUp}>
      <View style={styles.frameGroup}>
        <Text style={[styles.safeStop, styles.signUpClr]}>Stop Wise</Text>
        <Text style={[styles.theContactlessTraffic, styles.signUpClr]}>
          The contactless traffic stop app
        </Text>
        <Image
          style={styles.frameChild}
          resizeMode="contain"
          source={require('../../assets/Frame1.png')}
        />
      </View>
      <View style={styles.frameParent}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
            <Text style={styles.login}>Login</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignUp');
          }}>
          <View style={[styles.signUpWrapper, styles.wrapperFlexBox]}>
            <Text style={[styles.signUp, styles.signUpClr]}>Sign Up</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default LoginSignUp;

const styles = StyleSheet.create({
  loginsignUp: {
    backgroundColor: '#FFECD1',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperFlexBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveHeight(2.1),
    borderRadius: Border.br_5xs,
    width: responsiveWidth(80),
  },
  signUpClr: {
    color: Color.teal,
    textAlign: 'left',
  },
  login: {
    fontFamily: 'DMSans-Regular',
    color: '#fff',
    textAlign: 'left',
    fontWeight: '700',
    fontSize: FontSize.size_xl,
  },
  loginWrapper: {
    backgroundColor: Color.teal,
    marginTop: responsiveHeight(4),
  },
  signUp: {
    fontWeight: '700',
    fontSize: FontSize.size_xl,
    color: Color.teal,
    fontFamily: 'DMSans-Regular',
  },
  signUpWrapper: {
    marginTop: responsiveHeight(1.5),
    borderStyle: 'solid',
    borderColor: '#15616d',
    borderWidth: 3,
  },

  frameParent: {
    marginTop: responsiveHeight(2),
  },
  frameChild: {
    marginTop: responsiveHeight(3),
    width: responsiveWidth(15),
    height: responsiveHeight(2.2),
  },
  safeStop: {
    fontSize: responsiveFontSize(6.5),
    fontFamily: 'DMSerifDisplay-Regular',
    alignContent: 'center',
    lineHeight: 70,
    // paddingVertical: 20,
  },
  theContactlessTraffic: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'DMSans-Regular',
    color: Color.teal,
    marginTop: responsiveHeight(1),
    fontWeight: '500',
  },
  frameGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
