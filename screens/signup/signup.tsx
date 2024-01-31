import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Regex from '../helpers/Regex';
import ErrorComponent from '../components/Error';
import Loader from '../helpers/loader';
import RBSheet from 'react-native-raw-bottom-sheet';

const SignUp = props => {
  let [driverNumber, setDriverNumber] = React.useState('');
  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');
  let [confirmPassword, setConfirmPassword] = React.useState('');
  let [firstName, setFirstName] = React.useState('');
  let [lastName, setLastName] = React.useState('');
  let [loader, setLoader] = React.useState(false);
  let [secureView, setSecureView] = React.useState(false);
  let [ConfromSecureView, setConformSecureView] = React.useState(false);
  let [newUser, setNewUser] = React.useState({});
  const [verifyCode, setVerifyCode] = React.useState('');

  const [error, setError] = React.useState({
    driverNumber: null,
    email: null,
    password: null,
    confirmPassword: null,
    firstName: null,
    lastName: null,
  });
  const refRBSheet = React.useRef();

  const CapitalizeFirstLetter = str => {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  };
  // React.useEffect(() => {
  //   refRBSheet.current.open();
  // }, []);
  const onSignUp = () => {
    setLoader(true);
    let isValid = true;
    var editErrorState = {...error};

    if (driverNumber.length === 0) {
      isValid = false;
      editErrorState.driverNumber = 'Please enter valid license plate number';
    } else {
      editErrorState.driverNumber = null;
    }

    if (!Regex.validateString(firstName)) {
      isValid = false;
      editErrorState.firstName = 'Please enter valid first name';
    } else {
      editErrorState.firstName = null;
    }

    if (!Regex.validateString(lastName)) {
      isValid = false;
      editErrorState.lastName = 'Please enter valid last name';
    } else {
      editErrorState.lastName = null;
    }

    if (!Regex.validateEmail(email)) {
      isValid = false;
      editErrorState.email = 'Please enter valid email address';
    } else {
      editErrorState.email = null;
    }

    if (password.length > 0 && password.length < 8) {
      isValid = false;
      editErrorState.password = 'The password must be between 8-16 characters';
    } else if (!Regex.validatePassword(password)) {
      isValid = false;
      editErrorState.password =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else {
      editErrorState.password = null;
    }

    if (confirmPassword.length > 0 && confirmPassword.length < 8) {
      isValid = false;
      editErrorState.confirmPassword =
        'The password must be between 8-16 characters';
    } else if (!Regex.validatePassword(confirmPassword)) {
      isValid = false;
      editErrorState.confirmPassword =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else if (password !== confirmPassword) {
      isValid = false;
      editErrorState.confirmPassword =
        'New password and confirm password should be same';
    } else {
      editErrorState.confirmPassword = null;
    }

    setError(editErrorState);

    if (isValid) {
      let data = {
        license: driverNumber,
        email: email,
        name: firstName + ' ' + lastName,
        role: 'user',
        // "role":"police",
        password: password,
      };
      fetch('http://35.154.76.187:3000/api/v1/users/signup', {
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

          console.log('responseJson', responseJson);
          if (responseJson.status === 'success') {
            setLoader(false);
            setNewUser(responseJson?.data?.newUser);
            // Alert.alert(
            //   'Congratulations, Your Account has been created successfully',
            // );
            setTimeout(() => {
              refRBSheet.current.open();
            }, 200);
            // setTimeout(() => {
            //   props.navigation.navigate('Login');
            // }, 1000);
          } else {
            setLoader(false);
            Alert.alert('This email is already registered');
          }
        })
        //If response is not in json then in error
        .catch(error => {
          //Error
          setLoader(false);
          console.error(error);
        });
    } else {
      setLoader(false);
      Alert.alert('Please enter valid records.');
    }
  };

  const onEmailVerification = async () => {
    setLoader(true);
    console.log('newUser?._id::', newUser?._id);
    await fetch(
      `http://35.154.76.187:3000/api/v1/users/verifyUserSignup/${newUser?._id}/${verifyCode}`,
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
            setTimeout(() => {
              props.navigation.navigate('Login');
            }, 500);
          } catch (error) {}
        } else {
          Alert.alert(responseJson.message);
        }
      })
      //If response is not in json then in error
      .catch(error => {
        //Error]
        refRBSheet.current.close();
        Alert.alert(error.message);
        console.error(error);
        setLoader(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFECD1'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.signUp}>
          <Loader value={loader} />

          <View style={styles.frameContainer}>
            <Text style={[styles.createAccount, styles.loginHereClr]}>
              Create Account
            </Text>
            <Text style={[styles.toGetStarted, styles.b1324801Typo]}>
              To get started now!
            </Text>
            <Image
              style={styles.frameChild}
              resizeMode="contain"
              source={require('../../assets/Frame1.png')}
            />
          </View>
          <View style={styles.frameParent}>
            <View style={{width: '80%'}}>
              <View style={styles.emailParent}>
                <Text style={[styles.badgeNumber, styles.loginHereClr]}>
                  License Plate Number
                </Text>
                <View>
                  <TextInput
                    // placeholder="Type Here"
                    value={driverNumber}
                    style={[styles.b1324801Wrapper, styles.wrapperFlexBox]}
                    onChangeText={txt => {
                      setDriverNumber(txt);
                      error.driverNumber = null;
                    }}
                  />
                  {error.driverNumber !== null ? (
                    <ErrorComponent
                      right={'left'}
                      errorMessage={error.driverNumber}
                    />
                  ) : null}
                  <Text style={[styles.b1324801, styles.b1324801Typo]}></Text>
                </View>
              </View>

              <View style={styles.emailParent}>
                <Text style={[styles.badgeNumber, styles.loginHereClr]}>
                  First Name
                </Text>
                <View>
                  <TextInput
                    // placeholder="Type Here"
                    value={firstName}
                    style={[styles.b1324801Wrapper, styles.wrapperFlexBox]}
                    onChangeText={txt => {
                      setFirstName(CapitalizeFirstLetter(txt));
                      error.firstName = null;
                    }}
                  />
                  {error.firstName !== null ? (
                    <ErrorComponent
                      right={'left'}
                      errorMessage={error.firstName}
                    />
                  ) : null}
                  <Text style={[styles.b1324801, styles.b1324801Typo]}></Text>
                </View>
              </View>

              <View style={styles.emailParent}>
                <Text style={[styles.badgeNumber, styles.loginHereClr]}>
                  Last Name
                </Text>
                <View>
                  <TextInput
                    // placeholder="Type Here"
                    value={lastName}
                    style={[styles.b1324801Wrapper, styles.wrapperFlexBox]}
                    onChangeText={txt => {
                      setLastName(CapitalizeFirstLetter(txt));
                      error.lastName = null;
                    }}
                  />
                  {error.lastName !== null ? (
                    <ErrorComponent
                      right={'left'}
                      errorMessage={error.lastName}
                    />
                  ) : null}
                  <Text style={[styles.b1324801, styles.b1324801Typo]}></Text>
                </View>
              </View>

              <View style={styles.emailParent}>
                <Text style={[styles.badgeNumber, styles.loginHereClr]}>
                  Email
                </Text>
                <View>
                  <TextInput
                    // placeholder="Type Here"
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={email}
                    style={[styles.b1324801Wrapper, styles.wrapperFlexBox]}
                    onChangeText={txt => {
                      setEmail(txt.toLowerCase());
                      error.email = null;
                    }}
                  />
                  {error.email !== null ? (
                    <ErrorComponent right={'left'} errorMessage={error.email} />
                  ) : null}
                  <Text style={[styles.b1324801, styles.b1324801Typo]}></Text>
                </View>
              </View>

              <View style={styles.emailParent}>
                <Text style={[styles.badgeNumber, styles.loginHereClr]}>
                  Password
                </Text>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      // placeholder="Type Here"
                      value={password}
                      style={[
                        styles.b1324801Wrapper,
                        styles.wrapperFlexBox,
                        {paddingRight: 50},
                      ]}
                      secureTextEntry={!secureView}
                      onChangeText={txt => {
                        setPassword(txt);
                        error.password = null;
                      }}
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
                  {error.password !== null ? (
                    <ErrorComponent
                      right={'left'}
                      errorMessage={error.password}
                    />
                  ) : null}
                  <Text style={[styles.b1324801, styles.b1324801Typo]}></Text>
                </View>
              </View>

              <View style={styles.emailParent}>
                <Text style={[styles.badgeNumber, styles.loginHereClr]}>
                  Confirm Password
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    // placeholder="Type Here"
                    value={confirmPassword}
                    secureTextEntry={!ConfromSecureView}
                    style={[styles.b1324801Wrapper, styles.wrapperFlexBox]}
                    onChangeText={txt => {
                      setConfirmPassword(txt);
                      error.confirmPassword = null;
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setConformSecureView(!ConfromSecureView);
                    }}
                    style={{
                      position: 'absolute',
                      alignSelf: 'center',
                      right: 15,
                    }}>
                    <Image
                      source={
                        ConfromSecureView
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

                <View>
                  {error.confirmPassword !== null ? (
                    <ErrorComponent
                      right={'left'}
                      errorMessage={error.confirmPassword}
                    />
                  ) : null}
                  <Text style={[styles.b1324801, styles.b1324801Typo]}></Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                onSignUp();
              }}
              style={[styles.signUpWrapper, styles.wrapperFlexBox]}>
              <Text style={[styles.signUp1, styles.signUp1Typo]}>Sign Up</Text>
            </TouchableOpacity>
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
              Or Sign Up With
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

          <View style={styles.alreadyHaveAnAccountParent}>
            <Text style={[styles.b1324801, styles.b1324801Typo]}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Login');
              }}>
              <Text style={[styles.loginHere, styles.loginHereClr]}>
                Login Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <RBSheet
        ref={refRBSheet}
        // closeOnDragDown={true}
        height={350}
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
        <View
          style={{alignItems: 'center', marginTop: 20, marginHorizontal: 10}}>
          <Text style={[styles.titleSheet, styles.emailClr]}>
            Verify Email Address
          </Text>

          <Text
            style={[
              styles.email,
              styles.emailClr,
              {
                fontSize: 17,
                marginTop: 10,
                textAlign: 'center',
                fontWeight: '400',
              },
            ]}>
            {`A code has been sent to:\n ${email}`}
          </Text>
          <View style={{marginTop: 20}}>
            <Text style={[styles.email, styles.emailClr]}>
              Verification Code
            </Text>
            <View>
              <TextInput
                value={verifyCode}
                autoCorrect={false}
                // keyboardType="email-address"
                onChangeText={(email: any) => setVerifyCode(email)}
                style={[styles.johnjacobgmailcomWrapper, styles.wrapperFlexBox]}
              />
              <Text
                style={[styles.johnjacobgmailcom, styles.goodToSeeTypo]}></Text>
            </View>
          </View>
          <TouchableOpacity
            disabled={verifyCode.length !== 6 ? true : false}
            onPress={() => {
              onEmailVerification();
            }}>
            <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
              <Text style={[styles.login1, styles.emailTypo]}>Validate</Text>
            </View>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text
              style={[
                styles.email,
                styles.emailClr,
                {
                  fontSize: 17,

                  textAlign: 'center',
                  fontWeight: '700',
                },
              ]}>
              Not seeing anything?
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text
                style={[
                  styles.email,
                  styles.emailClr,
                  {
                    paddingLeft: 5,
                    fontSize: 17,
                    textAlign: 'center',
                    fontWeight: '700',
                    textDecorationLine: 'underline',
                  },
                ]}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};
