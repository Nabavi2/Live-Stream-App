import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';

function StartLiveScreen() {
  const navigation = useNavigation();

  const onGoLiveHandler = async () => {
    const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    const micPermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (cameraPermission && micPermission == 'granted') {
      console.log('The user Allowed camera');
      navigation.navigate('LiveScreen' as never, {
        isLiveStart: true,
        isJoined: false,
      });
      return true;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}} testID="startlive">
      <View style={styles.screen}>
        <Text style={{fontSize: 18, fontWeight: '700', marginTop: 20}}>
          Tap on button to go live screen
        </Text>

        <TouchableOpacity
          style={styles.startLiveBtn}
          onPress={() => navigation.navigate('VideoScreen' as never)}>
          <Text style={{color: '#fff', fontWeight: '700', marginRight: 10}}>
            Go Video
          </Text>
          <MaterialIcon name="live-tv" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startLiveBtn, {marginTop: 20}]}
          onPress={() => navigation.navigate('ViewerScreen' as never)}>
          <Text style={{color: '#fff', fontWeight: '700', marginRight: 10}}>
            Go Viewer Screen
          </Text>
          <MaterialIcon name="live-tv" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startLiveBtn, {marginTop: 20}]}
          onPress={() => onGoLiveHandler()}>
          <Text style={{color: '#fff', fontWeight: '700', marginRight: 10}}>
            Go Live screen
          </Text>
          <MaterialIcon name="live-tv" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startLiveBtn, {marginTop: 20}]}
          onPress={() => navigation.navigate('JoinToLive' as never)}>
          <Text style={{color: '#fff', fontWeight: '700', marginRight: 10}}>
            Go Join Screen
          </Text>
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
    marginTop: 30,
  },
});
export default StartLiveScreen;
