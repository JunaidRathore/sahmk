// src/screens/HomeScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import AnimatedButton from '../components/AnimatedButton';
import { RootStackParamList } from '../types/navigation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
  const [chartWidth, setChartWidth] = useState(SCREEN_WIDTH - 40);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [searchText, setSearchText] = useState('');

  // Animation values
  const headerOpacity = useSharedValue(0);
  const searchBarTranslateX = useSharedValue(-SCREEN_WIDTH);
  const chartScale = useSharedValue(0.9);
  const chartOpacity = useSharedValue(0);
  const navTranslateY = useSharedValue(50);

  const data = {
    labels: ['1D', '1W', '1M', '3M', '1Y', 'YTD', '5Y', 'Max'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  useEffect(() => {
    startEntryAnimations();
  }, []);

  useEffect(() => {
    if (route.params?.searchText) {
      setSearchText(route.params.searchText);
    }
  }, [route.params?.searchText]);

  const startEntryAnimations = () => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    searchBarTranslateX.value = withDelay(
      300,
      withSpring(0, {
        damping: 15,
        stiffness: 100
      })
    );
    chartScale.value = withDelay(
      600,
      withSpring(1, {
        damping: 15,
        stiffness: 100
      })
    );
    chartOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    navTranslateY.value = withDelay(
      900,
      withSpring(0, {
        damping: 15,
        stiffness: 100
      })
    );
  };

  const handleChartLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setChartWidth(width - 30);
  }, []);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  const getChartHeight = () => {
    return SCREEN_HEIGHT * 0.3;
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value
  }));

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: searchBarTranslateX.value }]
  }));

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
    transform: [{ scale: chartScale.value }]
  }));

  const navAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: navTranslateY.value }]
  }));

  return (
    <SafeAreaView style={styles.container} onLayout={handleContainerLayout}>
      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AnimatedView style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerLeft}>
            <AnimatedButton style={styles.iconButton}>
              <Icon name='bell' size={24} color='#fff' />
            </AnimatedButton>
            <AnimatedButton
              style={styles.iconButton}
              onPress={handleSearchPress}
            >
              <Icon name='search' size={24} color='#fff' />
            </AnimatedButton>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.welcomeText}>تحتاج مساعدة؟</Text>
            <Text style={styles.userName}>هلا، عبدالرحمن</Text>
          </View>
        </AnimatedView>

        <Animated.Text style={[styles.sectionTitle, headerAnimatedStyle]}>
          الرئيسية
        </Animated.Text>

        {/* Search Bar */}
        <AnimatedView style={[styles.searchContainer, searchBarAnimatedStyle]}>
          <Icon
            name='search'
            size={20}
            color='#666'
            style={styles.searchIcon}
          />
          <TouchableOpacity
            style={styles.searchInput}
            onPress={handleSearchPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.searchPlaceholder,
                searchText ? styles.searchText : null
              ]}
            >
              {searchText || 'اسم السهم أو الرمز'}
            </Text>
          </TouchableOpacity>
          {searchText ? (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.clearButton}
            >
              <Icon name='x-circle' size={18} color='#666' />
            </TouchableOpacity>
          ) : null}
        </AnimatedView>

        {/* Chart Section */}
        <AnimatedView
          style={[styles.chartContainer, chartAnimatedStyle]}
          onLayout={handleChartLayout}
        >
          <Text style={styles.chartTitle}>أدوات سهمك</Text>
          <LineChart
            data={data}
            width={chartWidth}
            height={getChartHeight()}
            yAxisLabel=''
            yAxisSuffix=''
            chartConfig={{
              backgroundColor: '#1E1E1E',
              backgroundGradientFrom: '#1E1E1E',
              backgroundGradientTo: '#1E1E1E',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#4CAF50',
                fill: '#4CAF50'
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: 'rgba(255, 255, 255, 0.1)',
                strokeWidth: 1
              },
              fillShadowGradient: '#4CAF50',
              fillShadowGradientOpacity: 0.2
            }}
            bezier
            style={styles.chart}
            withVerticalLabels={false}
            withHorizontalLabels={false}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeframeScrollContent}
          >
            {data.labels.map((label) => (
              <AnimatedButton
                key={label}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === label && styles.timeframeButtonActive
                ]}
                onPress={() => {
                  setSelectedTimeframe(label);
                  chartScale.value = withSpring(
                    0.95,
                    {
                      damping: 10,
                      stiffness: 100
                    },
                    () => {
                      chartScale.value = withSpring(1);
                    }
                  );
                }}
              >
                <Text
                  style={[
                    styles.timeframeText,
                    selectedTimeframe === label && styles.timeframeTextActive
                  ]}
                >
                  {label}
                </Text>
              </AnimatedButton>
            ))}
          </ScrollView>
        </AnimatedView>
      </AnimatedScrollView>

      {/* Bottom Navigation */}
      <AnimatedView style={[styles.bottomNav, navAnimatedStyle]}>
        <AnimatedButton style={styles.navItem}>
          <Icon name='user' size={24} color='#666' />
        </AnimatedButton>
        <AnimatedButton style={styles.navItem}>
          <Icon name='file-text' size={24} color='#666' />
        </AnimatedButton>
        <AnimatedButton style={styles.navItem}>
          <Icon name='box' size={24} color='#666' />
        </AnimatedButton>
        <AnimatedButton style={styles.navItem}>
          <Icon name='layers' size={24} color='#666' />
        </AnimatedButton>
        <AnimatedButton style={[styles.navItem, styles.navItemActive]}>
          <Icon name='home' size={24} color='#4CAF50' />
        </AnimatedButton>
      </AnimatedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 80
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 15
  },
  headerRight: {
    alignItems: 'flex-end'
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeText: {
    color: '#666',
    fontSize: 14
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    textAlign: 'right'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    justifyContent: 'center',
    height: '100%'
  },
  searchPlaceholder: {
    color: '#666',
    textAlign: 'right',
    fontSize: 14,
  },
  searchText: {
    color: '#fff'
  },
  clearButton: {
    padding: 8,
    marginLeft: 8
  },
  chartContainer: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 15
  },
  chartTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'right'
  },
  chart: {
    borderRadius: 16,
    marginVertical: 10
  },
  timeframeScrollContent: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    gap: 10
  },
  timeframeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4
  },
  timeframeButtonActive: {
    backgroundColor: '#4CAF50'
  },
  timeframeText: {
    color: '#666',
    fontSize: 14
  },
  timeframeTextActive: {
    color: '#fff'
  },
  bottomNav: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  navItemActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8
  }
});

export default HomeScreen;
