// /components/SearchBar.tsx
import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Utils} from '@Utils';
import {fontSize, fontFamily} from '@constants';

const SearchBar = ({value, onChangeText}: any) => {
  return (
    <View style={styles.container}>
      <Icon name="magnify" size={24} color="#999" />
      <TextInput
        placeholder="Search users..."
        placeholderTextColor="#999"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: Utils.calculateWidth(30),
    paddingHorizontal: Utils.calculateWidth(16),
    height: Utils.calculateHeight(50),
    marginVertical: Utils.calculateHeight(12),
    width:'80%'
  },
  input: {
    flex: 1,
    marginLeft: Utils.calculateWidth(8),
    fontSize: fontSize.fontSize_14,
    fontFamily: fontFamily.Book,
    color: '#000',
  },
});
