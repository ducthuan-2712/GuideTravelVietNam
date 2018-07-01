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

'use strict';

// Depdencies
import React from "react";

// Components
import { 
  StyleSheet,
  Platform,
  Dimensions
} from "react-native";
import Carousel from 'react-native-snap-carousel';
import SliderEntry from './SliderEntry';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

type Props = {

};

class SlideCarousel extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {}

    this._renderItem = this._renderItem.bind(this);
  }

  render() {
    return (
      <Carousel
        data={this.props.source}
        renderItem={this._renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={1}
        containerCustomStyle={styles.slider}
        contentContainerCustomStyle={styles.sliderContentContainer}
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
      return <SliderEntry data={item} even={(index + 1) % 2 === 0} onPress={this.props.onPress} />;
  }
}

var styles = StyleSheet.create({
  slider: {
    marginTop: 10,
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10,
  },
});

module.exports = SlideCarousel;
