import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/home/home';
import Point from './pages/point/point';
import PointDetail from './pages/pointDetail/pointDetail';


const AppStack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator headerMode="none" screenOptions={{cardStyle: {backgroundColor: '#f0f0f5'}}}>
                <AppStack.Screen name="Home" component={Home}></AppStack.Screen>
                <AppStack.Screen name="Point" component={Point}></AppStack.Screen>
                <AppStack.Screen name="PointDetail" component={PointDetail}></AppStack.Screen>
            </AppStack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;