// Depdencies
import React from 'react'

// Components
import {
  Image,
  Platform,
  View
} from 'react-native'
import { Text } from '../../../common/GText'
import GColors from '../../../common/GColors'
import GImage from '../../../common/GImage'
import StyleSheet from '../../../common/GStyleSheet'

type Props = {
  style: any;
  marker: Object;
};

class GalleryMarker extends React.Component {
  props: Props

  render() {
    const { style, marker, number } = this.props

    return (
      <View style={[styles.container, style]}>
        <View style={styles.bubble}>
          <Text style={styles.iconAndroid}>
            {number+1}
          </Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
        <Text style={{color: GColors.darkText, fontWeight: 'bold'}}>{(marker.name || '').capitalize()}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bubble: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#e8e9f4',
    borderColor: GColors.darkText,
    ios: {
      borderWidth: 3,
    },
    android: {
      borderWidth: 2,
    },
    borderRadius: 30,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 6,
    borderTopColor: GColors.darkText,
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 4,
    borderTopColor: GColors.darkText,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  iconAndroid: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 20,
    color: GColors.darkText,
  }
})

module.exports = GalleryMarker
