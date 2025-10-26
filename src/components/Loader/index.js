import React from 'react'
import { View, ActivityIndicator, Image, Text } from 'react-native'
import styles from './styles'
import color from '@color'


const Loader = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <View style={{ ...styles.loader, zIndex: 100 }}>
        <ActivityIndicator size="large" color={color.purple} />
      </View>
    )
  }
  return null
}

export default Loader
