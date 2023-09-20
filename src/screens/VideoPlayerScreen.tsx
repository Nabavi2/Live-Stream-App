import {Text, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import VideoPlayer from '../components/VideoPlayer';

const videoData = {
  time: '00:27',
  pictureInPicture:
    'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/868e2d38155793.57575971b116a.jpg',
  item: {
    isQualityChange: true,
    video: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    poster:
      'https://mir-s3-cdn-cf.behance.net/project_modules/1400/e5865358516595.59ffa0a2671f5.jpg',
  },
};

export default function VideoPlayerScreen() {
  let data = {
    video: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    poster:
      'https://mir-s3-cdn-cf.behance.net/project_modules/1400/e5865358516595.59ffa0a2671f5.jpg',

    isQualityChange: false,
    pictureInPicture: true,
    time: '00:27',
  };
  return (
    <SafeAreaView style={{flex: 1}} testID="play-screen">
      <VideoPlayer props={{...data}} />
    </SafeAreaView>
  );
}
