/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */

'use strict'

// Depdencies
import React from 'react'

// Components
import { 
  StyleSheet,
  Platform,
  Dimensions,
  View
} from 'react-native';
import Carousel from 'react-native-snap-carousel'
import SliderEntry from './SliderEntry'
import GCell from '../../../common/cell/GCell'
import GColors from '../../../common/GColors'
import { Text } from '../../../common/GText'

const IS_IOS = Platform.OS === 'ios'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const slideHeight = viewportHeight * 0.36
const slideWidth = wp(75)
const itemHorizontalMargin = wp(2)

const sliderWidth = viewportWidth
const itemWidth = slideWidth + itemHorizontalMargin * 2

class SlideCarousel extends React.Component {
  props: Props

  constructor(props) {
    super(props);
    this.state = {}

    this._renderItem = this._renderItem.bind(this);
  }

  _handle(slideIndex) {
    const { customMap } = this.props
    if (customMap) {
      this.props.onSlideIndex && this.props.onSlideIndex(slideIndex)
    }
  }

  render() {
    const { customMap } = this.props

    return (
      <Carousel
        data={this.props.source}
        renderItem={this._renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={1}
        containercustomMap={customMap ? styles.sliderCustom : styles.slider}
        contentContainercustomMap={!customMap && styles.sliderContentContainer}
        onSnapToItem={(slideIndex) => this._handle(slideIndex)}
        // useScrollView={true}
        // enableMomentum={true}
        // loop={true}
        // activeAnimationType={'center'}
        // activeAnimationOptions={{
        //   friction: 4,
        //   tension: 40
        // }}
      />
    );
  }

  _renderItem ({item, index}) {
    const { customMap, routes, source, coords } = this.props
    if (customMap) {
      return (
        <View style={styles.items}>
          <View style={styles.item}>
            <GCell
              onPress={_ => this.props.onPress(item)}
              session={item}
            />
          </View>
          {index != source.length-1 && coords ? this._renderLeg(routes.legs, index) : null}
        </View>
      )
    }
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        onPress={this.props.onPress}
      />
    )
  }

  _renderLeg(routes, index) {
    return (
      <View style={styles.box}>
        <Text style={[styles.text, { fontWeight: 'bold' }]}>{routes[index].distance.text}</Text>
        <Text style={styles.text}>{routes[index].duration.text}</Text>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  slider: {
    marginTop: 10,
    overflow: 'visible', // for custom animations
  },
  sliderCustom: {
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10,
  },
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
    width: itemWidth
  },
  item: {
    width: sliderWidth / 1.6,
  },
  box: {
    borderColor: GColors.lineSilver,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: GColors.lightLineSilver,
  },
  text: {
    fontSize: 12,
  }
})

module.exports = SlideCarousel
