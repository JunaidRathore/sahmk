import React from 'react';
import { Animated, TouchableOpacity } from 'react-native';

const AnimatedButton = ({ children, style, onPress }: any) => {
  const scaleValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }]
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedButton;
