import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import io from 'socket.io-client';
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';
const socket = io('https://192.168.1.113:3000/helloworld');
function LiveScreen() {
  const [stream, setStream] = useState<MediaStream>();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  useEffect(() => {
    const init = async () => {
      socket.connect();

      // Get user media stream

      const mediaStream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          frameRate: 30,
          facingMode: 'user',
        },
      });

      setStream(mediaStream);

      // Initialize peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
      });
      setPeerConnection(pc);

      // Add stream to peer connection
      mediaStream.getTracks().forEach(track => {
        pc.addTrack(track, mediaStream);
      });

      // Listen for ICE candidates
      pc.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('candidate', event.candidate);
        }
      };
      await mediaDevices.getDisplayMedia();

      // Listen for remote stream
      pc.ontrack = event => {
        setRemoteStream(event.streams[0]);
      };

      // Listen for socket events
      socket.on('offer', async offer => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', answer);
      });

      socket.on('candidate', async candidate => {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });
    };

    init();
  }, []);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.screen}>
      {/* <View style={styles.firstContainer}>
        <Text>First Person in live</Text>
      </View>
      <View style={styles.secondContainer}>
        <Text>Second Person in live</Text>
      </View> */}
      <View style={styles.container}>
        <Text style={styles.title}>Live Stream</Text>
        {stream && (
          <RTCView
            style={styles.localVideo}
            streamURL={stream.toURL()}
            mirror={true}
            objectFit="contain"
          />
        )}
        {remoteStream && (
          <RTCView
            style={styles.remoteVideo}
            streamURL={remoteStream.toURL()}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  firstContainer: {
    backgroundColor: '#A704B3',
    width: '100%',
    height: '49%',
  },
  secondContainer: {
    backgroundColor: '#B30418',
    width: '100%',
    height: '49%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 60,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  localVideo: {
    width: 200,
    height: 150,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  remoteVideo: {
    width: 200,
    height: 150,
    backgroundColor: 'black',
  },
});
export default LiveScreen;
