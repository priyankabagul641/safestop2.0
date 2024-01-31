import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  Button,
  ImageBackground,
  Platform,
  AppState,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import ContentView from '../components/ContentView';
import VideoCallView from './../videocall'
import { search_white_icon, message, expert_icon } from '../constants/assets';
import { moderateScale } from '../helpers/ResponsiveFonts';


import styles from './styles';
import TextInputWithLabel from '../components/TextInputWithLabel';
// import auth from '@react-native-firebase/auth';
import Loader from '../helpers/loader';
// import firestore from '@react-native-firebase/firestore';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketIOClient from 'socket.io-client';
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
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import IconContainer from '../components/IconContainer';
import MicOff from '../../assets/MicOff';
import MicOn from '../../assets/MicOn';
import VideoOn from '../../assets/VideoOn';
import VideoOff from '../../assets/VideoOff';
import CallEnd from '../../assets/CallEnd';
import CallAnswer from '../../assets/CallAnswer';
import CameraSwitch from '../../assets/CameraSwitch';
import { FontFamily } from '../globelstyle/globelstyle';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Hotspot from '@react-native-tethering/hotspot';
import { NetworkInfo } from 'react-native-network-info';
import axios from 'axios';
import RNCallKeep from 'react-native-callkeep';
import messaging from '@react-native-firebase/messaging';
var groupData = [];
const SERVER_KEY =
  'AAAAVaAZkcE:APA91bGN_uINc_xV_EZ4UFY4olDBFMsYwnZRo-rjH3z6m7c_iPlkFaFChW42Q7rUbCI6JOpyc8vru2sLXBSXmGCF9pJXSH_dAZ7d9VZVq7WJaqsrQhoeDNE4n37EjKrBc82wKtZKmGmo';
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')
export default function DeshbordScreen({ navigation }) {
  const [connectData, setConnectData] = useState([]);
  const [callerDetails, setCallerDetails] = useState({});
  const [loader, setLoader] = useState(false);
  const [userdata, setUserData] = useState({});
  const [localStream, setlocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [type, setType] = useState('JOIN');
  const otherUserId = useRef(null);
  const identification = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [localMicOn, setlocalMicOn] = useState(true);
  const [localWebcamOn, setlocalWebcamOn] = useState(true);
  const [imageLoader, setImageLoader] = useState(false);
  const _engine = useRef(null);

  const [isJoined, setJoined] = useState(false);
  const [peerIds, setPeerIds] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }, []);



  const newinit = async () => {
    const { appId } = config;
    _engine.current = await createAgoraRtcEngine();
    _engine.current.initialize({ appId });
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
        setPeerIds(prev => [uid]);
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
    leave()
    _engine.current?.leaveChannel();
    _engine.current?.removeAllListeners();
    try {
      _engine.current?.release();
    } catch (e) {
      console.log('release error:', e);
    }

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



  let remoteRTCMessage = useRef(null);


  const socket = useRef(null);
  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

  const [appStateVisible, setAppStateVisible] = useState(AppState.current);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        // The app has come back to the foreground, check for updates here.
        onActionHosport();
        setAppStateVisible(nextAppState);
      }
    };

    // Subscribe to AppState changes
    AppState.addEventListener('change', handleAppStateChange);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      // Hotspot.setHotspotEnabled(false);
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [appStateVisible]);

  const onActionHosport = async () => {
    const WRITE_SETTINGS = await Hotspot.isWriteSettingsGranted();
    console.log('WRITE_SETTINGS', WRITE_SETTINGS);
    if (!WRITE_SETTINGS) {
      Hotspot.openWriteSettings();
    } else {
      Hotspot.setHotspotEnabled(true);
      connectedDevices();
    }
  };

  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.RECORD_AUDIO',
      'android.permission.CAMERA',
      'android.permission.NEARBY_WIFI_DEVICES',
    ]);
    (async () => {
      requestUserPermission();
      onActionHosport();
    })();
    // onWifiNetwork();
  }, []);

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
    setTimeout(() => {
      // setInterval(() => {
      connectedDevices();
      // }, 100000);
    }, 2000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      initLocalVideo();
    }, 7000);
  }, []);

  useEffect(() => {
    InCallManager.start({ media: 'video' });
    // InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);

    return () => {
      InCallManager.stop();
    };
  }, []);

  // const timer = ms => new Promise(res => setTimeout(res, ms));

  const connectedDevices = async newSocket => {
    try {
      const myDeviceIp = await Hotspot.getMyDeviceIp();
      const devices = await Hotspot.getConnectedDevices();
      console.log('loginData', devices);
      setConnectData([]);
      groupData = devices;

      const loginData = await AsyncStorage.getItem('LOGIN');
      let parseData = JSON.parse(loginData);

      if (devices.length !== 0) {

        devices.map((item, index) => {
          setTimeout(() => {
            let senddata = {
              callerId: item.ipAddress,
              officerId: parseData.user._id,
            };


            socket.current.emit('senddata', senddata);
          }, index * 1000);
        });
      }
    } catch (error) {
      console.error('Error retrieving connected devices:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const loginState = await AsyncStorage.getItem('LOGIN');
      let data = await JSON.parse(loginState);
      setUserData(data?.user);

      if (data) {
        identification.current = data.user.license;
        const myDeviceIp = await Hotspot.getMyDeviceIp();
        let callerId = data.user?._id;
        const newSocket = SocketIOClient('http://35.154.76.187:3500/', {
          transports: ['websocket'],
          query: {
            callerId,
          },
        });
        socket.current = newSocket;

        newSocket.on('newCall', data => {
          remoteRTCMessage.current = data.rtcMessage;
          otherUserId.current = data.callerId;
          setType('INCOMING_CALL');
        });

        newSocket.on('callAnswered', async data => {
          // remoteRTCMessage.current = data.rtcMessage;
          // await peerConnection.current.setRemoteDescription(
          //   new RTCSessionDescription(data.rtcMessage),
          // );
          newstartCall()
          setType('WEBRTC_ROOM');
        });

        newSocket.on('receivedataofficer', async data => {
          console.log('receivedataofficer:', data);
          setTimeout(() => {
            OndataChnages(data);
          }, 500);
        });

        newSocket.on('callrejected', data => {
          // setRemoteStream(null);
          // setlocalStream(null);
          // peerConnection.current.close();

          setType('JOIN');
          AsyncStorage.removeItem('call_data');
          AsyncStorage.removeItem('call_picked');


          console.log("end Calll new", peerIds)
          // resetPeer();
          // initLocalVideo();
        });
        peerConnection.current.addEventListener(
          'connectionstatechange',
          event => {
            console.log('\n listener connectionstatechange event: \n', event);
          },
        );

        peerConnection.current.addEventListener(
          'negotiationneeded',
          async event => {
            console.log('\n listener negotiationneeded event: \n', event);

            peerConnection.current
              .createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 })
              .then(offer => {
                peerConnection.current.setLocalDescription(offer);
                return Promise.resolve(offer);
              })
              .then(offer => {
                // sendCall({
                //   calleeId: otherUserId.current,
                //   name: userdata,
                //   identification: identification.current,
                //   rtcMessage: offer,
                // });
              })
              .catch(err => console.error(err));
          },
        );
        // peerConnection.current.addEventListener('icecandidate', event => {
        //   console.log('\n listener icecandidate event: \n', event);

        //   if (!event.candidate) {
        //     return;
        //   } else {
        //     sendICEcandidate({
        //       calleeId: otherUserId.current,
        //       rtcMessage: {
        //         label: event.candidate.sdpMLineIndex,
        //         id: event.candidate.sdpMid,
        //         candidate: event.candidate.candidate,
        //       },
        //     });
        //   }
        // });

        newSocket.on('ICEcandidate', data => {
          let message = data.rtcMessage;
          console.log('message??', message);
          console.log(
            'peerConnection-----',
            peerConnection.current.remoteDescription,
          );
          setTimeout(() => {
            if (peerConnection.current.remoteDescription !== null) {
              if (peerConnection.current) {
                peerConnection?.current
                  .addIceCandidate(
                    new RTCIceCandidate({
                      candidate: message.candidate,
                      sdpMid: message.id,
                      sdpMLineIndex: message.label,
                    }),
                  )
                  .then(data => {
                    console.log('SUCCESS');
                  })
                  .catch(err => {
                    console.log('Error', err);
                  });
              }
            }
          }, 500);
        });
        initLocalVideo();
        registerPeerEvents();

        return () => {
          newSocket.off('newCall');
          newSocket.off('callAnswered');
          newSocket.off('ICEcandidate');
          newSocket.off('callrejected');
          newSocket.off('receivedataofficer');
          newSocket.off('senddata');
        };
      }
      // });
    })();
  }, []);

  const registerPeerEvents = () => {
    peerConnection.current.addEventListener('track', event => {
      setTimeout(() => {
        setRemoteStream(event.streams[0]);
      }, 500);
    });

    // Setup ice handling
    peerConnection.current.addEventListener('icecandidate', event => {
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
            optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
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

  async function sendICEcandidate(data) {
    await socket.current.emit('ICEcandidate', data);
  }

  const OndataChnages = async newdata => {
    try {
      groupData.map((item, index) => {
        if (item.ipAddress === newdata.ipAddress) {
          groupData[index] = {
            ['fcmtoken']: newdata.fcmtoken,
            ...item,
            ...newdata.officerId,
          };
        }
      });
      groupData = groupData;

      setConnectData([...groupData]);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    connectedDevices();
    wait(1500).then(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  async function processCall(CallerId, data) {
    axios
      .post(
        'https://fcm.googleapis.com/fcm/send',
        {
          to: data.fcmtoken,
          notification: {
            title: 'Notification Title',
            body: 'Notification Message',
            sound: 'default',
          },
          data: {
            customData: JSON.stringify({
              calleeId: CallerId,
              callType: 'VIDEO_CALL',
              notificationType: 'START_CALL',
              name: data?.email,
              fcmToken: data.fcmtoken,
            }),
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${SERVER_KEY}`,
          },
        },
      )
      .then(async response => {
        // console.log('NOTIFICATION SENT:', response.data);
        setlocalMicOn(true);
        peerConnection.current
          .createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 })
          .then(offer => {
            peerConnection.current.setLocalDescription(offer);
            return Promise.resolve(offer);
          })
          .then(offer => {
            sendCall({
              calleeId: CallerId,
              name: userdata,
              identification: identification.current,
              rtcMessage: offer,
            });
          })
          .catch(err => console.error(err));
      })
      .catch(error => {
        Alert.alert('NOTIFICATION ERROR:');
        console.log('NOTIFICATION ERROR:', error);
      });
  }

  async function processAccept() {
    // await peerConnection.current
    //   .setRemoteDescription(remoteRTCMessage.current)
    //   .then(function () {
    //     return peerConnection.current.createAnswer();
    //   })
    //   .then(function (answer) {
    //     peerConnection.current.setLocalDescription(answer);
    //     answerCall({
    //       callerId: otherUserId.current,
    //       rtcMessage: answer,
    //     });
    //   })
    //   .then(function () {
    //     // Send the answer to the remote peer using the signaling server
    //   })
    //   .catch(err => {
    //     // console.log('Error acessing camera', err);
    //   });
    // peerConnection.current.setRemoteDescription(
    //   new RTCSessionDescription(remoteRTCMessage.current),
    // );
    // const sessionDescription = await peerConnection.current.createAnswer();
    // await peerConnection.current.setLocalDescription(sessionDescription);
    // answerCall({
    //   callerId: otherUserId.current,
    //   rtcMessage: sessionDescription,
    // });
  }

  function answerCall(data) {
    socket.current.emit('answerCall', data);
  }

  function sendCall(data) {
    socket.current.emit('call', data);
  }

  function endCall(data) {
    socket.current.emit('endCall', data);
  }

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

    endCall({ calleeId: otherUserId.current });

  }


  const resetPeer = () => {
    const newPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    });
    peerConnection.current = newPeerConnection;

    setTimeout(() => {
      registerPeerEvents();
    }, 200);
  };

  const LoadingView = () => {
    return (
      <View style={styles.imagecontainer}>
        <ActivityIndicator size={30} color="blue" />
      </View>
    );
  };

  const logout = async () => {
    await Alert.alert('Hello!', 'Are you sure you want to logout?', [
      {
        text: 'Yes',
        onPress: () => {
          socket.current.disconnect();
          socket.current.close();
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

  const renderItem = ({ item }) => {
    return (
      item?.license && (
        <View style={styles.flatlistcontainer}>
          <View style={styles.mainContainer}>
            <View style={styles.userDetailsContainer}>
              <View
                style={{
                  marginHorizontal: moderateScale(15),
                  flex: 1,
                }}>
                <Text style={styles.title}>
                  {item?.license ? item?.license : 'Scanning...'}
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            disabled={item?.license !== undefined ? false : true}
            style={styles.buttonpull}
            onPress={() => {
              setCallerDetails(item);
              otherUserId.current = item.ipAddress;
              setType('OUTGOING_CALL');
              processCall(item.ipAddress, item);
              //  navigation.navigate('VideoCall');
            }}>
            <Text style={styles.janeTypo}>Pull Over</Text>
          </Pressable>
        </View>
      )
    );
  };

  const JoinScreen = () => {
    return (
      <View style={styles.container}>
        <View style={styles.contentView}>
          <View style={styles.frameParent}>
            <Image
              style={[styles.frameChild]}
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
            <TouchableOpacity
              onPress={() => logout()}
              style={{
                position: 'absolute',
                left: Dimensions.get('screen').width / 1.6,
              }}>
              <Image
                style={{ width: 25, height: 40, marginLeft: 2 }}
                resizeMode="contain"
                source={require('../../assets/logout.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.titleView}>
            <Image
              style={styles.nearbyImage}
              resizeMode="contain"
              source={require('../../assets/Frame2507.png')}
            />
            <Text
              style={[
                styles.nearby,
                {
                  fontFamily: 'DMSerifDisplay-Regular',
                  textAlign: 'left',
                },
              ]}>
              Nearby Vehicles
            </Text>
          </View>
          <View
            style={{
              height: Dimensions.get('screen').height / 1.4,
            }}>
            <FlatList
              data={connectData}
              extraData={connectData}
              // keyExtractor={(item, index) => item._id}
              contentContainerStyle={{
                paddingBottom: moderateScale(20),
                marginHorizontal: moderateScale(20),
                flex: 1,
              }}
              ListEmptyComponent={<ListEmptyComponent />}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          </View>
        </View>

        <Loader value={loader} />
      </View>
    );
  };

  const MyCustomButton = ({ title, onPress }) => (
    <Button title={title} onPress={onPress} />
  );

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Text style={{ fontSize: 20, color: 'black' }}>Scanning...</Text>
      </View>
    );
  };
  const OutgoingCallScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          // justifyContent: 'space-around',
          backgroundColor: '#FFECD1',
        }}>
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
        <ImageBackground
          source={require('../../assets/Rectangle13.png')}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            marginTop: responsiveHeight(10),
            alignItems: 'center',
          }}>
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
                onLoadStart={() => setImageLoader(true)}
                onLoadEnd={() => setImageLoader(false)}
                source={
                  callerDetails?.profilePicture
                    ? { uri: callerDetails?.profilePicture }
                    : require('../../assets/Driverdefaulticon.png')
                }
              />
              {imageLoader && <LoadingView />}
            </View>
            {/* <Image
              style={styles.frameInner}
              resizeMode="contain"
              source={require('../../assets/Frame2472.png')}
            /> */}
          </View>
          <View
            style={{
              padding: 35,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 14,
              // top: 100,
              flex: 0.4,
            }}>
            {/* <Text
              style={{
                fontSize: 20,
                color: '#FFECD1',
                fontFamily: FontFamily.dMSansRegular,
              }}>
              Officer
            </Text> */}
            <Text
              style={{
                fontSize: 30,
                color: '#FFECD1',
                fontFamily: 'DMSerifDisplay-Regular',
              }}>
              {callerDetails?.name}
              {/* Hiren01 */}
            </Text>

            <Text
              style={{
                fontSize: 18,
                marginTop: 12,
                color: '#FFECD1',
                fontFamily: FontFamily.dMSansRegular,
              }}>
              {callerDetails?.license}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.2,
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
        </ImageBackground>
      </View>
    );
  };

  const IncomingCallScreen = () => {
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
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
            }}>
            {otherUserId.current} is calling..
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              processAccept();
              setType('WEBRTC_ROOM');
            }}
            style={{
              backgroundColor: 'green',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallAnswer height={28} fill={'#fff'} />
          </TouchableOpacity>
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
                position: 'absolute',
                bottom: 0,
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
                {localMicOn ? <IconContainer
                  style={{
                    borderWidth: 2,
                    borderColor: '#15616D',
                  }}
                  backgroundColor={!localMicOn ? '#FFECD1' : 'transparent'}
                  onPress={() => {
                    toggleMic();
                  }}
                  Icon={() => {
                    return <MicOn height={40} width={40} fill="#15616D" />

                  }}
                /> : <IconContainer
                  style={{
                    borderWidth: 2,
                    borderColor: '#15616D',
                  }}
                  backgroundColor={!localMicOn ? '#FFECD1' : 'transparent'}
                  onPress={() => {
                    toggleUnMic();
                  }}
                  Icon={() => {
                    return (<MicOff height={45} width={45} fill="#15616D" />)

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

      //     // paddingHorizontal: 12,
      //     // paddingVertical: 12,
      //   }}>
      //   <View style={{flex: 1}}>
      //     {remoteStream && (
      //       <>
      //         <RTCView
      //           objectFit={'cover'}
      //           style={{
      //             // flex: 1,
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

      //   <View
      //     style={{
      //       // marginVertical: 12,
      //       overflow: 'hidden',
      //       flexDirection: 'row',
      //       justifyContent: 'space-between',
      //       backgroundColor: '#FFECD1',
      //       paddingVertical: 20,
      //       borderTopWidth: 7,
      //       borderTopLeftRadius: 20,
      //       borderLeftWidth: 7,
      //       borderLeftColor: '#15616D',
      //       borderRightColor: '#15616D',
      //       borderRightWidth: 7,
      //       borderTopLeftRadius: 40,
      //       borderTopRightRadius: 40,
      //       paddingHorizontal: 40,
      //       borderTopColor: '#15616D',
      //       width: '103%',
      //       left: -5,
      //     }}>
      //     <View>
      //       <IconContainer
      //         style={{
      //           borderWidth: 2,
      //           borderColor: '#15616D',
      //         }}
      //         backgroundColor={!localMicOn ? '#FFECD1' : 'transparent'}
      //         onPress={() => {
      //           toggleMic();
      //         }}
      //         Icon={() => {
      //           return localMicOn ? (
      //             <MicOn height={40} width={40} fill="#15616D" />
      //           ) : (
      //             <MicOff height={45} width={45} fill="#15616D" />
      //           );
      //         }}
      //       />
      //       <Text
      //         style={{
      //           color: '#15616D',
      //           fontSize: 15,
      //           alignSelf: 'center',
      //           paddingTop: 5,
      //           fontFamily: FontFamily.dMSansBold,
      //         }}>
      //         {localMicOn ? 'UnMute' : 'Mute'}
      //       </Text>
      //     </View>
      //     <View>
      //       <IconContainer
      //         backgroundColor={'#15616D'}
      //         onPress={() => {
      //           leave();
      //         }}
      //         Icon={() => {
      //           return <CallEnd height={40} width={40} fill="#FFECD1" />;
      //         }}
      //       />
      //       <Text
      //         style={{
      //           color: '#15616D',
      //           fontSize: 15,
      //           alignSelf: 'center',
      //           paddingTop: 5,
      //           fontFamily: FontFamily.dMSansBold,
      //         }}>
      //         End
      //       </Text>
      //     </View>

      //     {/* <IconContainer
      //       style={{
      //         borderWidth: 1.5,
      //         borderColor: '#2B3034',
      //       }}
      //       backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
      //       onPress={() => {
      //         toggleCamera();
      //       }}
      //       Icon={() => {
      //         return localWebcamOn ? (
      //           <VideoOn height={24} width={24} fill="#FFF" />
      //         ) : (
      //           <VideoOff height={36} width={36} fill="#1D2939" />
      //         );
      //       }}
      //     /> */}
      //     {/* <IconContainer
      //       style={{
      //         borderWidth: 1.5,
      //         borderColor: '#2B3034',
      //       }}
      //       backgroundColor={'transparent'}
      //       onPress={() => {
      //         switchCamera();
      //       }}
      //       Icon={() => {
      //         return <CameraSwitch height={24} width={24} fill="#FFF" />;
      //       }}
      //     /> */}
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
