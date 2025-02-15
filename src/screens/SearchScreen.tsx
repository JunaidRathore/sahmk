// src/screens/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, {
  SlideInDown,
  SlideInUp,
  FadeInDown
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Static suggestions array
const suggestions = [
  'أرامكو السعودية',
  'سابك',
  'الراجحي',
  'بنك الرياض',
  'موبايلي',
  'stc',
  'معادن',
  'junaid'
];

const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const inputRef = React.useRef<TextInput>(null);
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadRecentSearches();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchText]);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearches = async (searches: string[]) => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const handleSearch = async (text: string) => {
    let newSearches = [text, ...recentSearches.filter((s) => s !== text)];
    if (newSearches.length > MAX_RECENT_SEARCHES) {
      newSearches = newSearches.slice(0, MAX_RECENT_SEARCHES);
    }
    setRecentSearches(newSearches);
    await saveRecentSearches(newSearches);
    navigation.navigate('Home', { searchText: text });
  };

  const handleSubmit = () => {
    if (searchText.trim()) {
      handleSearch(searchText.trim());
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Animated.View entering={SlideInDown.springify()} style={styles.header}>
          <View style={styles.searchBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
            >
              <Icon name='x' size={24} color='#fff' />
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
              placeholder='Search'
              placeholderTextColor='#666'
              selectionColor='#4CAF50'
              autoCapitalize='none'
              autoCorrect={false}
              onSubmitEditing={handleSubmit}
            />
            {searchText ? (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={styles.clearButton}
              >
                <Icon name='x-circle' size={18} color='#666' />
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.springify()} style={styles.content}>
          {showSuggestions
            ? // Suggestions List
              filteredSuggestions.map((suggestion, index) => (
                <Animated.View
                  key={`suggestion-${index}`}
                  entering={FadeInDown.delay(index * 100)}
                >
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleSearch(suggestion)}
                  >
                    <Icon
                      name='search'
                      size={20}
                      color='#666'
                      style={styles.searchIcon}
                    />
                    <Text style={styles.resultText}>{suggestion}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))
            : // Recent Searches
              recentSearches.map((search, index) => (
                <Animated.View
                  key={`recent-${index}`}
                  entering={FadeInDown.delay(index * 100)}
                >
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleSearch(search)}
                  >
                    <Icon
                      name='clock'
                      size={20}
                      color='#666'
                      style={styles.searchIcon}
                    />
                    <Text style={styles.resultText}>{search}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomColor: '#1E1E1E',
    borderBottomWidth: 1
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    paddingHorizontal: 8,
    height: 50
  },
  closeButton: {
    padding: 8,
    marginRight: 8
  },
  clearButton: {
    padding: 8,
    marginLeft: 8
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'right'
  },
  content: {
    flex: 1,
    paddingTop: 16
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  searchIcon: {
    marginRight: 16
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'right',
    flex: 1
  }
});

export default SearchScreen;
