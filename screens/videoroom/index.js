import React from 'react';
import {Text, View} from 'react-native';
import IconContainer from '../components/IconContainer';
import {RTCView} from 'react-native-webrtc';
import {FontFamily} from '../globelstyle/globelstyle';
import MicOn from '../../assets/MicOn';
import MicOff from '../../assets/MicOff';
import CallEnd from '../../assets/CallEnd';
const WebrtcRoomScreen = ({
  remoteStream,
  localMicOn,
  localStream,
  leave,
  toggleMic,
}) => {
  console.log('route::', localMicOn);
  //   const {remoteStream, localMicOn, localStream, leave} = route.parmas;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#050A0E',
        // paddingHorizontal: 12,
        // paddingVertical: 12,
      }}>
      {/* {localStream ? (
          <RTCView
            objectFit={'cover'}
            style={{flex: 1, backgroundColor: '#050A0E'}}
            streamURL={localStream.toURL()}
          />
        ) : null} */}
      {remoteStream ? (
        <RTCView
          objectFit={'cover'}
          style={{
            flex: 1,
            backgroundColor: '#050A0E',
            marginBottom: -50,
          }}
          streamURL={remoteStream.toURL()}
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#050A0E',
            marginBottom: -50,
          }}
        />
      )}
      <View
        style={{
          overflow: 'hidden',
          flexDirection: 'row',
          justifyContent: 'space-between',
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
          <IconContainer
            style={{
              borderWidth: 2,
              borderColor: '#15616D',
            }}
            backgroundColor={!localMicOn ? '#FFECD1' : 'transparent'}
            onPress={() => {
              toggleMic();
            }}
            Icon={() => {
              return localMicOn ? (
                <MicOn height={40} width={40} fill="#15616D" />
              ) : (
                <MicOff height={45} width={45} fill="#15616D" />
              );
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
            {localMicOn ? 'UnMute' : 'Mute'}
          </Text>
        </View>
        <View>
          <IconContainer
            backgroundColor={'#15616D'}
            onPress={() => {
              leave();
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
        {/* <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
            onPress={() => {
              toggleCamera();
            }}
            Icon={() => {
              return localWebcamOn ? (
                <VideoOn height={24} width={24} fill="#FFF" />
              ) : (
                <VideoOff height={36} width={36} fill="#1D2939" />
              );
            }}
          /> */}
        {/* <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={'transparent'}
            onPress={() => {
              switchCamera();
            }}
            Icon={() => {
              return <CameraSwitch height={24} width={24} fill="#FFF" />;
            }}
          /> */}
      </View>
      <View
        style={{
          width: 150,
          height: 200,
          position: 'absolute',
          right: 15,
          top: 20,
          // borderWidth: 2,
          // borderRadius: 20,
        }}>
        {localStream ? (
          <RTCView
            objectFit={'cover'}
            style={{
              flex: 1,
              backgroundColor: '#050A0E',
              // borderRadius: 30,
            }}
            streamURL={localStream.toURL()}
          />
        ) : null}
      </View>
    </View>
  );
};

export default WebrtcRoomScreen;
