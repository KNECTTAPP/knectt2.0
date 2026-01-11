import React, { Component } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

import CalendarDayComponent from '../component/CalendarDayComponent';
import CalendarHeaderComponent from '../component/CalendarHeaderComponent';

let calendarDate = moment();

class ViewInventoryMain extends Component {

    constructor(props) {
        super(props);

        this.state = {
            calendarDate: calendarDate.format('YYYY-MM-DD'),
            horizontal: false
        };

        this.onPressArrowLeft = this.onPressArrowLeft.bind(this);
        this.onPressArrowRight = this.onPressArrowRight.bind(this);
        this.onPressListView = this.onPressListView.bind(this);
        this.onPressGridView = this.onPressGridView.bind(this);
        this.onDayPress = this.onDayPress.bind(this);
    }

    onPressArrowLeft() {
        calendarDate = calendarDate.add(-1, 'month');
        this.updateCalendarDate();
    }

    onPressArrowRight() {
        calendarDate = calendarDate.add(1, 'month');
        this.updateCalendarDate();
    }

    onPressListView() {
        this.setState({ horizontal: true });
    }

    onPressGridView() {
        this.setState({ horizontal: false });
    }

    onDayPress(date) {
        calendarDate = moment(date.dateString);
        this.updateCalendarDate();
    }

    updateCalendarDate() {
        this.setState({
            calendarDate: calendarDate.format('YYYY-MM-DD')
        });
    }

    render() {
        return (
            <View style={{ width: '100%', height: 200 }}>
                <Calendar
                    current={this.state.calendarDate}
                    dayComponent={CalendarDayComponent}
                    calendarHeaderComponent={CalendarHeaderComponent}
                    headerData={{
                        calendarDate: calendarDate.format('DD MMM, YYYY')
                    }}
                    style={{
                        paddingLeft: 0, paddingRight: 0
                    }}
                    onPressArrowLeft={this.onPressArrowLeft}
                    onPressArrowRight={this.onPressArrowRight}
                    onPressListView={this.onPressListView}
                    onPressGridView={this.onPressGridView}
                    markedDates={{
                        '2019-02-23': { soldOut: false, blocked: false, inventory: 2 },
                        '2019-02-24': { soldOut: false, blocked: false, inventory: 2 },
                        '2019-02-25': { soldOut: false, blocked: true, inventory: 0 },
                        '2019-02-26': { soldOut: true, blocked: true, inventory: 2 }
                    }}
                    horizontal={this.state.horizontal}
                    onDayPress={this.onDayPress}
                />
            </View>
        );
    }
}

export default ViewInventoryMain;