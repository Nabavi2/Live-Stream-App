import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Colors from '../constants/Colors';
import {useNavigation} from '@react-navigation/native';

export default function Testy() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}} testID="testy">
      <View style={styles.screen}>
        <Text style={{fontSize: 18, fontWeight: '700', marginTop: 20}}>
          Tap on button to go live screen
        </Text>

        <TouchableOpacity
          style={styles.startLiveBtn}
          onPress={() => console.log('log')}>
          <Text style={{color: '#fff', fontWeight: '700', marginRight: 10}}>
            Start Live
          </Text>
          {/* <MaterialIcons name="live-tv" size={20} color={Colors.white} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.startLiveBtn}
          onPress={() => navigation.navigate('VideoScreen' as never)}>
          <Text style={{color: '#fff', fontWeight: '700', marginRight: 10}}>
            Go Video
          </Text>
          {/* <MaterialIcons name="live-tv" size={20} color={Colors.white} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startLiveBtn, {marginTop: 20}]}
          onPress={() => navigation.navigate('ViewerScreen' as never)}>
          <Text style={{color: '#fff', fontWeight: '700', marginRight: 10}}>
            Go Viewer Screen
          </Text>
          {/* <MaterialIcons name="live-tv" size={20} color={Colors.white} /> */}
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
