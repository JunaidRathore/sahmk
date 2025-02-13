// src/screens/HomeScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  LayoutChangeEvent,
  ScrollView
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen = () => {
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
  const [chartWidth, setChartWidth] = useState(SCREEN_WIDTH - 40);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

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

  const handleChartLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setChartWidth(width - 30);
  }, []);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  const getChartHeight = () => {
    // Responsive chart height based on screen size
    return SCREEN_HEIGHT * 0.3; // 30% of screen height
  };

  return (
    <SafeAreaView style={styles.container} onLayout={handleContainerLayout}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name='bell' size={24} color='#fff' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name='search' size={24} color='#fff' />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.welcomeText}>تحتاج مساعدة؟</Text>
            <Text style={styles.userName}>هلا، عبدالرحمن</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>الرئيسية</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name='search'
            size={20}
            color='#666'
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='اسم السهم أو الرمز'
            placeholderTextColor='#666'
          />
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer} onLayout={handleChartLayout}>
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
              <TouchableOpacity
                key={label}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === label && styles.timeframeButtonActive
                ]}
                onPress={() => setSelectedTimeframe(label)}
              >
                <Text
                  style={[
                    styles.timeframeText,
                    selectedTimeframe === label && styles.timeframeTextActive
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name='user' size={24} color='#666' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name='file-text' size={24} color='#666' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name='box' size={24} color='#666' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name='layers' size={24} color='#666' />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Icon name='home' size={24} color='#4CAF50' />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 80 // Space for bottom nav
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
    color: '#fff',
    padding: 12,
    textAlign: 'right'
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
