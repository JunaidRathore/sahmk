// src/constants/theme.ts
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const COLORS = {
  primary: '#4CAF50',
  background: '#000000',
  text: '#FFFFFF',
  textSecondary: '#62656b',
};

export const SIZES = {
  padding: 20,
  borderRadius: 10,
  width,
  height,
};

export const SPACING = {
  s: 8,
  m: 16,
  l: 24,
  xl: 40,
};
