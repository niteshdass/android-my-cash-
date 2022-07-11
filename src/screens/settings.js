import React, { useState } from 'react'
import {
    useColorModeValue,
   
} from 'native-base';
import { AntDesign } from '@expo/vector-icons'
import AddBudgetPurpose from '../components/settings/Add_budget_purpose';
import AnimatedColorBox from '../components/animated-color-box'
import Navbar from '../components/navbar'
import Masthead from '../components/masthead'


const SettingScreen = () => {
    return (
        <AnimatedColorBox
            flex={1}
            bg={useColorModeValue('warmGray.50', 'warmGray.900')}
            w="full"
        >
            <Masthead
                title="App settings"
                image={require('../assets/trans.jpg')}
            >
                <Navbar />
            </Masthead>
            <AddBudgetPurpose />
        </AnimatedColorBox>
    )
}

export default SettingScreen
