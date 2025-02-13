import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides = [
    {
      id: '1',
      title: 'وصول سهل وسريع',
      description:
        'تطبيقك الذكي للوصول إلى سوق الأسهم بسهولة وسرعة. نحن هنا لمساعدتك في تحقيق أهدافك الاستثمارية',
      image: require('../assets/images/search-illustration.png')
    },
    {
      id: '2',
      title: 'ما هو سهمك؟',
      description: 'سهمك هو مساعدك الشخصي للاستثمار في سوق الأسهم',
      image: require('../assets/images/calculator-illustration.png')
    }
  ];

  const Indicator = () => {
    return (
      <View style={styles.indicatorContainer}>
        {[...Array(2)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                width: width * 0.2, // 20% of screen width
                backgroundColor:
                  index === currentIndex ? '#FFF' : 'rgba(255, 255, 255, 0.2)'
              }
            ]}
          />
        ))}
      </View>
    );
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    } else {
      // Use navigate instead of replace
      navigation.navigate('Home');
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <Indicator />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>التالي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 8
  },
  indicator: {
    height: 2,
    borderRadius: 1
  },
  flatListContent: {
    alignItems: 'center'
  },
  slide: {
    width,
    alignItems: 'center',
    padding: SPACING.l
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  image: {
    width: width * 0.5, // Reduced from 0.8 to 0.5
    height: width * 0.5, // Keeping aspect ratio 1:1
    resizeMode: 'contain'
  },
  textContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.m
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.l,
    lineHeight: 24
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  button: {
    backgroundColor: '#1E1E1E', // Dark background color from your design
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default OnboardingScreen;
