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
import { connect } from "react-redux";
import moment from "moment";

// Components
import { 
  View,
  Image,
  Animated
} from "react-native";
import { Text, HeaderTitle } from "../../../common/GText";
import StyleSheet from "../../../common/GStyleSheet";
import GButton from "../../../common/GButton";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

// Page
import TopContainer from "./top/TopContainer"
import BottomContainer from "./bottom/BottomContainer"

// Config
import { checkLengthInteger } from "../../../core/general"
import {
  loadAPIFromGooglePlace,
  updateMyPlanerDestination,
  updateMyPlanerSelectDay,
  updateMyPlanerDay,
  resetMyPlanerShow
} from "../../../actions";

type Props = {

};

class GMyContainer extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {}

    this.handleCheck = this.handleCheck.bind(this);
    this.handleSelectPlace = this.handleSelectPlace.bind(this);
    this.handleSelectCalendar = this.handleSelectCalendar.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.handlePlanCallback = this.handlePlanCallback.bind(this);
  }

  handleCheck() {
    if(Object.keys(this.props.plan.mySelectDay).length > 0 && this.props.plan.destination) {
      if(this.props.plan.resultsNearby.length != 0) {
        this._push()
      } else {
        Promise.resolve(
          this.props.dispatch(loadAPIFromGooglePlace(this.props.plan.destination, 'nearbysearch', 'GOOGLE_NEARBY_PLAN'))
        ).then(() => {
          this._push()
        })
      }
    }
  }

  _push() {
    this.props.navigator.push({
      plan: true,
      isEdit: false,
      planCallback: this.handlePlanCallback
    })
  }

  handlePlanCallback() {
    const { onPress } = this.props;
    onPress && onPress()
  }

  handleSelectPlace() {
    this.props.navigator.push({
      filter: this.props.destination,
      callback: this.handleCallback
    })
  }

  handleCallback(data) {
    this.props.dispatch(updateMyPlanerDestination(data))
  }

  handleSelectCalendar() {
    this.setState((prevState, props) => {
      return {showCalendar: !prevState.showCalendar};
    });
  }

  handleSelectDay(day) {
    // day = {
    //   year: 2018,
    //   month: 3,
    //   day: 10,
    //   timestamp: 1520640000000,
    //   dateString: "2018-03-10"
    // }
    // timestamp = 86400000/day

    const { plan } = this.props

    if(Object.keys(plan.mySelectDay).length === 0) {
      let min = moment(moment(day.dateString, "YYYY-MM-DD")).format("YYYY-MM-DD")
      let max = moment(moment(day.dateString, "YYYY-MM-DD").add('days', 7)).format("YYYY-MM-DD")

      this.props.dispatch(updateMyPlanerSelectDay(day, min, max))
    } else {
      let min = moment(plan.show.minDate, "YYYY-MM-DD")
      let current = moment(day.dateString, "YYYY-MM-DD")

      if(current > min && Object.keys(plan.mySelectDay).length < 2) {
        let chklength = checkLengthInteger(current - min)
        let mergeObj = {}

        chklength.map((num, index) => {
          let day = moment(moment(plan.show.minDate, "YYYY-MM-DD").add('days', num)).format("YYYY-MM-DD")
          if(index+1 == chklength.length) {
            let obj = {
              [day]: { selected: true, endingDay: true, color: '#fe9274', textColor: 'white' }
            }
            let sourcePlan = plan
            sourcePlan.mySelectDay[sourcePlan.show.minDate].endingDay = false
            sourcePlan.mySelectDay[sourcePlan.show.minDate].color = '#fe9274'
            sourcePlan.mySelectDay[sourcePlan.show.minDate].textColor = 'white'

            this.props.dispatch(updateMyPlanerDay(day, sourcePlan.mySelectDay, mergeObj, obj))
          } else {
            let obj = {
              [day]: { selected: true, color: '#fe9274',  textColor: 'white' }
            }

            mergeObj = {
              ...mergeObj,
              ...obj
            }
          }
        })
      } else {
        this.props.dispatch(resetMyPlanerShow())
      }
    }
  }

  render() {
    const { destination, plan } = this.props;
    const checkDisabled = Object.keys(plan.mySelectDay).length > 0 && plan.destination ? styles.actived : styles.disabled

    return (
      <View style={styles.container}>
        <View style={styles.myEmpty}>
          {!this.state.showCalendar && <Image 
            source={require('../../../filter/img/icon-active.png')}
            style={{width: 120, height: 120, marginBottom: 10}}
          />}
          {!this.state.showCalendar && <HeaderTitle>No Notification Right Now!</HeaderTitle>}
        </View>
        <View style={styles.myBox}>
          <Animated.View style={styles.myBoxContainer}>
            {this.state.showCalendar && <Calendar
              style={styles.calendar}
              minDate={plan.show.minDate || moment(new Date()).format("YYYY-MM-DD")}
              maxDate={plan.show.maxDate}
              disableMonthChange={true}
              firstDay={1}
              markedDates={plan.mySelectDay}
              markingType={'period'}
              theme={{
                todayTextColor: '#fe9274',
              }}
              onDayPress={(day) => this.handleSelectDay(day)}
            />}
            <TopContainer
              plan={plan}
              onPress={this.handleSelectCalendar}
              myTitleSelectCalendarFr={plan.show.myTitleSelectCalendarFr}
              myTitleSelectCalendarTo={plan.show.myTitleSelectCalendarTo}
            />
            <View style={styles.line} />
            <BottomContainer
              plan={plan}
              onPress={this.handleSelectPlace}
            />
          </Animated.View>
          <GButton
            caption="Let's Search"
            onPress={this.handleCheck}
            style={[styles.btn, checkDisabled]}
          />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f7'
  },
  myEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myBox: {
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 30
  },
  myBoxContainer: {
    backgroundColor: 'white',
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 20,
    android: {
      elevation: 1
    }
  },
  btn: {
    marginTop: 10,
    borderRadius: 9
  },
  disabled: {
    backgroundColor: 'silver',
  },
  actived: {
    backgroundColor: '#fe9375',
  },
  line: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5
  }
});

module.exports = connect()(GMyContainer);