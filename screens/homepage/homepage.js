import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  AppState,
  Button,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  ActivityIndicator,
  
} from 'react-native';
import {
  FontFamily,
  FontSize,
  Border,
  Color,
  Padding,
} from '../globelstyle/globelstyle';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketIOClient from 'socket.io-client';
import VideoCallView from './../videocall'
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import styles from './styles';
import IconContainer from '../components/IconContainer';
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
} from 'react-native-agora';
import styles_new from './components/Style';
import requestCameraAndAudioPermission from './components/Permission';
const config = {
  appId: '53514afce1684f36b726b1025a33ec07',
  token: '',
  channelName: 'test',
};
import MicOff from '../../assets/MicOff';
import MicOn from '../../assets/MicOn';
import CallEnd from '../../assets/CallEnd';
import CallAnswer from '../../assets/CallAnswer';
import SwipeButton from 'rn-swipe-button';
import BackgroundFetch from 'react-native-background-fetch';
import Hotspot from '@react-native-tethering/hotspot';
import WifiManager from 'react-native-wifi-reborn';
import {NetworkInfo} from 'react-native-network-info';
import RNCallKeep from 'react-native-callkeep';
import WebrtcRoomScreen from '../videoroom';
import messaging from '@react-native-firebase/messaging';
import RBSheet from 'react-native-raw-bottom-sheet';
import Regex from '../helpers/Regex';
import ImagePicker from 'react-native-image-crop-picker';
import ErrorComponent from '../components/Error';
import ShareMedia, {Social} from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';

