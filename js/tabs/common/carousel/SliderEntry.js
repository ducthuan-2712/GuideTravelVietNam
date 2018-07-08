// Depdencies
import React from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native'

// Components
import GRating from '../../../common/GRating'
import GImage from '../../../common/GImage'

// Config
import { API_KEY_GOOGLE } from '../../../env'

// Constants
const IS_IOS = Platform.OS === 'ios'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}
const slideHeight = viewportHeight * 0.39
const slideWidth = wp(55)
const itemHorizontalMargin = wp(2)
const sliderWidth = viewportWidth
const itemWidth = slideWidth + itemHorizontalMargin * 2
const entryBorderRadius = 9

String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase() })
}

export default class SliderEntry extends React.Component {
    renderImage() {
      const { data, even } = this.props

      if (!data.photos) return null
      return (
        <GImage
          source={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.photos[0].photo_reference}&key=${API_KEY_GOOGLE}`} 
          sizeWidth={itemWidth/1.1}
          sizeHeight={slideHeight/1.7}
          sizeBorderRadius={entryBorderRadius}
          style={styles.image}
        />
      );
    }

    render () {
      const { data, even } = this.props

      return (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.slideInnerContainer}
          onPress={() => this.props.onPress(data)}
        >
          <View style={styles.shadow} />
          <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
            {this.renderImage()}
          </View>
          <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
              numberOfLines={2}
            >
              { data.name }
            </Text>
            <GRating star={data.rating} />
            <Text
              style={[styles.types, even ? styles.typesEven : {}]}
              numberOfLines={1}
            >
              {data.types.map((text, index) => {
                if(index != 0) return
                return text.capitalize()
              })}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
}

const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

var styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: entryBorderRadius
  },
  imageContainerEven: {
    backgroundColor: colors.black
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover'
  },
  textContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 20,
    height: 110,
  },
  textContainerEven: {
    // backgroundColor: colors.black
  },
  title: {
    color: colors.black,
    fontSize: 18,
    letterSpacing: 0.5,
    maxHeight: 50,
    overflow: 'hidden'
  },
  titleEven: {
    // color: 'white'
  },
  types: {

  },
  typesEven: {

  }
})