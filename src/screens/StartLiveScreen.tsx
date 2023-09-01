import React, {useState} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
  Alert,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import Colors from '../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

function StartLiveScreen() {
  const navigation = useNavigation();

  const checkCameraAndMicPermission = async () => {
    const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    const micPermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (cameraPermission && micPermission == 'granted') {
      console.log('The user Allowed camera');
      navigation.navigate('CameraScreen' as never);
      return true;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <View style={styles.screen}>
        <Text style={{fontSize: 18, fontWeight: '700', marginTop: 20}}>
          Tap on button to go live screen
        </Text>

        <TouchableOpacity
          style={styles.startLiveBtn}
          onPress={() => checkCameraAndMicPermission()}>
          <Text style={{color: '#fff', fontWeight: '700', marginRight: 10}}>
            Start Live
          </Text>
          <MaterialIcon name="live-tv" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'column',
    width: '98%',
    height: 250,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  startLiveBtn: {
    flexDirection: 'row',
    width: '80%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginTop: '50%',
  },
});
export default StartLiveScreen;
