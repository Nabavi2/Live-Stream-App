import React from 'react';
import {render} from '@testing-library/react-native';
import VideoPlayer from '../src/components/VideoPlayer';
import Video from 'react-native-video';
let data = {
  video: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
  poster:
    'https://mir-s3-cdn-cf.behance.net/project_modules/1400/e5865358516595.59ffa0a2671f5.jpg',

  isQualityChange: false,
  pictureInPicture: true,
  time: '00:27',
};
describe('VideoPlayer', () => {
  it('should render', () => {
    const {getByTestId} = render(<VideoPlayer props={{...data}} />);
    expect(getByTestId('video-player')).toBeTruthy();
  });
});

// jest.mock('@react-navigation/native', () => ({
//   useNavigation: jest.fn(),
// }));
// jest.mock('react-native-vector-icons/MaterialIcons', () => ({
//   MaterialIcons: 'MaterialIcons',
// }));
