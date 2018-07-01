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

import type { Action, ThunkAction } from './types';
import { 
  InteractionManager
} from "react-native";

function updateMyPlaner(plan): ThunkAction {
  return dispatch => {
    // TODO: Make sure reducers clear their state
    return dispatch({
      type: "UPDATE_PLAN",
      plan
    });
  };
}

function updateMyPlanerDestination(destination): ThunkAction {
	return (dispatch, getState) => {
		const plan = {
			mySelectDay: getState().plan.plan.mySelectDay,
			destination: destination,
			detail: getState().plan.plan.detail,
			show: {
				name: destination.name,
				minDate: getState().plan.plan.show.minDate,
				maxDate: getState().plan.plan.show.maxDate,
				myTitleSelectCalendarFr: getState().plan.plan.show.myTitleSelectCalendarFr,
				myTitleSelectCalendarTo: getState().plan.plan.show.myTitleSelectCalendarTo,
				checkedSaved: getState().plan.plan.show.checkedSaved
			},
			resultsNearby: getState().plan.plan.resultsNearby,
			switch: getState().plan.plan.switch
		}
		dispatch(updateMyPlaner(plan))
	}
}

function updateMyPlanerSelectDay(day, min, max): ThunkAction {
	return (dispatch, getState) => {
		const plan = {
			mySelectDay: {
				...getState().plan.plan.mySelectDay,
				[day.dateString]: { selected: true, startingDay: true, endingDay: true, color: '#3f6072' }
			},
			destination: getState().plan.plan.destination,
			detail: getState().plan.plan.detail,
			show: {
				name: getState().plan.plan.show.name,
				minDate: min,
				maxDate: max,
				myTitleSelectCalendarFr: min,
				myTitleSelectCalendarTo: getState().plan.plan.show.myTitleSelectCalendarTo,
				checkedSaved: getState().plan.plan.show.checkedSaved
			},
			resultsNearby: getState().plan.plan.resultsNearby,
			switch: getState().plan.plan.switch
		}
		dispatch(updateMyPlaner(plan))
	}
}

function updateMyPlanerDay(day, selectedDay, mergeObj, obj): ThunkAction {
	return (dispatch, getState) => {
		const plan = {
			mySelectDay: {
				...selectedDay,
                ...mergeObj,
                ...obj
			},
			destination: getState().plan.plan.destination,
			detail: getState().plan.plan.detail,
			show: {
				name: getState().plan.plan.show.name,
				minDate: getState().plan.plan.show.minDate,
				maxDate: getState().plan.plan.show.maxDate,
				myTitleSelectCalendarFr: getState().plan.plan.show.minDate,
				myTitleSelectCalendarTo: day,
				checkedSaved: getState().plan.plan.show.checkedSaved
			},
			resultsNearby: getState().plan.plan.resultsNearby,
			switch: getState().plan.plan.switch
		}
		dispatch(updateMyPlaner(plan))
	}
}

function updateMyPlanerDetail(mergeArr): ThunkAction {
	return (dispatch, getState) => {
		const plan = {
			mySelectDay: getState().plan.plan.mySelectDay,
			destination: getState().plan.plan.destination,
			detail: mergeArr,
			show: {
				name: getState().plan.plan.show.name,
				minDate: getState().plan.plan.show.minDate,
				maxDate: getState().plan.plan.show.maxDate,
				myTitleSelectCalendarFr: getState().plan.plan.show.myTitleSelectCalendarFr,
				myTitleSelectCalendarTo: getState().plan.plan.show.myTitleSelectCalendarTo,
				checkedSaved: getState().plan.plan.show.checkedSaved
			},
			resultsNearby: getState().plan.plan.resultsNearby,
			switch: getState().plan.plan.switch
		}
		dispatch(updateMyPlaner(plan))
	}
}