export default function Home({navigation}) {
  // const [socket, setSocket] = useState(null);
  const [localStream, setlocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [type, setType] = useState('JOIN');
  const otherUserId = useRef(null);
  const incomingname = useRef(null);
  const [incomingUser, setIncomingUser] = useState({});
  const incomingidentification = useRef(null);
  const [localMicOn, setlocalMicOn] = useState(true);
  const [localWebcamOn, setlocalWebcamOn] = useState(true);
  const [imageLoader, setImageLoader] = useState(false);
  const [image, setImageName] = useState('');
  const [id, setId] = useState('');
  const [userdata, setUserData] = useState({});
  const [appStateVisible, setAppStateVisible] = useState(AppState.current);
  let remoteRTCMessage = useRef(null);
  const socket = useRef(null);
  const candidates = useRef([]);
  let [driverNumber, setDriverNumber] = React.useState('');
  let [email, setEmail] = React.useState('');
  let [name, setName] = React.useState('');
  let [password, setPassword] = React.useState('');
  let [confirmPassword, setConfirmPassword] = React.useState('');
  let [loader, setLoader] = React.useState(false);
  let [secureView, setSecureView] = React.useState(false);
  let [ConfromSecureView, setConformSecureView] = React.useState(false);
const _engine = useRef(null);
  const [isJoined, setJoined] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [error, setError] = React.useState({
    driverNumber: null,
    email: null,
    password: null,
    confirmPassword: null,
    name: null,
  });
  const refRBSheet = React.useRef();
  const choseRBSheet = React.useRef();
  console.log('image>>>', image);
  var forceResetLastButton = null;
  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        
      ],
    }),
  );
  useEffect(() => {



    const checkWifiConnection = async () => {
      try {
       
       
        const isConnected = await WifiManager.getCurrentWifiSSID().then(
          ssid => {
            //  console.log("Your current connected wifi SSID is " + ssid);
            // clearInterval(intervalId);
            return ssid
          },
          () => {
            return 
          }
        );
        if (isConnected) {
          console.log('Wi-Fi connection found!');
          // Perform actions when Wi-Fi connection is found
        } else {
          autoConnectToWiFiByName()
        }
      } catch (error) {
        console.error('Error checking Wi-Fi connection:', error);
      }
    };
 // Set an interval to check the Wi-Fi connection every 5 seconds (adjust as needed)
 const intervalId = setInterval(checkWifiConnection, 10000);

 // Cleanup the interval on component unmount
 return () => clearInterval(intervalId);
   
  }, []); // Empty dependency array to run the effect only once when the component mounts

  
  useEffect(() => {
  
  });
  useEffect(() => {
    autoConnectToWiFiByName()
  }, []);
  useEffect(() => {
    setTimeout(() => {
      initLocalVideo();
    }, 7000);
  }, []);
  useEffect(() => {
    (async () => {
      PermissionsAndroid.requestMultiple([
        'android.permission.RECORD_AUDIO',
        'android.permission.CAMERA',
        'android.permission.NEARBY_WIFI_DEVICES',
        'android.permission.POST_NOTIFICATIONS',
        'android.permission.ACCESS_FINE_LOCATION',
      ]);
      requestUserPermission();
      onActionWifi();
      handleAppPermission();
    })();
  }, []);

  const newinit = async () => {
    const {appId} = config;
    _engine.current = await createAgoraRtcEngine();
    _engine.current.initialize({appId});
    _engine.current.setChannelProfile(
      ChannelProfileType.ChannelProfileLiveBroadcasting,
    );
    _engine.current.setClientRole(ClientRoleType.ClientRoleBroadcaster);
    _engine.current.enableVideo();
    _engine.current.startPreview();

    _engine.current.addListener('onUserJoined', (connection, uid) => {
      console.log('UserJoined', connection, uid);
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        // Add peer ID to state array
        setPeerIds(prev => [...prev, uid]);
      }
    });

    _engine.current.addListener('onUserOffline', (connection, uid) => {
      console.log('UserOffline', connection, uid);
      // Remove peer ID from state array
      setPeerIds(prev => prev.filter(id => id !== uid));
    });

    // If Local user joins RTC channel
    _engine.current.addListener('onJoinChannelSuccess', connection => {
      console.log('JoinChannelSuccess', connection);
      // Set state variable to true
      setJoined(true);
    });
  };

  const newstartCall = async () => {
    // Join Channel using null token and channel name
    await newinit();
    await _engine.current?.joinChannel(config.token, config.channelName, 0, {});
  };

  const newendCall = async () => {
    _engine.current?.leaveChannel();
    _engine.current?.removeAllListeners();
    try {
      _engine.current?.release();
    } catch (e) {
      console.log('release error:', e);
    }
leave()
    setPeerIds([]);
    setJoined(false);
  };

  const _newrenderVideos = () => {
    return isJoined ? (
      <View style={styles_new.fullView}>
        <RtcSurfaceView
          style={styles_new.max}
          canvas={{
            uid: 0,
          }}
        />
        {_newrenderRemoteVideos()}
      </View>
    ) : null;
  };

  const _newrenderRemoteVideos = () => {
    return (
      <ScrollView
        style={styles_new.remoteContainer}
        contentContainerStyle={styles_new.padding}
        horizontal={true}>
        {peerIds.map(id => {
          return (
            <RtcSurfaceView
              style={styles_new.remote}
              canvas={{
                uid: id,
              }}
              key={id}
            />
          );
        })}
      </ScrollView>
    );
  };

  const handleAppPermission = () => {
    const callKeepOptions = {
      ios: {
        appName: 'SafeStop',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription:
          'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'phone_account_icon',
        // additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
        // Required to get audio in background when using Android 11
        foregroundService: {
          channelId: 'com.safestop',
          channelName: 'Foreground service for my app',
          notificationTitle: 'My app is running on background',
          notificationIcon: 'Path to the resource icon of the notification',
        },
      },
    };
    RNCallKeep.setup(callKeepOptions);
    RNCallKeep.setAvailable(true);
  };

  useEffect(() => {
    InCallManager.start({media: 'video'});
    // InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);

    return () => {
      InCallManager.stop();
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        // The app has come back to the foreground, check for updates here.
        setAppStateVisible(nextAppState);
        onActionWifi();
      }
    };

    // Subscribe to AppState changes
    AppState.addEventListener('change', handleAppStateChange);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      WifiManager.setEnabled(false);
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [appStateVisible]);

  const onActionWifi = async () => {
    const wifi = await WifiManager.isEnabled();
    if (!wifi) {
      WifiManager.setEnabled(true);
    }
  };

  const onGalleryPress = async () => {
    const result = await ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      maxFiles: 1,
      cropping: true,
      includeBase64: false,
    });
    UplodeImage(result);
    choseRBSheet.current.close();
  };

  const onCameraPress = async () => {
    const result = await ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      maxFiles: 1,
      multiple: false,
      compressImageQuality: 0.8,
      includeBase64: false,
    });
    UplodeImage(result);
    choseRBSheet.current.close();
  };

  const UplodeImage = file => {
    var data = new FormData();
    const arrayPaths = file.path.split('/');
    const key = arrayPaths[arrayPaths.length - 1];
    data.append('image', {
      uri: file.path,
      type: file.mime,
      name: key,
    });

    fetch(`http://35.154.76.187:3000/api/v1/users/${userdata._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
      //Request Type
    })
      .then(response => response.json())
      //If response is in json then in success
      .then(responseJson => {
        //Success
        setLoader(false);
        console.log('GallryresponseJson', responseJson);
        if (responseJson.status === 'success') {
          Alert.alert('Your Profile has been updated successfully');
          fetchData();
        } else {
          Alert.alert(responseJson.message);
        }
      })
      //If response is not in json then in error
      .catch(error => {
        //Error
        setLoader(false);
        console.error(error);
      });
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'ios') {
      onGalleryPress();
    } else {
      try {
        onGalleryPress();
      } catch (err) {
        console.warn(err);
      }
      // } else {
      //   onGalleryPress();
      // }
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      onCameraPress();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
          onCameraPress();
        } else {
          Alert.alert('Oops!!', 'Permission not granted for Camera', [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
            {
              text: 'Cancel',
              style: 'destructive',
            },
          ]);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        // getToken();
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
        // getToken();
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const loginState = await AsyncStorage.getItem('LOGIN');
    let data = await JSON.parse(loginState);
    let newData = data.user;
    fetch(`http://35.154.76.187:3000/api/v1/users/${newData._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      //Request Type
    })
      .then(response => response.json())
      //If response is in json then in success
      .then(responseJson => {
        //Success
        if (responseJson.data) {
          console.log('responseJson.data.user):', responseJson.data.user);
          setUserData(responseJson.data.user);
          setPassword(responseJson.data.user.password || '');
          setConfirmPassword(responseJson.data.user.password || '');
          setEmail(responseJson.data.user.email || '');
          setName(responseJson.data.user.name || '');
          setDriverNumber(responseJson.data.user.license || '');
          if (responseJson.data?.user?.profilePicture) {
            setImageName(responseJson.data?.user?.profilePicture);
          }
        }
        setLoader(false);
        console.log('responseJson', responseJson);
      })
      //If response is not in json then in error
      .catch(error => {
        //Error
        setLoader(false);
        console.error(error);
      });
  };

  useEffect(() => {
    RNCallKeep.addEventListener('answerCall', async () => {
      RNCallKeep.backToForeground();
      let call_data = await AsyncStorage.getItem('call_data');
      await AsyncStorage.setItem('call_picked', '1');
      call_data = JSON.parse(call_data);
      console.log('call_data~~~~', call_data);
      RNCallKeep.endCall(call_data?.calleeId);
      setTimeout(() => {
        processAccept();
        setType('WEBRTC_ROOM');
      }, 2000);
      await AsyncStorage.removeItem('call_data');
      await AsyncStorage.removeItem('call_picked');
    });

    RNCallKeep.addEventListener('endCall', async () => {
      // console.log('In customer stackk navigator');
      let callData = await AsyncStorage.getItem('call_data');
      let isCallPicked = (await AsyncStorage.getItem('call_picked')) || '0';
      callData = JSON.parse(callData);
      leave();
      console.log('Customer Call Data ->', callData);
      await AsyncStorage.removeItem('call_data');
      await AsyncStorage.removeItem('call_picked');
      RNCallKeep.endAllCalls();
    });
  }, []);

  useEffect(async() => {
    try {
     
          // console.log('Device IP address:', ipAddress);
          const loginState = await AsyncStorage.getItem('LOGIN');
          let data = await JSON.parse(loginState);
          // setUserData(data.user);

          if (data) {
            let callerId = "";
            const newSocket = SocketIOClient('http://35.154.76.187:3500/', {
              transports: ['websocket'],
              query: {
                callerId,
              },
            });

            // setName(data.user.identification);
            setId(data.user._id);
            socket.current = newSocket;
            // setSocket(newSocket);
            newSocket.on('newCall', async data => {
              // remoteRTCMessage.current = data.rtcMessage;
              // if (peerConnection.current.remoteDescription === null) {
              //   await peerConnection.current.setRemoteDescription(
              //     new RTCSessionDescription(data.rtcMessage),
              //   );
              // }
              // setIncomingUser(data.name);
              // incomingname.current = data.name;
              // incomingidentification.current = data.identification;
              // otherUserId.current = data.callerId;
              // setlocalMicOn(true);
              console.log("react>>>>>>>>>>>>>>>>>>>>>>1")
              setType('INCOMING_CALL');
            });

            newSocket.on('callAnswered', async data => {
              remoteRTCMessage.current = data.rtcMessage;
              await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(data.rtcMessage),
              );
              console.log("react>>>>>>>>>>>>>>>>>>>>>2")
              setType('WEBRTC_ROOM');
            });

            newSocket.on('receivedata', async data => {
              console.log("react>>>>>>>>>>>>>>>>>>>>>>3")
              sendOfficerdataCall(data);
            });
           
            newSocket.on('callrejected', data => {
              console.log("react>>>>>>>>>>>>>>>>>>>>>>4")
              // newendCall()
              setRemoteStream(null);
              setlocalStream(null);
              peerConnection.current.close();
              // setType('JOIN');
              AsyncStorage.removeItem('call_data');
              AsyncStorage.removeItem('call_picked');
              setTimeout(() => {
                resetPeer();
                initLocalVideo();
              }, 200);
            });

            newSocket.on('ICEcandidate', data => {
              let message = data.rtcMessage;

              console.log('data.rtcMessage::', data.rtcMessage);

              setTimeout(() => {
                console.log(
                  'peerConnection.current.remoteDescription::',
                  peerConnection.current.remoteDescription,
                );
                if (peerConnection.current.remoteDescription !== null) {
                  if (peerConnection.current) {
                    if (message) {
                      peerConnection?.current
                        .addIceCandidate(
                          new RTCIceCandidate({
                            candidate: message.candidate,
                            sdpMLineIndex: message.label,
                            sdpMid: message.id,
                          }),
                        )
                        .then(data => {
                          console.log('New SUCCESS');
                        })
                        .catch(err => {
                          console.log('ICEcandidate Error', err);
                        });
                    }
                  }
                }
              }, 500);
            });

            // let isFront = true;
            // mediaDevices.enumerateDevices().then(sourceInfos => {
            //   let videoSourceId;
            //   for (let i = 0; i < sourceInfos.length; i++) {
            //     const sourceInfo = sourceInfos[i];
            //     if (
            //       sourceInfo.kind == 'videoinput' &&
            //       sourceInfo.facing == (isFront ? 'user' : 'environment')
            //     ) {
            //       videoSourceId = sourceInfo.deviceId;
            //     }
            //   }

            //   mediaDevices
            //     .getUserMedia({
            //       audio: true,
            //       video: {
            //         mandatory: {
            //           minWidth: 500, // Provide your own width, height and frame rate here
            //           minHeight: 300,
            //           minFrameRate: 30,
            //         },
            //         frameRate: 30,
            //         facingMode: isFront ? 'user' : 'environment',
            //         optional: videoSourceId
            //           ? [{sourceId: videoSourceId}]
            //           : [],
            //       },
            //     })
            //     .then(stream => {
            //       // Got stream!

            //       setlocalStream(stream);

            //       // setup stream listening
            //       stream.getTracks().forEach(track => {
            //         peerConnection.current.addTrack(track, stream);
            //       });
            //       // peerConnection.current.addStream(stream);
            //     })
            //     .catch(error => {
            //       console.log('error::', error);
            //       // Log error
            //     });
            // });
            initLocalVideo();
            registerPeerEvents();

            // peerConnection.current.addEventListener('track', event => {
            //   console.log('listener track event: ', event.streams);

            //   if (event.streams) {
            //     setTimeout(() => {
            //       setRemoteStream(event.streams[0]);
            //     }, 500);
            //   }
            // });

            // // Setup ice handling
            // peerConnection.current.onicecandidate = event => {
            //   setTimeout(() => {
            //     if (event.candidate) {
            //       sendICEcandidate({
            //         calleeId: otherUserId.current,
            //         rtcMessage: {
            //           label: event.candidate.sdpMLineIndex,
            //           id: event.candidate.sdpMid,
            //           candidate: event.candidate.candidate,
            //         },
            //       });
            //     } else {
            //       console.log('End of candidates.');
            //     }
            //   }, 500);
            // };
            return () => {
              newSocket.off('newCall');
              newSocket.off('callAnswered');
              newSocket.off('ICEcandidate');
              newSocket.off('callrejected');
              newSocket.off('receivedata');
              // BackgroundFetch.finish();
              // BackgroundFetch.stop();
            };
          }
        
    } catch (error) {
      console.error('Error retrieving connected devices:', error);
    }
  }, []);

  const updateSocket=()=>{
    try {
      NetworkInfo.getIPV4Address()
        .then(async ipAddress => {
          console.log('Device IP address:', ipAddress);
          const loginState = await AsyncStorage.getItem('LOGIN');
          let data = await JSON.parse(loginState);
          // setUserData(data.user);

          if (data) {
            let callerId = ipAddress;
            const newSocket = SocketIOClient('http://35.154.76.187:3500/', {
              transports: ['websocket'],
              query: {
                callerId,
              },
            });

            // setName(data.user.identification);
            setId(data.user._id);
            socket.current = newSocket;
            // setSocket(newSocket);
            newSocket.on('newCall', async data => {
              remoteRTCMessage.current = data.rtcMessage;
              if (peerConnection.current.remoteDescription === null) {
                await peerConnection.current.setRemoteDescription(
                  new RTCSessionDescription(data.rtcMessage),
                );
              }
              setIncomingUser(data.name);
              incomingname.current = data.name;
              incomingidentification.current = data.identification;
              otherUserId.current = data.callerId;
              setlocalMicOn(true);
              setType('INCOMING_CALL');
            });

            newSocket.on('callAnswered', async data => {
              remoteRTCMessage.current = data.rtcMessage;
              await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(data.rtcMessage),
              );
              setType('WEBRTC_ROOM');
            });

            newSocket.on('receivedata', async data => {
              sendOfficerdataCall(data);
            });

            newSocket.on('callrejected', data => {
              setRemoteStream(null);
              setlocalStream(null);
              peerConnection.current.close();
             newendCall()
              AsyncStorage.removeItem('call_data');
              AsyncStorage.removeItem('call_picked');
              setTimeout(() => {
                resetPeer();
                initLocalVideo();
              }, 200);
            });

            newSocket.on('ICEcandidate', data => {
              let message = data.rtcMessage;

              console.log('data.rtcMessage::', data.rtcMessage);

              setTimeout(() => {
                console.log(
                  'peerConnection.current.remoteDescription::',
                  peerConnection.current.remoteDescription,
                );
                if (peerConnection.current.remoteDescription !== null) {
                  if (peerConnection.current) {
                    if (message) {
                      peerConnection?.current
                        .addIceCandidate(
                          new RTCIceCandidate({
                            candidate: message.candidate,
                            sdpMLineIndex: message.label,
                            sdpMid: message.id,
                          }),
                        )
                        .then(data => {
                          console.log('New SUCCESS');
                        })
                        .catch(err => {
                          console.log('ICEcandidate Error', err);
                        });
                    }
                  }
                }
              }, 500);
            });

            // let isFront = true;
            // mediaDevices.enumerateDevices().then(sourceInfos => {
            //   let videoSourceId;
            //   for (let i = 0; i < sourceInfos.length; i++) {
            //     const sourceInfo = sourceInfos[i];
            //     if (
            //       sourceInfo.kind == 'videoinput' &&
            //       sourceInfo.facing == (isFront ? 'user' : 'environment')
            //     ) {
            //       videoSourceId = sourceInfo.deviceId;
            //     }
            //   }

            //   mediaDevices
            //     .getUserMedia({
            //       audio: true,
            //       video: {
            //         mandatory: {
            //           minWidth: 500, // Provide your own width, height and frame rate here
            //           minHeight: 300,
            //           minFrameRate: 30,
            //         },
            //         frameRate: 30,
            //         facingMode: isFront ? 'user' : 'environment',
            //         optional: videoSourceId
            //           ? [{sourceId: videoSourceId}]
            //           : [],
            //       },
            //     })
            //     .then(stream => {
            //       // Got stream!

            //       setlocalStream(stream);

            //       // setup stream listening
            //       stream.getTracks().forEach(track => {
            //         peerConnection.current.addTrack(track, stream);
            //       });
            //       // peerConnection.current.addStream(stream);
            //     })
            //     .catch(error => {
            //       console.log('error::', error);
            //       // Log error
            //     });
            // });
            initLocalVideo();
            registerPeerEvents();

            // peerConnection.current.addEventListener('track', event => {
            //   console.log('listener track event: ', event.streams);

            //   if (event.streams) {
            //     setTimeout(() => {
            //       setRemoteStream(event.streams[0]);
            //     }, 500);
            //   }
            // });

            // // Setup ice handling
            // peerConnection.current.onicecandidate = event => {
            //   setTimeout(() => {
            //     if (event.candidate) {
            //       sendICEcandidate({
            //         calleeId: otherUserId.current,
            //         rtcMessage: {
            //           label: event.candidate.sdpMLineIndex,
            //           id: event.candidate.sdpMid,
            //           candidate: event.candidate.candidate,
            //         },
            //       });
            //     } else {
            //       console.log('End of candidates.');
            //     }
            //   }, 500);
            // };
            return () => {
              newSocket.off('newCall');
              newSocket.off('callAnswered');
              newSocket.off('ICEcandidate');
              newSocket.off('callrejected');
              newSocket.off('receivedata');
              // BackgroundFetch.finish();
              // BackgroundFetch.stop();
            };
          }
        })
        .catch(error => {
          console.error('Error getting IP address:', error);
        });
    } catch (error) {
      console.error('Error retrieving connected devices:', error);
    }
  }
  const registerPeerEvents = () => {
    peerConnection.current.addEventListener('track', event => {
      // remoteStream.addTrack(event);
      setTimeout(() => {
        setRemoteStream(event.streams[0]);
      }, 500);
    });

    // Setup ice handling
    peerConnection.current.addEventListener('icecandidate', event => {
      console.log('event-----------------------', event);
      setTimeout(() => {
        if (event.candidate) {
          sendICEcandidate({
            calleeId: otherUserId.current,
            rtcMessage: {
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            },
          });
        } else {
          console.log('End of candidates.');
        }
      }, 500);
    });
  };

  const initLocalVideo = () => {
    let isFront = true;

    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'user' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30,
            },
            frameRate: 30,
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then(stream => {
          // Got stream!

          setlocalStream(stream);

          // setup stream listening
          stream.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, stream);
          });
          // peerConnection.current.addStream(stream);
        })
        .catch(error => {
          console.log('error::', error);
          // Log error
        });
    });
  };

  // useEffect(() => {
  //   if (type === 'WEBRTC_ROOM') {
  //     let isFront = true;
  //     mediaDevices.enumerateDevices().then(sourceInfos => {
  //       let videoSourceId;
  //       for (let i = 0; i < sourceInfos.length; i++) {
  //         const sourceInfo = sourceInfos[i];
  //         if (
  //           sourceInfo.kind == 'videoinput' &&
  //           sourceInfo.facing == (isFront ? 'user' : 'environment')
  //         ) {
  //           videoSourceId = sourceInfo.deviceId;
  //         }
  //       }

  //       mediaDevices
  //         .getUserMedia({
  //           audio: true,
  //           video: {
  //             mandatory: {
  //               minWidth: 500, // Provide your own width, height and frame rate here
  //               minHeight: 300,
  //               minFrameRate: 30,
  //             },
  //             frameRate: 30,
  //             facingMode: isFront ? 'user' : 'environment',
  //             optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
  //           },
  //         })
  //         .then(stream => {
  //           // Got stream!

  //           setlocalStream(stream);

  //           // setup stream listening
  //           stream.getTracks().forEach(track => {
  //             peerConnection.current.addTrack(track, stream);
  //           });
  //           // peerConnection.current.addStream(stream);
  //         })
  //         .catch(error => {
  //           console.log('error::', error);
  //           // Log error
  //         });
  //     });
  //   }
  // }, [type]);

  async function sendICEcandidate(data) {
    await socket.current.emit('ICEcandidate', data);
  }

  const onEditProfile = () => {

    setLoader(true);
    let isValid = true;
    var editErrorState = {...error};

    if (name.length === 0) {
      isValid = false;
      editErrorState.name = 'Please enter valid name';
    } else {
      editErrorState.name = null;
    }

    if (driverNumber.length === 0) {
      isValid = false;
      editErrorState.driverNumber = 'Please enter valid license plate number';
    } else {
      editErrorState.driverNumber = null;
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
      var data = new FormData();
      data.append('name', name);
      data.append('password', password);
      data.append('license', driverNumber);

      fetch(`http://35.154.76.187:3000/api/v1/users/${userdata._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data,
        //Request Type
      })
        .then(response => response.json())
        //If response is in json then in success
        .then(responseJson => {
          //Success
          setLoader(false);
          console.log('responseJson', responseJson);
          if (responseJson.status === 'success') {
            refRBSheet.current.close();
            Alert.alert('Your Account has been updated successfully');
            fetchData();
          } else {
            Alert.alert(responseJson.message);
          }
        })
        //If response is not in json then in error
        .catch(error => {
          //Error
          setLoader(false);
          console.error(error);
        });
    } else {
      // setLoader(false);
      // Alert.alert('Please enter valid records.');
    }
  };

  async function processAccept() {
    // await peerConnection.current.setRemoteDescription(
    //   new RTCSessionDescription(remoteRTCMessage.current),
    // );
    // setlocalMicOn(true);
    const sessionDescription = await peerConnection.current.createAnswer();
    // await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  function answerCall(data) {
    socket.current.emit('answerCall', data);
  }

  async function sendOfficerdataCall(data) {
    console.log('new receivedata::', data);
    NetworkInfo.getIPV4Address().then(async ipAddress => {
      const loginState = await AsyncStorage.getItem('LOGIN');
      let checkToken = await AsyncStorage.getItem('fcmToken');
      let officerdata = await JSON.parse(loginState);
      let newData = officerdata.user;
      fetch(`http://35.154.76.187:3000/api/v1/users/${newData._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        //Request Type
      })
        .then(response => response.json())
        //If response is in json then in success
        .then(responseJson => {
          //Success
          if (responseJson.data) {
            let sendofficer = {
              callerId: data.callee,
              ipAddress: ipAddress,
              officerdata: responseJson.data.user,
              fcmtoken: checkToken,
            };
            socket.current.emit('senddataofficer', sendofficer);
          }
        });
    });
  }

  function sendCall(data) {
    socket.current.emit('call', data);
  }

  function endCall(data) {
    socket.current.emit('endCall', data);
  }
  const logout = async () => {
    await Alert.alert('Hello!', 'Are you sure you want to logout?', [
      {
        text: 'Yes',
        onPress: () => {
          WifiManager.setEnabled(false);
          WifiManager.disconnect();
          socket.current.disconnect();
          socket.current.close();
          // peerConnection.current.close();
          // auth().signOut();
          AsyncStorage.clear();
          navigation.replace('Login');
        },
      },
      {
        text: 'No',
        style: 'destructive',
      },
    ]);
  };

  const onDeleteAccount = async () => {
    await Alert.alert(
      'Hello!',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Yes',
          onPress: () => {
            onFetchDelete();
          },
        },
        {
          text: 'No',
          style: 'destructive',
        },
      ],
    );
  };

  const onFetchDelete = async () => {
    setLoader(true);
    const loginState = await AsyncStorage.getItem('LOGIN');
    let officerdata = await JSON.parse(loginState);
    let newData = officerdata.user;

    fetch(`http://35.154.76.187:3000/api/v1/users/${newData._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      //Request Type
    })
      .then(response => response.json())
      //If response is in json then in success
      .then(responseJson => {
        if (responseJson.status === 'success') {
          setLoader(false);
          console.log('Delete responseJson:::::::::', responseJson);
          //Success
          WifiManager.setEnabled(false);
          WifiManager.disconnect();
          socket.current.disconnect();
          socket.current.close();
          // peerConnection.current.close();
          // auth().signOut();
          AsyncStorage.clear();
          navigation.replace('Login');
        } else {
          Alert.alert('Something went wrong');
        }
      })
      .catch(error => {
        Alert.alert('Something went wrong');
        setLoader(false);
        console.error('error===', error);
      });
  };

  function switchCamera() {
    localStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
  }

  function toggleCamera() {
    setlocalWebcamOn(!localWebcamOn);
    // localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
    localStream.getVideoTracks().forEach(track => {
      localWebcamOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function toggleUnMic() {
    setlocalMicOn(true);
    // localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    _engine.current?.muteLocalVideoStream(true)
  }
  function toggleMic() {
    setlocalMicOn(false);
    // localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    _engine.current?.muteLocalVideoStream(false)
  }

  function leave() {
    
    setType('JOIN');
    AsyncStorage.removeItem('call_data');
    AsyncStorage.removeItem('call_picked');
    endCall({calleeId: otherUserId.current});
  
  }

  const resetPeer = () => {
    const newPeerConnection = new RTCPeerConnection({
      iceServers: [
       
      ],
    });
    peerConnection.current = newPeerConnection;
    registerPeerEvents();
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  console.log('imagecontainer::', imageLoader);
  const LoadingView = () => {
    return (
      <View style={styles.imagecontainer}>
        <ActivityIndicator size={30} color="blue" />
      </View>
    );
  };

  // const ShareApp = async social => {
    
  //   if (social === 'linkedin') {
  //     const url = 'https://play.google.com/store/apps/details?id=com.safestop'; // Replace with the URL you want to share
  //     const encodedUrl = encodeURIComponent(url);
  //     const instagramUrl = `https://www.linkedin.com/messaging/compose/?msg=${encodedUrl}`;
  //     console.log('instagramUrl:', instagramUrl);
  //     try {
  //       await Linking.openURL(instagramUrl);
  //     } catch (error) {
  //       console.error('Failed to open Instagram:', error);
  //     }
  //   } else {
  //     let options = {
  //       message: 'this is Safe Wise share',
  //       url: 'https://play.google.com/store/apps/details?id=com.safestop',
  //       social: social,
  //       // forceDialog: true,
  //     };
  //     console.log('options::', options);
  //     try {
  //       ShareMedia.shareSingle(options);
  //     } catch (error) {
  //       console.log('Error =>', error);
  //       // setResult('error: '.concat(getErrorString(error)));
  //     }
  //   }
  // };
  const allShareApp = async social => {
    let options = {
      message: 'https://play.google.com/store/apps/details?id=com.safestop',
    };
    try {
      Share.share(options);
    } catch (error) {
      console.log('Error =>', error);
      // setResult('error: '.concat(getErrorString(error)));
    }
  };

  const CapitalizeFirstLetter = str => {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  };


  const autoConnectToWiFiByName = () => {
    // Replace 'TargetWiFiSSID' with the SSID of the WiFi network you want to connect to
    const targetWiFiSSID = 'TargetWiFiSSID';

    // Check if WiFi is enabled
    WifiManager.isEnabled().then((enabled) => {
     
      if (enabled) {
      
        WifiManager.connectToProtectedSSID("Test", "12345678", true,false).then(
          () => {
            updateSocket()
          },
          () => {
            console.log("Connection failed!");
          }
        );
       
      } else {
        Alert.alert('WiFi is not enabled.');
      }
    });
  };
// const autoConnectToWiFiByName = () => {
//     // Replace 'TargetWiFiSSID' with the SSID of the WiFi network you want to connect to
//     const targetWiFiSSID = "TargetWiFiSSID";

//     // Check if WiFi is enabled
//     WifiManager.isEnabled().then((enabled) => {
//       if (enabled) {
//         new Promise((resolve, reject)=>{
//           WifiManager.connectToProtectedSSID(
//             "Test",
//             "12345678",
//             true,
//             false
//           )
//           resolve("connected")
//         })
//        .then(
//           () => {
//             updateSocket();
//           },
//           () => {
//             console.log("Connection failed!");
//           }
//         ).catch((err) => {});

//       } else {
//         Alert.alert("WiFi is not enabled.");
//       }
//     });
//   };
  const JoinScreen = () => {
    return (
      <View style={styles.home}>
        <View style={styles.frameParent}>
          <Image
            style={styles.frameChild}
            resizeMode="contain"
            source={require('../../assets/Frame4.png')}
          />
          <Text
            style={[
              styles.safeStop,
              {
                fontFamily: 'DMSerifDisplay-Regular',
                textAlign: 'left',
              },
            ]}>
            Stop Wise
          </Text>
          {/* <TouchableOpacity
            onPress={() => logout()}
            style={{
              // paddingLeft: 20,
              position: 'absolute',
              right: -100,
            }}>
            <Image
              style={{width: 25, height: 40, marginLeft: 2}}
              resizeMode="contain"
              source={require('../../assets/logout.png')}
            />
          </TouchableOpacity> */}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: responsiveHeight(4),
          }}>
          <ImageBackground
            source={require('../../assets/Rectangle13.png')}
            resizeMode="stretch"
            style={{
              width: Dimensions.get('window').width,
              // height: Dimensions.get('window').height/1.25,
              flex: 1,
              // paddingTop: responsiveHeight(9),
              alignItems: 'center',
            }}>
            <View style={styles.vectorParent}>
              <View style={[styles.ellipseParent]}>
                <View
                  style={[
                    styles.frameInner,
                    {
                      backgroundColor: '#ffecd1',
                      borderRadius: 250,
                      borderWidth: 10,
                      borderColor: '#ffecd1',
                    },
                  ]}>
                  <Image
                    resizeMode="cover"
                    style={{height: '100%', width: '100%', borderRadius: 250}}
                    onLoadStart={() => setImageLoader(true)}
                    onLoadEnd={() => setImageLoader(false)}
                    source={
                      image
                        ? {uri: image}
                        : require('../../assets/Driverdefaulticon.png')
                    }
                  />
                  {/* {imageLoader && <LoadingView />} */}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    choseRBSheet.current.open();
                  }}
                  activeOpacity={0.8}
                  style={{
                    height: 70,
                    width: 70,
                    position: 'absolute',
                    right: 0,
                    top: 100,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{height: '100%', width: '100%'}}
                    source={require('../../assets/Frame2470.png')}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.frameContainer}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    marginTop: 50,
                  }}>
                  <View style={styles.janeParent}>
                    <Text style={[styles.jane, styles.janeTypo]}>
                      {userdata?.name}
                    </Text>
                  </View>
                  <View style={styles.dlF45312434Wrapper}>
                    <Text
                      style={[styles.dlF45312434, styles.dlF45312434Layout]}>
                      {userdata?.license}
                    </Text>
                  </View>
                  {/* as a refresh condii */}
 {/* <View>
      <TouchableOpacity style={{width:60,height:60, borderWidth:1}}onPress={autoConnectToWiFiByName} >
        </TouchableOpacity>
    </View> */}
                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={[
                      styles.systemIconseditParent,
                      styles.frameWrapperBorder,
                    ]}>
                    <View style={styles.systemIconsedit}>
                      <Image
                        style={styles.icon}
                        resizeMode="cover"
                        source={require('../../assets/icon.png')}
                      />
                    </View>
                    <Text
                      style={[styles.editProfile, styles.dlF45312434Layout]}>
                      Edit Profile
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{flex: 0.65, justifyContent: 'flex-end', bottom: 15}}>
                <View style={styles.frameGroup}>
                  <View style={{width: '100%', marginTop: 40}}>
                    <View
                      style={{
                        height: 2,
                        backgroundColor: '#FFECD1',
                        width: '100%',
                        // borderWidth: 1,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: FontFamily.dMSansRegular,
                        color: '#FFECD1',
                        position: 'absolute',
                        alignSelf: 'center',
                        top: -10,
                        backgroundColor: '#15616D',
                        paddingHorizontal: 20,
                      }}>
                      Share Stop Wise with your friends
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.socialIconsParent,
                      styles.vectorGroupFlexBox,
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(
                          'https://play.google.com/store/apps/details?id=com.safestop',
                        );
                        Alert.alert('Copied to clipboard');
                      }}>
                      <Image
                        style={{height: 48, width: 48}}
                        resizeMode="contain"
                        source={require('../../assets/files1.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => allShareApp()}>
                      <Image
                        style={[styles.socialIconsLayout]}
                        resizeMode="contain"
                        source={require('../../assets/SocialIcons.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {allShareApp()
                      }}>
                      <Image
                        style={styles.socialLayout}
                        resizeMode="contain"
                        source={require('../../assets/Instagramlogo.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => allShareApp()}>
                      <Image
                        style={styles.socialLayout}
                        resizeMode="contain"
                        source={require('../../assets/Facebook1.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => allShareApp()}>
                      <Image
                        style={styles.socialLayout}
                        resizeMode="contain"
                        source={require('../../assets/Frame2512.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <RBSheet
          ref={refRBSheet}
          // closeOnDragDown={true}
          height={Dimensions.get('screen').height / 1.3}
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
          <View style={{alignItems: 'center', marginTop: 20, flex: 1}}>
            <Text style={[styles.titleSheet, styles.emailClr]}>
              Edit Profile
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
                paddingBottom: 30,
              }}
              style={{
                width: '100%',
                height: '100%',
              }}>
              <View style={{width: '80%'}}>
                <View style={[styles.emailParent, {marginTop: 20}]}>
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

                <View style={[styles.emailParent]}>
                  <Text style={[styles.badgeNumber, styles.loginHereClr]}>
                    Name
                  </Text>
                  <View>
                    <TextInput
                      // placeholder="Type Here"
                      value={name}
                      // editable={false}
                      style={[styles.b1324801Wrapper, styles.wrapperFlexBox]}
                      onChangeText={txt => {
                        setName(CapitalizeFirstLetter(txt));
                        error.name = null;
                      }}
                    />
                    {error.name !== null ? (
                      <ErrorComponent
                        right={'left'}
                        errorMessage={error.name}
                      />
                    ) : null}
                    <Text style={[styles.b1324801, styles.b1324801Typo]}></Text>
                  </View>
                </View>

                <View style={[styles.emailParent]}>
                  <Text style={[styles.badgeNumber, styles.loginHereClr]}>
                    Email
                  </Text>
                  <View>
                    <TextInput
                      // placeholder="Type Here"
                      value={email}
                      editable={false}
                      style={[styles.b1324801Wrapper, styles.wrapperFlexBox]}
                      onChangeText={txt => {
                        setEmail(txt.toLowerCase());
                        error.email = null;
                      }}
                    />
                    {error.email !== null ? (
                      <ErrorComponent
                        right={'left'}
                        errorMessage={error.email}
                      />
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
                  <TouchableOpacity
                    onPress={() => {
                      onEditProfile();

                      // setForgotType('EMAIL');
                    }}>
                    <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
                      <Text style={[styles.login1, styles.emailTypo]}>
                        Save
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 2,
                      backgroundColor: Color.teal,
                      marginVertical: 25,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      logout();
                    }}>
                    <View
                      style={[
                        styles.loginWrapper,
                        styles.wrapperFlexBox,
                        {
                          backgroundColor: '#FFECD1',
                          borderWidth: 2,
                          borderColor: '#78290F',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.login1,
                          styles.emailTypo,
                          {color: '#78290F'},
                        ]}>
                        Log Out
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{marginTop: 20}}
                    onPress={() => {
                      onDeleteAccount();
                    }}>
                    <View
                      style={[
                        styles.loginWrapper,
                        styles.wrapperFlexBox,
                        {backgroundColor: '#78290F'},
                      ]}>
                      <Text style={[styles.login1, styles.emailTypo]}>
                        Delete Account
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </RBSheet>
        <RBSheet
          ref={choseRBSheet}
          // closeOnDragDown={true}
          height={Dimensions.get('screen').height / 3.5}
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
              Select From
            </Text>
            <TouchableOpacity
              style={{marginTop: 30}}
              onPress={() => {
                requestCameraPermission();
                refRBSheet.current.close();
              }}>
              <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
                <Text style={[styles.login1, styles.emailTypo]}>Camera</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginTop: 30}}
              onPress={() => {
                requestGalleryPermission();
                refRBSheet.current.close();
              }}>
              <View style={[styles.loginWrapper, styles.wrapperFlexBox]}>
                <Text style={[styles.login1, styles.emailTypo]}>Gallery</Text>
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>
        {/* <Modal visible={false} transparent>
          <View style={{justifyContent: 'center', flex: 1}}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                margin: 20,
                borderRadius: 10,
              }}>
              <Text>Hello</Text>
            </View>
          </View>
        </Modal> */}
      </View>
    );
  };

  const OutgoingCallScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#D0D4DD',
            }}>
            Calling to...
          </Text>

          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
              letterSpacing: 6,
            }}>
            {otherUserId.current}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              leave();
            }}
            style={{
              backgroundColor: '#FF5D5D',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallEnd width={50} height={12} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const IncomingCallScreen = () => {
    return (
      <View style={styles.home}>
        <View style={styles.frameParent}>
          <Image
            style={styles.frameChild}
            resizeMode="contain"
            source={require('../../assets/Frame4.png')}
          />
          <Text
            style={[
              styles.safeStop,
              {
                fontFamily: 'DMSerifDisplay-Regular',
                textAlign: 'left',
              },
            ]}>
            Stop Wise
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: responsiveHeight(4),
          }}>
          <ImageBackground
            source={require('../../assets/officerVector1.png')}
            resizeMode="stretch"
            style={{
              width: Dimensions.get('window').width,
              // height: Dimensions.get('window').height/1.25,
              flex: 1,
              // paddingTop: responsiveHeight(9),
              alignItems: 'center',
            }}>
            <View style={styles.vectorParent}>
              <View style={styles.ellipseParent}>
                <View
                  style={[
                    styles.frameInner,
                    {
                      backgroundColor: '#ffecd1',
                      borderRadius: 250,
                      borderWidth: 10,
                      borderColor: '#ffecd1',
                    },
                  ]}>
                  <Image
                    resizeMode="cover"
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 250,
                    }}
                    source={
                      incomingUser.profilePicture
                        ? {uri: incomingUser?.profilePicture}
                        : require('../../assets/Policeicon.png')
                    }
                  />
                </View>
              </View>

              <View style={styles.frameContainer}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#FFECD1',
                      fontFamily: FontFamily.dMSansRegular,
                    }}>
                    Officer
                  </Text>
                  <View style={styles.janeParent}>
                    <Text style={[styles.jane, styles.janeTypo]}>
                      {incomingUser.name}
                    </Text>
                  </View>
                  <View style={styles.dlF45312434Wrapper}>
                    <Text
                      style={[styles.dlF45312434, styles.dlF45312434Layout]}>
                      {'Badge #:  ' + incomingidentification.current}
                    </Text>
                  </View>
                </View>
                <View
                  style={{flex: 0.65, justifyContent: 'flex-end', bottom: 15}}>
                  <SwipeButton
                    width={350}
                    height={60}
                    containerStyles={{paddingHorizontal: 8}}
                    disableResetOnTap
                    forceReset={reset => {
                      forceResetLastButton = reset;
                    }}
                    railBackgroundColor="#FFECD1"
                    thumbIconImageSource={require('../../assets/Frame22492.png')}
                    railStyles={{
                      backgroundColor: '#FFECD1',
                      borderWidth: 0,
                      paddingVertical: 10,
                    }}
                    thumbIconBorderColor="#78290F"
                    // thumbIconStyles={{height: 80, width: 80}}
                    onSwipeSuccess={() => {
                    processAccept();
                      setType('WEBRTC_ROOM');
                      newstartCall()
                      forceResetLastButton();
                    
                    }}
                    thumbIconBackgroundColor="#FFFFFF"
                    title="Swipe For Video Call"
                  />
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };

  const WebrtcRoomScreen = () => {
   
    return (
    
      <View style={styles_new.max}>
      <View style={styles_new.max}>
      
        {_newrenderVideos()}
        <View style={styles_new.buttonHolder}>
        <View
          style={{
            overflow: 'hidden',
            flexDirection: 'row',
            justifyContent: 'space-between',
            position:'absolute',
            bottom:0,
            backgroundColor: '#FFECD1',
            paddingVertical: 20,
            borderTopWidth: 7,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingHorizontal: 40,
            borderTopColor: '#15616D',
            borderLeftWidth: 7,
            borderLeftColor: '#15616D',
            borderRightColor: '#15616D',
            borderRightWidth: 7,
            width: '103%',
            left: -5,
          }}>
          <View>
           
          { localMicOn ? <IconContainer
              style={{
                borderWidth: 2,
                borderColor: '#15616D',
              }}
              backgroundColor={!localMicOn ? '#FFECD1' : 'transparent'}
              onPress={() => {
                toggleMic();
              }}
              Icon={() => {
                return   <MicOn height={40} width={40} fill="#15616D" />
                
              }}
            />: <IconContainer
            style={{
              borderWidth: 2,
              borderColor: '#15616D',
            }}
            backgroundColor={!localMicOn ? '#FFECD1' : 'transparent'}
            onPress={() => {
              toggleUnMic();
            }}
            Icon={() => {
              return( <MicOff height={45} width={45} fill="#15616D" />)
              
            }}
          />}
            <Text
              style={{
                color: '#15616D',
                fontSize: 15,
                alignSelf: 'center',
                paddingTop: 5,
                fontFamily: FontFamily.dMSansBold,
              }}>
              {localMicOn ? 'UnMute' : 'Mute'}
            </Text>
          </View>
          <View>
            <IconContainer
              backgroundColor={'#15616D'}
              onPress={() => {
                newendCall()
              }}
              Icon={() => {
                return <CallEnd height={40} width={40} fill="#FFECD1" />;
              }}
            />
            <Text
              style={{
                color: '#15616D',
                fontSize: 15,
                alignSelf: 'center',
                paddingTop: 5,
                fontFamily: FontFamily.dMSansBold,
              }}>
              End
            </Text>
          </View>
        </View>
          {/* <TouchableOpacity onPress={newstartCall} style={styles_new.button}>
            <Text style={styles_new.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={newendCall} style={styles_new.button}>
            <Text style={styles_new.buttonText}> End Call </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
      // <View
      //   style={{
      //     flex: 1,
      //     backgroundColor: '#050A0E',
      //   }}>
      //   <View style={{flex: 1}}>
      //     {remoteStream && (
      //       <>
      //         <RTCView
      //           objectFit={'cover'}
      //           style={{
      //             flex: 1,
      //             backgroundColor: '#050A0E',
      //             marginBottom: -50,
      //             height: Dimensions.get('screen').height,
      //             width: Dimensions.get('screen').width,
      //           }}
      //           streamURL={remoteStream.toURL()}
      //         />
      //         {localStream && (
      //           <RTCView
      //             objectFit={'cover'}
      //             style={{
      //               flex: 1,
      //               width: 150,
      //               height: 200,
      //               position: 'absolute',
      //               right: 15,
      //               top: 20,
      //               backgroundColor: '#050A0E',
      //             }}
      //             streamURL={localStream.toURL()}
      //           />
      //         )}
      //       </>
      //     )}

      //     {!remoteStream && (
      //       <>
      //         {localStream && (
      //           <RTCView
      //             objectFit={'cover'}
      //             style={{
      //               flex: 1,
      //               width: 150,
      //               height: 200,
      //               position: 'absolute',
      //               right: 15,
      //               top: 20,
      //               backgroundColor: '#050A0E',
      //             }}
      //             streamURL={localStream.toURL()}
      //           />
      //         )}
      //       </>
      //     )}
      //   </View>
      
      // </View>
    );
  };

  switch (type) {
    case 'JOIN':
      return JoinScreen();
    case 'INCOMING_CALL':
      return IncomingCallScreen();
    case 'OUTGOING_CALL':
      return OutgoingCallScreen();
    case 'WEBRTC_ROOM':
      return WebrtcRoomScreen();
    default:
      return null;
  }
}
