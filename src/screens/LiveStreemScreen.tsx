import React, {useState} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
  Alert,
  TextInput,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
// import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Colors from '../constants/Colors';

function LiveStreamScreen() {
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View style={styles.screen}>
        <Text>This is the New screen for rendering live stream</Text>
      </View>
    </ScrollView>
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
    flexDirection: 'column',
    width: '98%',
    height: 250,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  input: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '88%',
    height: 40,
    borderColor: Colors.secondary,
    borderBottomWidth: 1,
    color: '#FFF',
  },
  button: {
    backgroundColor: Colors.primary,
    width: '90%',
    height: 40,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cart: {
    backgroundColor: '#fff',
    width: '85%',
    height: Dimensions.get('screen').height * 0.46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default LiveStreamScreen;
