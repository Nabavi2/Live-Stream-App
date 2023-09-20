import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState, useMemo} from 'react';
import io from 'socket.io-client';
import {
  MediaStream,
  RTCView,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import {Device} from 'mediasoup-client';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';

registerGlobals();
export default function LiveScreen(props: any) {
  const navigation = useNavigation();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [socketId, setSocketId] = useState();
  const [roomName, setRoomName] = useState('biMA');
  const [isLiveStart, setIsLiveStart] = useState(false);
  const [micStatus, setMicStatus] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [videoCameraStatus, setVideoCameraStatus] = useState(true);
  const url = 'http://45.33.96.47:4000/mediasoup';
  const roomNam = 'rooooommm';
  console.log('ROOOM NAME', roomName);

  //variables
  let device;
  let rtpCapabilities;
  let producerTransport;
  let consumerTransports = [];
  let audioProducer;
  let videoProducer;

  const videoRef = useRef(null);

  const socket = io('http://45.33.96.47:4000/mediasoup', {
    transports: ['websocket', 'polling'],
  });
  useMemo(() => {
    setIsJoined(props.route.params.isJoined);

    socket.on('connection-success', ({socketId}) => {
      console.log('FIRST MESSAGE OF SOCKET', socketId);
      setSocketId(socketId);
      getLocalStream();
    });
  }, [isJoined]);

  let params = {
    // mediasoup params
    encodings: [
      {
        rid: 'r0',
        maxBitrate: 100000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r1',
        maxBitrate: 300000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r2',
        maxBitrate: 900000,
        scalabilityMode: 'S1T3',
      },
    ],
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };

  let audioParams;
  let videoParams = {params};
  let consumingTransports = [];

  const streamSuccess = stream => {
    audioParams = {track: stream.getAudioTracks()[0], ...audioParams};
    videoParams = {track: stream.getVideoTracks()[0], ...videoParams};

    joinRoom();
  };

  const joinRoom = () => {
    socket.emit('joinRoom', {roomName}, data => {
      console.log(
        `Router RTP Capabilities in JOIN ROOM...`,
        data.rtpCapabilities,
      );
      // we assign to local variable and will be used when
      // loading the client Device (see createDevice above)
      rtpCapabilities = data.rtpCapabilities;

      // once we have rtpCapabilities from the Router, create Device
      //This function should call when the second user joined.

      createDevice();
    });
  };

  const getLocalStream = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current = stream;
      setLocalStream(stream);
      streamSuccess(stream);
      // audioRef.current.srcObject = stream
    } catch (error) {
      console.error(error);
    }
  };

  // A device is an endpoint connecting to a Router on the
  // server side to send/recive media
  const createDevice = async () => {
    try {
      device = new Device();

      await device.load({
        // see getRtpCapabilities() below
        routerRtpCapabilities: rtpCapabilities,
      });

      console.log('Device RTP Capabilities.....', device.rtpCapabilities);

      // once the device loads, create transport
      createSendTransport();
    } catch (error) {
      console.log('RRRRr', error);
      if (error.name === 'UnsupportedError')
        console.warn('device not supported');
    }
  };

  const createSendTransport = () => {
    // see server's socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    socket.emit('createWebRtcTransport', {consumer: false}, ({params}) => {
      // The server sends back params needed
      // to create Send Transport on the client side
      if (params.error) {
        console.log('params erroror', params.error);
        return;
      }

      //   console.log('PARASSSS', params);

      // creates a new WebRTC Transport to send media
      // based on the server's producer transport params
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      producerTransport = device.createSendTransport(params);

      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectSendTransport() below
      producerTransport.on(
        'connect',
        async ({dtlsParameters}, callback, errback) => {
          try {
            // Signal local DTLS parameters to the server side transport
            // see server's socket.on('transport-connect', ...)
            socket.emit('transport-connect', {
              dtlsParameters,
            });

            // Tell the transport that parameters were transmitted.
            callback();
          } catch (error) {
            errback(error);
          }
        },
      );

      producerTransport.on('produce', async (parameters, callback, errback) => {
        console.log('PARAMETTTTT', parameters);

        try {
          // tell the server to create a Producer
          // with the following parameters and produce
          // and expect back a server side producer id
          // see server's socket.on('transport-produce', ...)
          socket.emit(
            'transport-produce',
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
            },
            ({id, producersExist}) => {
              // Tell the transport that parameters were transmitted and provide it with the
              // server side producer's id.
              callback({id});

              // if producers exist, then join room
              if (producersExist) getProducers();
            },
          );
        } catch (error) {
          errback(error);
        }
      });

      connectSendTransport();
    });
  };

  const connectSendTransport = async () => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above

    audioProducer = await producerTransport.produce(audioParams);
    videoProducer = await producerTransport.produce(videoParams);
  };

  const signalNewConsumerTransport = async remoteProducerId => {
    //check if we are already consuming the remoteProducerId
    if (consumingTransports.includes(remoteProducerId)) return;
    consumingTransports.push(remoteProducerId);

    socket.emit('createWebRtcTransport', {consumer: true}, ({params}) => {
      // The server sends back params needed
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error);
        return;
      }
      console.log(`PARAMS... ${params}`);

      let consumerTransport;
      try {
        consumerTransport = device.createRecvTransport(params);
      } catch (error) {
        // exceptions:
        // {InvalidStateError} if not loaded
        // {TypeError} if wrong arguments.
        console.log(error);
        return;
      }

      consumerTransport.on(
        'connect',
        async ({dtlsParameters}, callback, errback) => {
          try {
            // Signal local DTLS parameters to the server side transport
            // see server's socket.on('transport-recv-connect', ...)
            socket.emit('transport-recv-connect', {
              dtlsParameters,
              serverConsumerTransportId: params.id,
            });

            // Tell the transport that parameters were transmitted.
            callback();
          } catch (error) {
            // Tell the transport that something was wrong
            errback(error);
          }
        },
      );

      connectRecvTransport(consumerTransport, remoteProducerId, params.id);
    });
  };
  console.log('signalNewConsumerTransportMETHODE3333');

  // server informs the client of a new producer just joined
  socket.on('new-producer', ({producerId}) =>
    signalNewConsumerTransport(producerId),
  );

  const getProducers = () => {
    socket.emit('getProducers', producerIds => {
      console.log(producerIds);
      // for each of the producer create a consumer
      // producerIds.forEach(id => signalNewConsumerTransport(id))
      producerIds.forEach(signalNewConsumerTransport);
    });
  };

  const connectRecvTransport = async (
    consumerTransport,
    remoteProducerId,
    serverConsumerTransportId,
  ) => {
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below
    socket.emit(
      'consume',
      {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({params}) => {
        if (params.error) {
          console.log('Cannot Consume');
          return;
        }

        console.log(`Consumer Params ${params}`);

        // then consume with the local consumer transport
        // which creates a consumer
        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });
        console.log('CONSUME11111111R222', consumer.rtpParameters.rtcp.cname);
        consumerTransports = [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];

        // create a new div element for the new consumer media
        const romePID = remoteProducerId;

        if (params.kind == 'audio') {
          //append to the audio container
          //   newElem.innerHTML =
          //     '<audio id="' + remoteProducerId + '" autoplay></audio>';
        } else {
          //append to the video container
          //   newElem.setAttribute('class', 'remoteVideo');
          //   newElem.innerHTML =
          //     '<video id="' +
          //     remoteProducerId +
          //     '" className="bg-black mx-2 " autoplay ></video>';
        }

        // videoContainer.appendChild(newElem);

        // destructure and retrieve the video track from the producer
        const {track} = consumer;

        remoteProducerId = new MediaStream([track]);

        console.log('PRODUCER>>>>>', remoteProducerId);
        // the server consumer started with media paused
        // so we need to inform the server to resume
        socket.emit('consumer-resume', {
          serverConsumerId: params.serverConsumerId,
        });
        if (isJoined) {
          setRemoteStream(remoteProducerId);
        }
      },
    );
  };
  const onHandleCloseStream = async () => {
    setIsLiveStart(false);

    socket.on('producer-closed', ({remoteProducerId}) => {
      // server notification is received when a producer is closed
      // we need to close the client-side consumer and associated transport
      const producerToClose = consumerTransports.find(
        transportData => transportData.producerId === remoteProducerId,
      );
      producerToClose.consumerTransport.close();
      producerToClose.consumerTransport = null;
      producerToClose.consumer.close();
      producerToClose.consumer = null;

      // remove the consumer transport from the list
      consumerTransports = consumerTransports.filter(
        transportData => transportData.producerId !== remoteProducerId,
      );

      // remove the video div element
      // videoContainer.removeChild(`td-${remoteProducerId}`);
    });
    // Send a message to the server to end the stream
    socket.emit('endStream', {streamId: remoteStream?._id});
    socket.emit('endStream', {streamId: localStream?._id});

    // Close the socket connection
    socket.close();
    socket.emit('leaveRoom', {roomName});
    socket.on('disconnect');
    navigation.goBack();
  };
  const toggleVideo = () => {
    setVideoCameraStatus(false);
    videoTrack = localStream?.getTracks().find(track => track.kind === 'video');
    if (videoTrack.enabled) {
      videoTrack.enabled = false;
    } else {
      videoTrack.enabled = true;
      setVideoCameraStatus(true);
    }
  };

  const toggleAudio = () => {
    audioTrack = localStream?.getTracks().find(track => track.kind === 'audio');

    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      setMicStatus(false);
    } else {
      audioTrack.enabled = true;
      setMicStatus(true);
    }
  };
  console.log('LOCAL', localStream, 'REMOTEEEE', remoteStream);
  if (!socketId) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Connecting...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{backgroundColor: Colors.secondary}}>
      <TouchableOpacity
        style={styles.endBtn}
        onPress={() => {
          onHandleCloseStream();
        }}>
        <MaterialIcons name="call" size={24} color={Colors.white} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => toggleAudio()}
        style={styles.micAndVideoBtn}>
        {/* */}
        {micStatus ? (
          <MaterialIcons name="mic" color="#fff" size={28} />
        ) : (
          <MaterialIcons name="mic-off" color="#fff" size={28} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => toggleVideo()}
        style={[
          styles.micAndVideoBtn,
          {top: Dimensions.get('screen').height * 0.17},
        ]}>
        {/* */}
        {videoCameraStatus ? (
          <MaterialIcons name="videocam" color="#fff" size={28} />
        ) : (
          <MaterialIcons name="videocam-off" color="#fff" size={28} />
        )}
      </TouchableOpacity>

      {localStream && videoCameraStatus ? (
        <RTCView
          style={styles.localVideo}
          streamURL={localStream.toURL()}
          ref={videoRef}
          focusable={true}
          objectFit="cover"
        />
      ) : (
        <View style={styles.localVideo}></View>
      )}
      {remoteStream && (
        <RTCView
          style={[
            styles.localVideo,
            {height: Dimensions.get('screen').height * 0.42, borderRadius: 45},
          ]}
          streamURL={remoteStream.toURL()}
          focusable={true}
          ref={videoRef}
          objectFit="cover"
        />
      )}
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

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 60,
  },
  localVideo: {
    width: Dimensions.get('screen').width * 0.96,
    height: Dimensions.get('screen').height * 0.43,
    backgroundColor: 'black',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
  },

  endBtn: {
    backgroundColor: 'red',
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    top: 30,
    right: 20,
    alignSelf: 'flex-end',
    borderRadius: 10,
    position: 'absolute',
  },
  micAndVideoBtn: {
    position: 'absolute',
    zIndex: 1,
    right: 15,
    top: Dimensions.get('screen').height * 0.12,
    alignSelf: 'flex-end',
  },
});
