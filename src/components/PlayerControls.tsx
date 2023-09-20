import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Colors from '../constants/Colors';
// interface Props{

// }
export const PlayerControls = ({
  playing,
  showPreviousAndNext,
  showSkip,
  previousDisabled,
  nextDisabled,
  onPlay,
  buffering,
  onPause,
  skipForwards,
  skipBackwards,
  onNext,
  onPrevious,
}) => (
  <View style={styles.wrapper}>
    {showPreviousAndNext && (
      <TouchableOpacity
        style={[styles.touchable, previousDisabled && styles.touchableDisabled]}
        onPress={onPrevious}
        disabled={previousDisabled}>
        {/* <VideoPrevious /> */}
        <MaterialIcons name="play-arrow" size={24} color="#fff" />
      </TouchableOpacity>
    )}

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
        {/* <VideoSkipBack /> */}
        <MaterialIcons name="fast-rewind" size={24} color="#fff" />
      </TouchableOpacity>
    )}
    {buffering ? (
      <TouchableOpacity style={styles.touchable}>
        <ActivityIndicator color={Colors.white} size="large" />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.touchable}
        onPress={playing ? onPause : onPlay}>
        {playing ? (
          // <VideoPause />
          <MaterialIcons name="pause" size={40} color="#fff" />
        ) : (
          // <VideoPlay />
          <MaterialIcons name="play-arrow" size={40} color="#fff" />
        )}
      </TouchableOpacity>
    )}

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
        {/* <VideoSkipForward /> */}
        <MaterialIcons name="fast-forward" size={24} color="#fff" />
      </TouchableOpacity>
    )}

    {showPreviousAndNext && (
      <TouchableOpacity
        style={[styles.touchable, nextDisabled && styles.touchableDisabled]}
        onPress={onNext}
        disabled={nextDisabled}>
        {/* <VideoNext /> */}
        <AntDesign name="stepforward" size={24} color="#fff" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 3,
  },
  touchable: {
    padding: 5,
  },
  touchableDisabled: {
    opacity: 0.3,
  },
});
