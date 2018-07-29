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
    const { style, marker, number, slideIndex } = this.props
    const activeBubble = number == slideIndex ? styles.bubbleActive : null
    const activeiconAndroid = number == slideIndex ? styles.iconAndroidActive : null

    return (
      <View style={[styles.container, style]}>
        <View style={[styles.bubble, activeBubble]}>
          <Text style={[styles.iconAndroid, activeiconAndroid]}>
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
    backgroundColor: 'white',
    borderColor: GColors.darkText,
    ios: {
      borderWidth: 3,
    },
    android: {
      borderWidth: 2,
    },
    borderRadius: 30,
  },
  bubbleActive: {
    backgroundColor: '#fe9375',
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
    lineHeight: 20,
    color: GColors.darkText,
  },
  iconAndroidActive: {
    color: 'white',
  }
})

module.exports = GalleryMarker
