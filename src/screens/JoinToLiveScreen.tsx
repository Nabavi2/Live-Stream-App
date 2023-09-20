import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {request, PERMISSIONS} from 'react-native-permissions';

export default function JoinToLiveScreen() {
  const navigation = useNavigation();
  const [roomName, setRoomName] = useState('');

  const onJoinLiveHandler = async () => {
    const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    const micPermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (cameraPermission && micPermission == 'granted') {
      console.log('The user Allowed camera');
      navigation.navigate('LiveScreen' as never, {
        isEntered: true,
        roomName: roomName,
        isJoined: true,
      });
      return true;
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}} testID="testy">
      <View style={styles.screen}>
        <Text style={{fontSize: 18, fontWeight: '700', marginTop: 20}}>
          Insert the room name in the below input
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <TextInput
            placeholder="Room ID"
            value={roomName}
            onChangeText={rID => setRoomName(rID)}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.startLiveBtn}
            onPress={() => onJoinLiveHandler()}>
            <Text style={{color: '#fff', fontWeight: '700', marginRight: 10}}>
              Join Room
            </Text>
          </TouchableOpacity>
        </View>
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
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
  },
  input: {
    width: '60%',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 10,
    marginRight: 20,
    paddingHorizontal: 10,
  },
});
