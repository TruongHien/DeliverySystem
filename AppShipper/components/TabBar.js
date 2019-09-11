import React from 'react';
import { View } from 'react-native'
import { connect } from 'react-redux'
import {Badge} from 'react-native-elements'
const mapStateToProps = (state) => {
    return {
        count: state.count
    }
}
class TabBar extends React.PureComponent {
    render() {
        return (
            <View>
            {this.props.count>0?
            <Badge status="error"
            containerStyle={{ position: 'absolute', top: -30, right: -16, width:30, height:30 }} 
            value={this.props.count}
            >
            </Badge>:
            null
            }
            </View>
        );
    }
}
export default connect(mapStateToProps)(TabBar)
