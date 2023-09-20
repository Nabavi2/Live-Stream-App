import React from 'react';
import Testy from '../src/screens/Testy';
import {render} from '@testing-library/react-native';

describe('Testy', () => {
  it('should render', () => {
    const {getByTestId} = render(<Testy />);
    expect(getByTestId('testy')).toBeTruthy();
  });
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
// jest.mock('react-native-vector-icons/MaterialIcons', () => ({
//   MaterialIcons: 'MaterialIcons',
// }));
