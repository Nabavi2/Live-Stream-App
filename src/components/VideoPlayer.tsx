import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import {ProgressBar} from './ProgressBar';
import {PlayerControls} from './PlayerControls';
// import {FullscreenClose, FullscreenOpen} from '../assets/icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const VideoPlayer = (props: any) => {
  const videoRef = React.createRef();
  const [videoT, setVideoT] = useState<string | null>();
  const [state, setState] = useState({
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
    isBuffer: false,
    seekToPrevious: 0,
  });

  const setVideoTime = async () => {
    await AsyncStorage.setItem('videotime', props.time);
  };
  const getVideoTime = async () => {
    const time = await AsyncStorage.getItem('videotime');
    setVideoT(time);
    return time;
  };

  useEffect(() => {
    // console.log('props.item .ivde333', props.item.video);
    onLoadEnd;

    if (props.item.isQualityChange && videoT === props.time) {
      setState(s => ({...s, seekToPrevious: state.currentTime}));
    } else {
      setState(s => ({...s, seekToPrevious: 0}));
    }
    setVideoTime();
    getVideoTime();
  }, [props.time, props.item.isQualityChange]);

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  function handleOrientation(orientation: any) {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setState(s => ({...s, fullscreen: true})), StatusBar.setHidden(true))
      : (setState(s => ({...s, fullscreen: false})),
        StatusBar.setHidden(false));
  }

  function handleFullscreen() {
    state.fullscreen
      ? Orientation.lockToPortrait()
      : Orientation.lockToLandscape();
  }

  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({...state, play: false, showControls: true});
      return;
    } else {
      setState({...state, play: true});
      setTimeout(() => setState(s => ({...s, showControls: false})), 1000);
    }
  }

  function skipBackward() {
    videoRef.current.seek(state.currentTime - 5);
    setState({
      ...state,
      currentTime:
        state.currentTime < 5 ? state.currentTime - 0 : state.currentTime - 5,
    });
  }

  function skipForward() {
    videoRef.current.seek(state.currentTime + 5);
    setState({
      ...state,
      currentTime:
        state.currentTime < state.duration - 5 ? state.currentTime + 5 : 0,
    });
  }

  function onSeek(data) {
    videoRef.current.seek(data.seekTime);
    setState({...state, currentTime: data.seekTime, play: false});
  }

  function onLoadEnd(data) {
    setState(s => ({
      ...s,
      duration: data.duration,
      currentTime:
        props.item.isQualityChange && videoT === props.time
          ? data.currentTime
          : 0,
    }));
  }

  function onProgress(data) {
    setState(s => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onEnd() {
    setState({...state, play: true});
    videoRef.current.seek(0);
  }

  function showControls() {
    state.showControls
      ? setState({...state, showControls: false})
      : setState({...state, showControls: true});
  }

  return (
    <View style={state.fullscreen ? styles.container1 : styles.container}>
      <TouchableWithoutFeedback onPress={showControls}>
        <View>
          {props.item.video ? (
            <Video
              pictureInPicture={props.pictureInPicture}
              playInBackground={false}
              ref={videoRef}
              poster={props.item.poster}
              source={{
                uri: props.item.video ? props.item.video.trim() : '',
              }}
              style={state.fullscreen ? styles.fullscreenVideo : styles.video}
              controls={false}
              // fullscreen={true}
              resizeMode={'contain'}
              onBuffer={t => {
                if (state.seekToPrevious != 0) {
                  videoRef.current.seek(state.seekToPrevious);
                }
                setState(s => ({
                  ...s,
                  isBuffer: t.isBuffering,
                  showControls: true,
                  seekToPrevious: 0,
                }));
              }}
              onLoad={onLoadEnd}
              onProgress={onProgress}
              onEnd={onEnd}
              paused={!state.play}
            />
          ) : null}
          {state.showControls && (
            <View style={styles.controlOverlay}>
              <View style={styles.topHeader}>
                <TouchableOpacity
                  onPress={handleFullscreen}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  style={styles.fullscreenButton}>
                  {state.fullscreen ? (
                    <MaterialIcons
                      name="fullscreen-exit"
                      size={24}
                      color="black"
                    />
                  ) : (
                    <MaterialIcons name="fullscreen" size={24} color="black" />
                  )}
                </TouchableOpacity>
              </View>
              <PlayerControls
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                buffering={state.isBuffer}
                showPreviousAndNext={false}
                showSkip={true}
                skipBackwards={skipBackward}
                skipForwards={skipForward}
              />
              <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
export default VideoPlayer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
    width: Dimensions.get('window').width,
    height: 200,
  },
  container1: {
    flex: 1,
    backgroundColor: '#ebebeb',
    width: hp('100%'),
    height: wp('100%'),
  },
  video: {
    height: 200,
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    flex: 1,
  },
  fullscreenButton: {},
  liveButton: {
    paddingVertical: 2,
    backgroundColor: 'red',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  controlOverlay: {
    position: 'absolute',

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
});