// };

const styles = StyleSheet.create({
  loginHereClr: {
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
  b1324801Typo: {
    fontFamily: FontFamily.dMSansRegular,
    textAlign: 'left',
    color: Color.teal,
  },
  signUp1Typo: {
    // fontFamily: FontFamily.dMSansBold,
    fontWeight: '700',
  },
  badgeNumber: {
    // fontSize: FontSize.size_sm,
    lineHeight: responsiveHeight(2.5),
    textAlign: 'left',
    fontFamily: FontFamily.dMSansRegular,
    fontWeight: '700',
    marginVertical: 5,
  },
  b1324801: {
    // fontSize: FontSize.size_base,
  },
  b1324801Wrapper: {
    borderStyle: 'solid',
    borderColor: '#15616d',
    borderWidth: 2,
    color: '#15616d',
    fontSize: 18,
  },
  emailParent: {
    marginTop: responsiveHeight(-1),
  },
  signUp1: {
    fontSize: FontSize.size_xl,
    color: '#fff',
    textAlign: 'left',
    fontFamily: 'DMSerifDisplay-italic',
  },
  signUpWrapper: {
    backgroundColor: Color.teal,
    justifyContent: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderColor: Color.teal,
  },
  frameParent: {
    marginTop: responsiveHeight(4),
    // left: responsiveWidth(10.8),
    alignItems: 'flex-end',

    // position: 'absolute',
  },
  loginHere: {
    marginLeft: 4,
    // fontSize: FontSize.size_base,
    textAlign: 'left',
    fontFamily: 'DMSerifDisplay-Regular',
    fontWeight: '900',
  },
  alreadyHaveAnAccountParent: {
    marginTop: responsiveHeight(6),
    // left: responsiveWidth(17),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    // position: 'absolute',
  },
  frameChild: {
    marginTop: responsiveHeight(3),
    // left: responsiveWidth(25),
    width: 56.5,
    height: responsiveHeight(2),
    // position: 'absolute',
  },
  createAccount: {
    // top: responsiveHeight(-2),
    // left: responsiveWidth(2),
    fontSize: responsiveFontSize(5),
    fontFamily: 'DMSerifDisplay-Regular',
    // textAlign: 'left',
    // position: 'absolute',
  },
  toGetStarted: {
    marginTop: 12,
    // left: 38,
    fontSize: 22,
    fontFamily: FontFamily.dMSansRegular,
    // fontSize: FontSize.size_5xl,
    // position: 'absolute',
  },
  frameContainer: {
    marginTop: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
    // left: responsiveWidth(18),
    // width: 267,
    // height: 143,
    // position: 'absolute',
  },
  signUp: {
    backgroundColor: '#FFECD1',
    flex: 1,
    alignItems: 'center',
    // width: '100%',
    // height: responsiveHeight(100),
    // overflow: 'hidden',
    // fontFamily: 'DMSerifDisplay-Regular',
  },
  frameParent1: {
    height: 48,
    marginTop: 27,
    flexDirection: 'row',
    width: 324,
  },
  image4Wrapper: {
    marginLeft: -75,
    marginTop: 5,
  },
  frameLayout: {
    height: 5,
    // borderRadius: Border.br_4xs,
    overflow: 'hidden',
    flex: 1,
  },
  frameInner: {
    marginLeft: 13,
  },
  frameView: {
    top: 550,
    left: 32,
    // position: 'absolute',
  },
  vectorParentFlexBox: {
    alignItems: 'center',
    flexDirection: 'row',
    width: 230,
  },
  orLoginWith: {
    textAlign: 'center',
    marginLeft: 120,
    marginTop: 155,
    // color: Color.darkslategray,
    fontFamily: FontFamily.dMSansRegular,
    // fontSize: FontSize.size_base,
  },
  loginWrapper: {
    backgroundColor: Color.teal,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Color.teal,
    //
  },
  login1: {
    fontSize: responsiveFontSize(2),
    color: '#FFECD1',
    textAlign: 'left',
    fontFamily: FontFamily.dMSansBold,
  },
  titleSheet: {
    // top: responsiveHeight(2),
    // left: 17,
    fontSize: responsiveFontSize(4),
    textAlign: 'left',
    fontWeight: '500',
    fontFamily: 'DMSerifDisplay-Regular',
  },
  johnjacobgmailcomWrapper: {
    borderStyle: 'solid',
    borderColor: '#15616d',
    borderWidth: 2,
    fontSize: 18,
    color: '#15616d',
  },
  emailClr: {
    color: Color.teal,
    textAlign: 'left',
  },
  johnjacobgmailcom: {
    fontSize: responsiveFontSize(1.6),
    textAlign: 'left',
    top: responsiveHeight(0.5),
  },
  goodToSeeTypo: {
    fontFamily: FontFamily.dMSansRegular,
    color: Color.teal,
  },
  email: {
    textAlign: 'left',
    // fontFamily: FontFamily.dMSansBold,
    fontWeight: '700',
  },
  emailTypo: {
    // fontFamily: FontFamily.dMSansBold,
    fontWeight: '700',
  },
});

export default SignUp;