function updateMyPlanerSavedOffline(value): ThunkAction {
	return (dispatch, getState) => {
		const plan = {
			mySelectDay: getState().plan.plan.mySelectDay,
			destination: getState().plan.plan.destination,
			detail: getState().plan.plan.detail,
			show: {
				name: getState().plan.plan.show.name,
				minDate: getState().plan.plan.show.minDate,
				maxDate: getState().plan.plan.show.maxDate,
				myTitleSelectCalendarFr: getState().plan.plan.show.myTitleSelectCalendarFr,
				myTitleSelectCalendarTo: getState().plan.plan.show.myTitleSelectCalendarTo,
				checkedSaved: value
			},
			resultsNearby: getState().plan.plan.resultsNearby,
			switch: getState().plan.plan.switch
		}
		dispatch(updateMyPlaner(plan))
	}
}

function updateMyPlanerSwitch(value): ThunkAction {
	return (dispatch, getState) => {
		const plan = {
			mySelectDay: getState().plan.plan.mySelectDay,
			destination: getState().plan.plan.destination,
			detail: getState().plan.plan.detail,
			show: {
				name: getState().plan.plan.show.name,
				minDate: getState().plan.plan.show.minDate,
				maxDate: getState().plan.plan.show.maxDate,
				myTitleSelectCalendarFr: getState().plan.plan.show.myTitleSelectCalendarFr,
				myTitleSelectCalendarTo: getState().plan.plan.show.myTitleSelectCalendarTo,
				checkedSaved: getState().plan.plan.show.checkedSaved
			},
			resultsNearby: getState().plan.plan.resultsNearby,
			switch: value
		}
		dispatch(updateMyPlaner(plan))
	}
}

function resetMyPlanerShow(): ThunkAction {
	return (dispatch, getState) => {
		const plan = {
			mySelectDay: {},
			destination: getState().plan.plan.destination,
			detail: getState().plan.plan.detail,
			show: {
				name: getState().plan.plan.show.name,
				minDate: null,
				maxDate: null,
				myTitleSelectCalendarFr: null,
				myTitleSelectCalendarTo: null,
				checkedSaved: getState().plan.plan.show.checkedSaved
			},
			resultsNearby: getState().plan.plan.resultsNearby,
			switch: getState().plan.plan.switch
		}
		dispatch(updateMyPlaner(plan))
	}
}

function resetMyPlanerDetail(): ThunkAction {
	return (dispatch, getState) => {
		const plan = {
			mySelectDay: getState().plan.plan.mySelectDay,
			destination: getState().plan.plan.destination,
			detail: [],
			show: {
				name: getState().plan.plan.show.name,
				minDate: getState().plan.plan.show.minDate,
				maxDate: getState().plan.plan.show.maxDate,
				myTitleSelectCalendarFr: getState().plan.plan.show.myTitleSelectCalendarFr,
				myTitleSelectCalendarTo: getState().plan.plan.show.myTitleSelectCalendarTo,
				checkedSaved: getState().plan.plan.show.checkedSaved
			},
			resultsNearby: getState().plan.plan.resultsNearby,
			switch: getState().plan.plan.switch
		}
		dispatch(updateMyPlaner(plan))
	}
}

function resetAll(): ThunkAction {
	return (dispatch, getState) => {
		const plan = {
		    mySelectDay: {},
		    destination: {},
		    detail: [],
		    show: {
		      name: null,
		      minDate: null,
		      maxDate: null,
		      myTitleSelectCalendarFr: null,
		      myTitleSelectCalendarTo: null,
		      checkedSaved: false
		    },
		    resultsNearby: [],
		    switch: false
		}
		dispatch(updateMyPlaner(plan))
	}
}

module.exports = {
	updateMyPlanerDestination,
	updateMyPlanerSelectDay,
	updateMyPlanerDay,
	updateMyPlanerDetail,
	updateMyPlanerSavedOffline,
	updateMyPlanerSwitch,
	resetMyPlanerShow,
	resetMyPlanerDetail,
	resetAll
};
