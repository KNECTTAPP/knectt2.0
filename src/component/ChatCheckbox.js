import React, {useState,Component} from 'react';
import PropTypes from 'prop-types';
import {
    Platform,
    View,
    Button,
    Text,
    Image,
    Linking,
    Dimensions,
    TouchableWithoutFeedback,
    Alert,
    StyleSheet,
    Pressable,
    ScrollView,
    TouchableOpacity,
    FlatList,
    StatusBar,
  } from "react-native";
import CheckBox from '@react-native-community/checkbox';
export default class ChatCheckbox extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          stepIndex: this.props.stepIndex,
          loading: true,
          value: '',
          trigger:'2',
          steps: this.props.steps,
          waitAction: this.props.step.waitAction
        };
    
      }

      

  render() {
    const [screentow,setScreentow] = useState(true);
    const [isSelected, setSelection] = useState([]);
    const secheckbox =(value)=>{
        let oldArray = isSelected;
        setSelection(oldArray.push(value));
        setScreentow(false);
    }
    return (
        <View>    
                <View>
                    <CheckBox  value={(isSelected.indexOf('mom') >= 0 )? true:false} isChecked={(isSelected.indexOf('mom') >= 0 )? true:false } style={styles.checkbox}   onValueChange={() =>{secheckbox('mom')}} />
                    <Text style={styles.label}>Open on Saturday { isSelected.indexOf('mom') } </Text>
                </View>
                <View>
                    <CheckBox value={(isSelected.indexOf('sun') >= 0 )? true:false} style={styles.checkbox}    onValueChange={() =>{secheckbox('sun')}}/>
                    <Text style={styles.label}>Open on Sunday {screentow} dfdf</Text>
                </View>

            </View>
        );
  }
}

ChatCheckbox.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
  step: PropTypes.object,
  previousStep: PropTypes.object,
}

ChatCheckbox.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
  step: undefined,
  previousStep: undefined,
}