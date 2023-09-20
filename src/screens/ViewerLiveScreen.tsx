import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import Eye from '../Icons/Eye';

function ViewerLiveScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          zIndex: 1,
          marginTop: 10,
          marginLeft: 10,
        }}>
        <MaterialIcon name="close" color="#fff" size={28} />
      </TouchableOpacity>
      <View
        style={[
          styles.liveContainer,
          {
            right: Dimensions.get('screen').width * 0.25,
            backgroundColor: 'rgba(0, 0, 0, 0.31)',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Eye />
        <Text style={{color: '#fff', marginLeft: 10, fontWeight: 'bold'}}>
          4.6 k
        </Text>
      </View>
      <View style={styles.liveContainer}>
        <Text style={{fontWeight: 'bold', color: '#fff'}}>Live</Text>
      </View>
      <View style={styles.firstContainer}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
          source={{
            uri: 'http://2.bp.blogspot.com/-ANQxeP3K5Qo/TmTTP7O68hI/AAAAAAAAAkw/MAJHv4MJnI0/s1600/Beautiful-Girls-Wallpapers-5.jpg',
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  firstContainer: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  liveContainer: {
    backgroundColor: Colors.red,
    height: 30,
    paddingHorizontal: 10,
    margin: 10,
    right: 5,
    borderRadius: 5,
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ViewerLiveScreen;
