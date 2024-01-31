import * as React from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Color,
  Padding,
  Border,
  FontFamily,
  FontSize,
} from '../globelstyle/globelstyle';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Loader from '../helpers/loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import RBSheet from 'react-native-raw-bottom-sheet';
import Regex from '../helpers/Regex';
import ErrorComponent from '../components/Error';
const Login = props => {
  const [email, setEmail] = React.useState();
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [forgotCode, setForgotCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [conformPassword, setConformPassword] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isEmail, setIsEmail] = React.useState('');
  const [secureView, setSecureView] = React.useState(false);
  const [newPasswordView, setNewPasswordView] = React.useState(false);
  const [CPasswordView, setCPasswordView] = React.useState(false);
  const [ForgotType, setForgotType] = React.useState('EMAIL');
  const [ForgotUserID, setForgotUserID] = React.useState('');
  const [isPassword, setIsPassword] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const refRBSheet = React.useRef();
  const [error, setError] = React.useState({
    email: null,
    newPassword: null,
    conformPassword: null,
  });

  React.useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getToken();
      }
    } else {
      const granted = await PermissionsAndroid.request(
        'android.permission.POST_NOTIFICATIONS',
        {
          title: 'Need permission for notification',
          message:
            'To get updates via. push notifications we need your permission for notifications.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getToken();
      }
    }
  };

  const getToken = async () => {
    let checkToken = await AsyncStorage.getItem('fcmToken');
    console.log('checkToken=======', checkToken);
    if (!checkToken) {
      try {
        const fcmToken = await messaging().getToken();
        console.log('fcm Token generated::::', fcmToken);
        if (fcmToken) {
          console.log('fcm Token Generated:::', fcmToken);
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      } catch (error) {
        console.log('error in fcmToken', error);
        Alert.alert(error?.message);
      }
    }
  };

  const onSubmit = async value => {
    setLoader(true);
    if (validateEmail(email) && validatePassword(password)) {
      let data = {
        email: email,
        password: password,
      };
      console.log('data::', data);
      await fetch('http://35.154.76.187:3000/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        //Request Type
      })
        .then(response => response.json())
        //If response is in json then in success
        .then(responseJson => {
          //Success
          setLoader(false);
          if (responseJson.status === 'success') {
            AsyncStorage.setItem('LOGIN', JSON.stringify(responseJson.data));
            if (responseJson.data.user.role === 'user') {
              props.navigation.replace('Home');
            } else {
              props.navigation.replace('Deshbord');
            }
          } else {
            Alert.alert(responseJson.message);
          }
        })
        //If response is not in json then in error
        .catch(error => {
          //Error
          console.error(error);
          setLoader(false);
        });
    } else {
      Alert.alert('Please enter valid records.');
      setLoader(false);
    }
  };
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmail(email);
      setIsEmail('');
      return true;
    } else {
      setIsEmail('Please enter valid email');
      return false;
    }
  };
  const validatePassword = password => {
    if (!password) {
      setIsPassword('Password is required');
      return false;
    }
    setPassword(password);
    setIsPassword(null);
    return true;
  };

  const onForgotCheck = async () => {
    let isValid = true;
    var editErrorState = {...error};

    if (!Regex.validateEmail(forgotEmail)) {
      isValid = false;
      editErrorState.email = 'Please enter valid email address';
    } else {
      editErrorState.email = null;
    }

    setError(editErrorState);

    if (isValid) {
      setLoader(true);
      let data = {
        email: forgotEmail,
      };
      await fetch('http://35.154.76.187:3000/api/v1/users/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        //Request Type
      })
        .then(response => response.json())
        //If response is in json then in success
        .then(responseJson => {
          console.log('responseJson-----', responseJson);
          //Success
          setLoader(false);
          if (responseJson.status === 'success') {
            refRBSheet.current.close();
            try {
              setTimeout(() => {
                setForgotEmail('');
                refRBSheet.current.open();
                setForgotType('VERIFY');
              }, 500);
            } catch (error) {}
          } else {
            Alert.alert(responseJson.message);
          }
        })
        //If response is not in json then in error
        .catch(error => {
          //Error
          setForgotType('EMAIL');
          refRBSheet.current.close();
          Alert.alert(error.message);
          console.error(error);
          setLoader(false);
        });
    }
  };

  const onForgotVerification = async () => {
    setLoader(true);
    await fetch(
      `http://35.154.76.187:3000/api/v1/users/verifyOtp/${forgotCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        //Request Type
      },
    )
      .then(response => response.json())
      //If response is in json then in success
      .then(responseJson => {
        console.log('responseJson-----', responseJson);
        //Success
        setLoader(false);
        if (responseJson.status === 'success') {
          try {
            refRBSheet.current.close();
            setForgotUserID(responseJson?.data?.user);
            setTimeout(() => {
              setForgotCode('');
              setForgotType('PASSWORD');
              refRBSheet.current.open();
            }, 500);
          } catch (error) {}
        } else {
          Alert.alert('Invalid verification code provided, please try again');
        }
      })
      //If response is not in json then in error
      .catch(error => {
        //Error]
        setForgotType('EMAIL');
        refRBSheet.current.close();
        Alert.alert(error.message);
        console.error(error);
        setLoader(false);
      });
  };

  const onForgotPassword = async () => {
    let isValid = true;
    var editErrorState = {...error};

    if (newPassword.length > 0 && newPassword.length < 8) {
      isValid = false;
      editErrorState.newPassword =
        'The password must be between 8-16 characters';
    } else if (!Regex.validatePassword(newPassword)) {
      isValid = false;
      editErrorState.newPassword =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else {
      editErrorState.newPassword = null;
    }

    if (conformPassword.length > 0 && conformPassword.length < 8) {
      isValid = false;
      editErrorState.conformPassword =
        'The password must be between 8-16 characters';
    } else if (!Regex.validatePassword(conformPassword)) {
      isValid = false;
      editErrorState.conformPassword =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else if (newPassword !== conformPassword) {
      isValid = false;
      editErrorState.conformPassword =
        'New password and confirm password should be same';
    } else {
      editErrorState.conformPassword = null;
    }

    setError(editErrorState);
    if (isValid) {
      console.log('ForgotUserID:', ForgotUserID);
      console.log(
        'ForgotUserID:',
        `http://35.154.76.187:3000/api/v1/users/${ForgotUserID}`,
      );
      setLoader(true);
      let data = {
        password: newPassword,
      };
      await fetch(`http://35.154.76.187:3000/api/v1/users/${ForgotUserID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        //Request Type
      })
        .then(response => response.json())
        //If response is in json then in success
        .then(responseJson => {
          console.log('responseJson-----', responseJson);
          //Success
          setLoader(false);
          if (responseJson.status === 'success') {
            try {
              refRBSheet.current.close();
              setNewPassword('');
              setConformPassword('');
              Alert.alert('Your password has been changed successfully');
              setForgotType('EMAIL');
              setForgotUserID('');
            } catch (error) {}
          } else {
            Alert.alert(responseJson.message);
          }
        })
        //If response is not in json then in error
        .catch(error => {
          //Error
          setForgotType('EMAIL');
          refRBSheet.current.close();
          Alert.alert(error.message);
          console.error(error);
          setLoader(false);
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFECD1'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.login}>
          <View style={styles.frameContainer}>
            <Text style={[styles.welcome, styles.emailClr]}>Welcome</Text>
            <Text style={[styles.goodToSee, styles.goodToSeeTypo]}>
              Good to see you!
            </Text>
            <Image
              style={styles.frameChild}
              resizeMode="contain"
              source={require('../../assets/Frame1.png')}
            />
          </View>
          <View style={styles.frameParent}>
            <View style={styles.frameGroup}>
              <View>
                <Text style={[styles.email, styles.emailClr]}>Email</Text>
                <View>
                  <TextInput
                    value={email}
                    autoCorrect={false}
                    autoCapitalize="none"
                    // keyboardType="email-address"
                    onChangeText={(email: any) =>
                      setEmail(email.toLowerCase().trim())
                    }
                    style={[
                      styles.johnjacobgmailcomWrapper,
                      styles.wrapperFlexBox,
                    ]}
                  />
                  <Text
                    style={[
                      styles.johnjacobgmailcom,
                      styles.goodToSeeTypo,
                    ]}></Text>
                </View>
                {/* <View>
              <Text> {isEmail && isEmail}</Text>
            </View> */}
              </View>
              <View style={styles.passwordParent}>
                <Text style={[styles.email, styles.emailClr]}>Password</Text>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      onChangeText={(password: any) => setPassword(password)}
                      secureTextEntry={!secureView}
                      style={[
                        styles.johnjacobgmailcomWrapper,
                        styles.wrapperFlexBox,
                        {paddingRight: 50},
                      ]}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setSecureView(!secureView);
                      }}
                      style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        right: 15,
                      }}>
                      <Image
                        source={
                          secureView
                            ? require('../../assets/view.png')
                            : require('../../assets/hide.png')
                        }
                        resizeMode="contain"
                        style={{
                          height: 25,
                          width: 25,
                          tintColor: Color.teal,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* <Text
                    style={[
                      styles.johnjacobgmailcom,
                      styles.goodToSeeTypo,
                    ]}></Text> */}
                </View>
                {/* <View>
                  <Text> {isPassword && isPassword}</Text>
                </View> */}
              </View>
              <TouchableOpacity
                style={{padding: 0, marginTop: 5}}
                onPress={() => {
                  setForgotEmail('');
                  setConformPassword('');
                  setNewPassword('');
                  setForgotCode('');
                  setForgotType('EMAIL');
                  setNewPasswordView(false);
                  setCPasswordView(false);
                  setTimeout(() => {
                    refRBSheet.current.open();
                  }, 200);
                }}>
                <Text style={[styles.forgotPassword, styles.goodToSeeTypo]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => onSubmit(false)}
              style={{marginTop: 40}}>
              <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
                <Text style={[styles.login1, styles.emailTypo]}>Login</Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
          onPress={() => onSubmit(true)}
          style={{marginTop: 20}}>
          <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
            <Text style={[styles.login1, styles.emailTypo]}>
              Login With Officer
            </Text>
          </View>
        </TouchableOpacity> */}
          </View>

          <View style={{width: '80%', marginTop: 40}}>
            <View
              style={{
                height: 2,
                backgroundColor: '#15616D',
                width: '100%',
                // borderWidth: 1,
              }}
            />
            <Text
              style={{
                fontSize: 15,
                fontFamily: FontFamily.dMSansRegular,
                color: '#15616D',
                position: 'absolute',
                alignSelf: 'center',
                top: -10,
                backgroundColor: '#FFECD1',
                paddingHorizontal: 20,
              }}>
              Or Login With
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '80%',
              marginTop: 30,
            }}>
            <TouchableOpacity
              onPress={() => Alert.alert('Under development')}
              style={{
                backgroundColor: 'white',
                width: '48%',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}>
              <Image
                source={require('../../assets/image3.png')}
                resizeMode="contain"
                style={{height: 40}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert('Under development')}
              style={{
                backgroundColor: 'white',
                width: '48%',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}>
              <Image
                source={require('../../assets/image4.png')}
                resizeMode="contain"
                style={{height: 30}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.dontHaveAnAccountParent}>
            <Text style={[styles.johnjacobgmailcom, styles.goodToSeeTypo]}>
              Don’t have an account?
            </Text>
            <Text
              style={[styles.signUpNow, styles.emailClr]}
              onPress={() => {
                props.navigation.navigate('SignUp');
              }}>
              Sign Up Now
            </Text>
          </View>
        </View>
      </ScrollView>
      <Loader value={loader} />
      <RBSheet
        ref={refRBSheet}
        // closeOnDragDown={true}
        height={ForgotType === 'PASSWORD' ? 400 : 300}
        // onClose={() => {
        //   setForgotType('EMAIL');
        // }}
        customStyles={{
          container: {
            // borderColor: 'red',
            // borderWidth: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: '#FFECD1',
          },
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          draggableIcon: {
            width: 150,
            marginTop: 15,
          },
        }}>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text style={[styles.titleSheet, styles.emailClr]}>
            Reset Password
          </Text>

          {ForgotType === 'EMAIL' && (
            <>
              <View style={{marginTop: 20}}>
                <Text style={[styles.email, styles.emailClr]}>
                  Recovery Email
                </Text>
                <View>
                  <TextInput
                    value={forgotEmail}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(email: any) => {
                      setForgotEmail(email.toLowerCase());
                      error.email = null;
                    }}
                    style={[
                      styles.johnjacobgmailcomWrapper,
                      styles.wrapperFlexBox,
                    ]}
                  />
                  {error.email !== null ? (
                    <ErrorComponent right={'left'} errorMessage={error.email} />
                  ) : null}
                  <Text
                    style={[
                      styles.johnjacobgmailcom,
                      styles.goodToSeeTypo,
                    ]}></Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  onForgotCheck();
                }}>
                <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
                  <Text style={[styles.login1, styles.emailTypo]}>
                    Send Code
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
          {ForgotType === 'VERIFY' && (
            <>
              <View style={{marginTop: 20}}>
                <Text style={[styles.email, styles.emailClr]}>
                  Recovery Code
                </Text>
                <View>
                  <TextInput
                    value={forgotCode}
                    autoCorrect={false}
                    keyboardType="numeric"
                    onChangeText={(email: any) => setForgotCode(email)}
                    style={[
                      styles.johnjacobgmailcomWrapper,
                      styles.wrapperFlexBox,
                    ]}
                  />
                  <Text
                    style={[
                      styles.johnjacobgmailcom,
                      styles.goodToSeeTypo,
                    ]}></Text>
                </View>
              </View>
              <TouchableOpacity
                disabled={forgotCode.length !== 6 ? true : false}
                onPress={() => {
                  onForgotVerification();
                }}>
                <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
                  <Text style={[styles.login1, styles.emailTypo]}>
                    Validate
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
          {ForgotType === 'PASSWORD' && (
            <>
              <View style={{marginTop: 20, width: '80%'}}>
                <Text style={[styles.email, styles.emailClr]}>
                  New Password
                </Text>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      value={newPassword}
                      autoCorrect={false}
                      secureTextEntry={!newPasswordView}
                      // keyboardType="email-address"
                      onChangeText={(val: any) => {
                        setNewPassword(val);
                        error.newPassword = null;
                      }}
                      style={[
                        styles.johnjacobgmailcomWrapper,
                        styles.wrapperFlexBox,
                        {paddingRight: 50},
                      ]}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setNewPasswordView(!newPasswordView);
                      }}
                      style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        right: 15,
                      }}>
                      <Image
                        source={
                          newPasswordView
                            ? require('../../assets/view.png')
                            : require('../../assets/hide.png')
                        }
                        resizeMode="contain"
                        style={{
                          height: 25,
                          width: 25,
                          tintColor: Color.teal,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  {error.newPassword !== null ? (
                    <ErrorComponent
                      right={'left'}
                      errorMessage={error.newPassword}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.johnjacobgmailcom,
                      styles.goodToSeeTypo,
                    ]}></Text>
                </View>
                <Text style={[styles.email, styles.emailClr]}>
                  Confirm Pasword
                </Text>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      value={conformPassword}
                      autoCorrect={false}
                      secureTextEntry={!CPasswordView}
                      // keyboardType="email-address"
                      onChangeText={(val: any) => {
                        setConformPassword(val);
                        error.conformPassword = null;
                      }}
                      style={[
                        styles.johnjacobgmailcomWrapper,
                        styles.wrapperFlexBox,
                      ]}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setCPasswordView(!CPasswordView);
                      }}
                      style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        right: 15,
                      }}>
                      <Image
                        source={
                          CPasswordView
                            ? require('../../assets/view.png')
                            : require('../../assets/hide.png')
                        }
                        resizeMode="contain"
                        style={{
                          height: 25,
                          width: 25,
                          tintColor: Color.teal,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  {error.conformPassword !== null ? (
                    <ErrorComponent
                      right={'left'}
                      errorMessage={error.conformPassword}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.johnjacobgmailcom,
                      styles.goodToSeeTypo,
                    ]}></Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  onForgotPassword();
                }}>
                <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
                  <Text style={[styles.login1, styles.emailTypo]}>
                    Save New Password
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};
// };

const styles = StyleSheet.create({
  emailClr: {
    color: Color.teal,
    textAlign: 'left',
  },
  wrapperFlexBox: {
    alignItems: 'center',
    padding: responsiveHeight(1.8),
    width: responsiveWidth(80),
    borderRadius: Border.br_5xs,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  goodToSeeTypo: {
    fontFamily: FontFamily.dMSansRegular,
    color: Color.teal,
  },
  emailTypo: {
    // fontFamily: FontFamily.dMSansBold,
    fontWeight: '700',
  },
  email: {
    // fontSize: FontSize.size_sm,
    // lineHeight: responsiveHeight(2),
    textAlign: 'left',
    // fontFamily: FontFamily.dMSansBold,
    fontWeight: '700',
  },
  johnjacobgmailcom: {
    fontSize: responsiveFontSize(1.6),
    textAlign: 'left',
    top: responsiveHeight(0.5),
  },
  johnjacobgmailcomWrapper: {
    borderStyle: 'solid',
    borderColor: '#15616d',
    borderWidth: 2,
    fontSize: 18,
    color: '#15616d',
  },
  passwordParent: {
    // marginTop: responsiveHeight(1),
  },
  forgotPassword: {
    textAlign: 'right',
    // bottom: responsiveHeight(5),
    // marginTop: responsiveHeight(1),
    fontFamily: 'DMSans-Regular',
    fontWeight: '100',
  },
  frameGroup: {
    alignItems: 'flex-end',
  },
  login1: {
    fontSize: responsiveFontSize(2),
    color: '#FFECD1',
    textAlign: 'left',
    fontFamily: FontFamily.dMSansBold,
  },
  loginWrapper: {
    backgroundColor: Color.teal,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Color.teal,
    // marginTop: responsiveHeight(0.5),
  },
  frameParent: {
    marginTop: responsiveWidth(4),
    // left: responsiveWidth(10),
    alignItems: 'flex-end',
  },
  signUpNow: {
    marginLeft: responsiveWidth(1),
    // fontSize: FontSize.size_base,
    textAlign: 'left',
    fontFamily: 'DMSerifDisplay-Regular',
    fontWeight: '900',
    fontSize: responsiveFontSize(2),
  },
  dontHaveAnAccountParent: {
    marginTop: responsiveHeight(15),
    // left: responsiveWidth(18),
    // fontWeight: '100',
    flexDirection: 'row',

    // fontFamily: 'DMSerifDisplay-Regular_Italic',
  },
  frameChild: {
    marginTop: responsiveHeight(3),
    // left: responsiveWidth(23),
    width: responsiveWidth(16.5),
    height: responsiveHeight(2.5),
  },
  titleSheet: {
    // top: responsiveHeight(2),
    // left: 17,
    fontSize: responsiveFontSize(5),
    textAlign: 'left',
    fontWeight: '500',

    fontFamily: 'DMSerifDisplay-Regular',
  },
  welcome: {
    // top: responsiveHeight(2),
    // left: 17,
    fontSize: responsiveFontSize(7),
    textAlign: 'left',

    fontFamily: 'DMSerifDisplay-Regular',
  },
  goodToSee: {
    marginTop: responsiveHeight(1),
    // left: 31,
    fontSize: responsiveFontSize(2.8),
    textAlign: 'left',

    fontFamily: 'DMSerifDisplay-Regular',
  },
  frameContainer: {
    marginTop: responsiveHeight(4),
    // left: 70,
    // width: responsiveWidth(100),
    // height: responsiveHeight(8),

    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    backgroundColor: '#FFECD1',
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    // width: responsiveWidth(100),
    // height: responsiveHeight(100),
    // overflow: 'hidden',
  },
  frameView: {
    top: 550,
    left: 32,
  },
  vectorParentFlexBox: {
    alignItems: 'center',
    flexDirection: 'row',
    width: 230,
  },
  orLoginWith: {
    textAlign: 'center',
    marginLeft: 120,
    marginTop: 50,
    // color: Color.darkslategray,
    fontFamily: FontFamily.dMSansRegular,
    // fontSize: FontSize.size_base,
  },
});

export default Login;
