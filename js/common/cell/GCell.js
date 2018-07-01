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
 */
"use strict";

import React from "react";

import { 
  TouchableOpacity, 
  View,
} from "react-native";
import StyleSheet from "../GStyleSheet";
import GColors from "../GColors";
import GFonts from "../GFonts";
import { Text } from "../GText";
import GImage from "../GImage";
import GRating from "../GRating";

import { API_KEY_GOOGLE } from "../../env";

/* Constants
============================================================================= */

const CELL_PADDING_TOP = 15,
  CELL_PADDING_RIGHT = 15,
  CELL_PADDING_BOTTOM = 15,
  DURATION_FONT_SIZE = 14,
  CELL_LEFT = 15;

/* =============================================================================
<GCell />
============================================================================= */

String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase() });
};

class GCell extends React.Component {
  props: {
    session: Session,
    showStartEndTime: boolean,
    onPress: ?() => void,
    style: any
  }

  render() {
    const { session } = this.props;
    return (
      <View style={[styles.cell, this.props.style]}>
        {this.renderContent(session)}
      </View>
    );
  }

  renderContent(session) {
    let getSourceAPI = session.photos
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${session.photos[0].photo_reference}&key=${API_KEY_GOOGLE}`
      : {}

    let contentImage = (
      <View style={styles.imgage}>
        <GImage 
          style={styles.img}
          sizeWidth={56}
          sizeHeight={56}
          sizeBorderRadius={56}
          source={getSourceAPI}
        />
      </View>
    )

    let contentInfo = (
      <View style={styles.content}>
        {this.renderTitle(session)}
        {this.renderStar(session)}
        {this.renderMeta(session)}
      </View>
    )

    if(this.props.onView) {
      return (
        <View style={styles.container}>
          {session.photos && contentImage}
          {contentInfo}
          <View style={styles.right}>
            <TouchableOpacity 
              activeOpacity={0.75} 
              onPress={this.props.onPress}
              style={styles.btnCircle}
            >
              <Text style={styles.txtCircle}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    if (this.props.onPress) {
      return (
        <TouchableOpacity 
          activeOpacity={0.75} 
          onPress={this.props.onPress}
          style={styles.container}
        >
          {session.photos && contentImage}
          {contentInfo}
        </TouchableOpacity>
      )
    }
  }

  renderTitle(session) {
    if(session.name) {
      return (
        <View key={`${session.id}_title`} style={styles.titleSection}>
          <Text numberOfLines={3} style={styles.titleText}>
            {session.name}
          </Text>
        </View>
      );
    }
  }

  renderStar(session) {
    if(session.rating) return <GRating star={session.rating} />
  }

  renderMeta(session) {
    if(session.types) {
      return (
        <Text
          key={`${session.id}_meta`}
          numberOfLines={1}
          style={styles.duration}
        >
          <Text style={{ color: GColors.colorForLocation(session.location) }}>
            {session.types.map((text, index) => {
              if(index != 0) return
              return text.capitalize()
            })}
          </Text>
        </Text>
      );
    }
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  cell: {
    paddingTop: CELL_PADDING_TOP,
    paddingBottom: CELL_PADDING_BOTTOM,
    paddingLeft: CELL_LEFT,
    paddingRight: CELL_PADDING_RIGHT,
  },
  content: {
    flex: 1,
    paddingLeft: CELL_LEFT,
    justifyContent: "flex-start",
    // backgroundColor: 'red'
  },
  titleSection: {
    flexDirection: "row",
    // alignItems: "center"
  },
  titleText: {
    flex: 1,
    fontSize: GFonts.normalize(14),
    color: GColors.tangaroa,
    marginTop: -5
  },
  duration: {
    fontSize: DURATION_FONT_SIZE,
    color: GColors.colorWithAlpha("tangaroa", 0.6)
  },
  btnCircle: {
    width: 24,
    height: 24,
    borderColor: 'silver',
    borderWidth: 2,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtCircle: {
    textAlign: 'center',
    color: 'silver'
  }
});

module.exports = GCell;
