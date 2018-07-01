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

/* Dependencies
============================================================================= */

import React from "react";
import {
  Platform,
  View,
  ScrollView,
  Image,
  PixelRatio,
  InteractionManager
} from "react-native";
import StyleSheet from "./GStyleSheet";
import type { Map } from "../reducers/maps";
import PhotoView from "react-native-photo-view";

/* =============================================================================
<MapView />
============================================================================= */

class MapView extends React.Component {
  props: {
    map: ?Map,
    style?: any,
    zoomable: boolean,
    width: number,
    height?: number
  };

  static defaultProps = {
    zoomable: false
  };

  render() {
    const { map } = this.props;
    const mapRatio =
      map && map.width && map.height ? map.width / map.height : 1;

    if (this.props.zoomable) {
      return (
        <MapViewZoomable
          map={map}
          width={this.props.width}
          height={this.props.height}
          style={this.props.style}
        />
      );
    } else {
      return (
        <MapViewDefault
          map={map}
          width={this.props.width}
          height={this.props.width / mapRatio}
          style={this.props.style}
        />
      );
    }
  }
}

/* =============================================================================
<MapViewDefault />
--------------------------------------------------------------------------------
Default display of 1-3x map images
============================================================================= */

class MapViewDefault extends React.Component {
  _isMounted: boolean;

  state: {
    loaded: boolean
  };

  constructor() {
    super();
    this.state = { loaded: false };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    InteractionManager.runAfterInteractions(() => {
      this._isMounted && this.setState({ loaded: true });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { map, width, height } = this.props;

    return this.state.loaded ? (
      <Image
        style={[styles.defaultMap, { width, height }, this.props.style]}
        source={{ uri: urlForMap(map) }}
      />
    ) : null;
  }
}

/* =============================================================================
<MapViewZoomable />
--------------------------------------------------------------------------------
Zoomable display of 1-3x map images
============================================================================= */

class MapViewZoomable extends React.Component {
  static defaultProps = {
    maximumZoomScale: 2
  };

  render() {
    const { map, width, height } = this.props;

    if (Platform.OS === "ios") {
      const paddingTop = 0;
      const paddingBottom = 80;
      const paddedHeight = height - paddingTop - paddingBottom;
      const paddedWidth = paddedHeight * (map.width / map.height);

      return (
        <ScrollView
          style={[
            styles.zoomableContainer,
            { width, height },
            this.props.style
          ]}
          horizontal={true}
          directionalLockEnabled={false}
          scrollEventThrottle={100}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          maximumZoomScale={1.0001}
          bouncesZoom={true}
        >
          <View style={{ paddingTop, paddingBottom }}>
            <Image
              style={{ width: paddedWidth, height: paddedHeight }}
              source={{ uri: map.x3url }}
            />
          </View>
        </ScrollView>
      );
    } else {
      return (
        <PhotoView
          source={{ uri: map.x3url }}
          maximumZoomScale={this.props.maximumZoomScale}
          style={[{ width, height }, this.props.style]}
        />
      );
    }
  }
}

/* Get Map URL (1-3x) depending on device PixelRatio
============================================================================= */

function urlForMap(map: ?Map): string {
  if (!map) {
    return "";
  }
  switch (PixelRatio.get()) {
    case 1:
      return map.x1url;
    case 2:
      return map.x2url;
    case 3:
      return map.x3url;
  }
  return map.x3url;
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  defaultMap: {
    resizeMode: "contain"
  }
});

/* Export
============================================================================= */
module.exports = MapView;
