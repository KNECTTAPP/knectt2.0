import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import CalendarStrip from 'react-native-calendar-strip'
import moment from 'moment'

const CalenderScreen = () => {
    let datesWhitelist = [
        {
            start: moment(),
            end: moment().add(2, 'days')
        }
    ]
    const onDateSelected = selectedDate => {
        
        alert(selectedDate.format('YYYY-MM-DD'));
      }
    return (
        <View style={{ height: 10, width: '100%' }}>
            <CalendarStrip
                datesWhitelist={datesWhitelist}
                onDateSelected={onDateSelected}
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{
                    type: 'background',
                    duration: 200,
                    borderWidth: 1,
                    borderHighlightColor: '#132742',
                    color: '#FFF',
                    highlightColor: '#132742',
                }}
                style={{ height: 100 }}
                calenderHeaderStyle={{ color: '#F79489' }}
                calendarColor={{ color: '#F79489' }}
                dateNumberStyle={{ color: '#F79489' }}
                dateNameStyle={{ color: '#F79489' }}
                iconContainer={{ flex: 0.1 }}
                highlightDateNumberStyle={{ color: '#FFF' }}
                highlightDateNameStyle={{ color: '#FFF' }}
                disabledDateNumberStyle={'pink'}
                dateContainerStyle={{ color: '#F79489' }}
            />
        </View>
    )
}
const style = StyleSheet.create({

})
export default CalenderScreen;