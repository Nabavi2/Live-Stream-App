/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/Colors';
import {Camera, useCameraDevices, VideoFile} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function CameraRenderScreen() {
  const navigation = useNavigation();
  const devices = useCameraDevices('wide-angle-camera');
  const [rotate, setRotate] = useState(devices?.back);
  const [flash, setFlash] = useState('off');
  const [micStatus, setMicStatus] = useState(true);
  const [flashStatus, setFlashStatus] = useState(false);
  const camera = useRef<Camera>();
  // const camera = new Camera();

  const handlePermissions = async () => {
    const devices = await Camera.getAvailableCameraDevices();
    console.log('DEVICESS1', devices[0].hasFlash);
  };
  useEffect(() => {
    handlePermissions();
  }, []);
  if (devices.front == null) {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color="blue" size="large" />
      </SafeAreaView>
    );
  }
  const onHandleTakePhotos = async () => {
    await camera.current?.takePhoto({
      qualityPrioritization: 'quality',
      flash: 'on',
      enableAutoRedEyeReduction: true,
    });
    await camera.current?.takeSnapshot({
      flash: 'on',
      quality: 100,
      skipMetadata: true,
    });
  };
  const onHandleRecordVideo = async () => {
    await camera.current?.startRecording({
      fileType: 'mp4',
      flash: 'on',
      videoCodec: 'h264',
      onRecordingFinished: finish => console.log(finish, 'Finished record'),
      onRecordingError: error => console.log(error, 'Error'),
    });
  };

  const onHandleStopRecordVideo = async () => {
    await camera.current?.stopRecording();
  };
  const onRotateCamera = () => {
    if (rotate == devices?.back) {
      setRotate(devices?.front);
    } else if (rotate == devices?.front) {
      setRotate(devices?.back);
    } else {
      setRotate(devices?.back);
    }
  };
  const onHandleFlash = async () => {
    if (flash == 'off') {
      setFlash('on');
      setFlashStatus(true);
    } else if (flash == 'on') {
      setFlash('off');
      setFlashStatus(false);
    } else {
      setFlash('off');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={camera}
        nativeID={devices.back?.id}
        style={StyleSheet.absoluteFill}
        device={rotate == devices.front ? devices?.front : devices.back}
        isActive={true}
        photo={true}
        audio={true}
        video={true}
        renderToHardwareTextureAndroid={true}
        focusable={true}
        torch={flash == 'on' ? 'on' : 'off'}
      />
      <View style={{left: '88%', marginTop: '30%'}}>
        {/* <TouchableOpacity
          onPress={onHandleTakePhotos}
          style={{
            position: 'absolute',
            zIndex: 1,
            marginTop: 20,
            backgroundColor: 'red',
          }}>
          <Text>Start Recording</Text>
          <MaterialIcon name="video" color="#fff" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onHandleStopRecordVideo}
          style={{
            position: 'absolute',
            zIndex: 1,
            marginTop: 50,
            backgroundColor: 'red',
          }}>
          <Text>Stop Recording</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={onRotateCamera}
          style={{
            position: 'absolute',
            zIndex: 1,
            marginTop: 80,
          }}>
          <MaterialIcon name="cameraswitch" color="#fff" size={28} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMicStatus(!micStatus)}
          style={{
            position: 'absolute',
            zIndex: 1,
            marginTop: 120,
          }}>
          {/* */}
          {micStatus ? (
            <MaterialIcon name="mic" color="#fff" size={28} />
          ) : (
            <MaterialIcon name="mic-off" color="#fff" size={28} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onHandleFlash}
          style={{
            position: 'absolute',
            zIndex: 1,
            marginTop: 160,
          }}>
          {flashStatus ? (
            <MaterialIcon name="flash-on" color="#fff" size={28} />
          ) : (
            <MaterialIcon name="flash-off" color="#fff" size={28} />
          )}
          {/*  */}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.liveBtn}
        onPress={() => navigation.navigate('LiveScreen' as never)}>
        <Text style={styles.btnText}>Go Live</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  timerText: {
    color: Colors.white,
    fontSize: 16,
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
  buttonRecord: {
    alignSelf: 'center',
    height: 50,
    width: 50,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: '#ff4343',
  },
  buttonStop: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: '#ff4343',
  },
  liveBtn: {
    width: '70%',
    height: Dimensions.get('screen').height * 0.06,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    bottom: 15,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
