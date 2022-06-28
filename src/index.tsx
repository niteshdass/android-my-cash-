import React, { useState } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import MainScreen from './screens/main-screen'
import AboutScreen from './screens/about-screen'
import LoanScreen from './screens/loan'
import Sidebar from './components/sidebar'
import SettingScreen from './screens/settings'
// import Logout from './screens/logout'

const Drawer = createDrawerNavigator()

const App = () => {
  const [auth, setAuth] = useState(false);

  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={props => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'back',
        overlayColor: '#00000000'
      }}
    >
      <Drawer.Screen name="Main" component={() => <MainScreen auth={auth} setAuth={setAuth} />}  />
      {/* <Drawer.Screen name="Logout" component={() => <Logout auth={auth} setAuth={setAuth} />}  /> */}
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Loan" component={LoanScreen} />
      <Drawer.Screen name="Settings" component={SettingScreen} />

    </Drawer.Navigator>
  )
}

export default App
