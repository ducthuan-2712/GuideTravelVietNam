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
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";
import { Text, Heading4 } from "../../../../common/GText";
import StyleSheet from "../../../../common/GStyleSheet";
import GImage from "../../../../common/GImage";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

type Props = {

};

class Gallery extends React.Component {
  props: Props;

  openGallery(index, data) {
    let synsData = {
      index,
      data
    }
    this.props.onPress(synsData)
  }

  render() {
    const { source, apiKeyGoogle } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>From Around The Place</Text>
        <ScrollView
          directionalLockEnabled={false}
          scrollEventThrottle={100}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={true}
        >
          <View style={styles.containers}>
            {source.result.photos.map((data, index) => {
              if(!data.photo_reference) return null
                
              return (
                <TouchableOpacity 
                  key={`gallery-${index}`} 
                  accessibilityTraits="button"
                  activeOpacity={0.8}
                  onPress={_ => this.openGallery(index, source)}
                  style={styles.img}
                >
                  <GImage
                    sizeWidth={viewportWidth/3}
                    sizeHeight={viewportWidth/4}
                    sizeBorderRadius={4}
                    source={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.photo_reference}&key=${apiKeyGoogle}`}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
    paddingBottom: 20,
  },
  text: {
    color: '#1a1917',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  containers: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 20,
  },
  img: {
    marginRight: 10,
  }
});

module.exports = Gallery;
