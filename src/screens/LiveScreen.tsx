import React from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';

// import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {useNavigation} from '@react-navigation/native';

function LiveScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.firstContainer}>
        <Text>First Person in live</Text>
      </View>
      <View style={styles.secondContainer}>
        <Text>Second Person in live</Text>
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
});
export default LiveScreen;
