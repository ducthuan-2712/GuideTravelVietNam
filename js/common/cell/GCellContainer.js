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

import GCell from "./GCell";
import GCellEmpty from "./GCellEmpty";
import PureListView from "../PureListView";

type Props = {
  sessions: Array<Session>,
  renderEmptyList?: (day: number) => ReactElement
};

type State = {
  
};

class GCellContainer extends React.Component {
  props: Props;
  state: State;
  _innerRef: ?PureListView;

  constructor(props: Props) {
    super(props);
    this.state = {
      source: props.source
    };

    this._innerRef = null;

    (this: any).renderRow = this.renderRow.bind(this);
    (this: any).renderEmptyList = this.renderEmptyList.bind(this);
    (this: any).storeInnerRef = this.storeInnerRef.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.source !== this.props.source
    ) {
      this.setState({
        source: nextProps.source
      });
    }
  }

  render() {
    return (
      <PureListView
        ref={this.storeInnerRef}
        data={this.state.source}
        renderRow={this.renderRow}
        {...(this.props: any) /* flow can't guarantee the shape of props */}
        renderEmptyList={this.renderEmptyList}
      />
    );
  }

  renderRow(session: Session) {
    return (
      <GCell
        onPress={_ => this.props.onPress(session)}
        session={session}
        firstRow={this.isFirstSessionCell(session.id)}
      />
    );
  }

  renderEmptyList(containerHeight: number): ?ReactElement {
    // if listview onLayout hasn't updated container height, don't bother
    if (containerHeight === 0) {
      return null;
    } // TODO: different fix
    // otherwise render fallback cta with a valid and centerable height
    return (
      <GCellEmpty containerHeight={containerHeight} />
    )
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }

  scrollTo(...args: Array<any>) {
    this._innerRef && this._innerRef.scrollTo(...args);
  }

  getScrollResponder(): any {
    return this._innerRef && this._innerRef.getScrollResponder();
  }

  isFirstSessionCell(id) {
    const keys = Object.keys(this.state.source);
    const innerKeys = Object.keys(this.state.source[keys[0]]);
    return id === innerKeys[0];
  }
}

module.exports = GCellContainer;
