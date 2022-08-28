import React, { useCallback, useState, useEffect } from 'react'
import axios from 'axios';
import { IconButton } from 'react-native-paper';
import { Icon, VStack, useColorModeValue, Fab, View, Text, ScrollView, Heading } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { Dimensions, AsyncStorage } from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    PieChart, BarChart, LineChart, ProgressChart
} from "react-native-chart-kit";

export default function MonthlySummary({
    yearlyData = {},
    total = {},
    totalMonthlyDebit = {},
    totalMonthlyCredit,
    totalData,
    monthlyTarget
}) {
    const [date, setDate] = useState(new Date());

    const monthlyCostingStatusCalculation = (day, target, cost) => {
        var now = new Date();
        let days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        let rest_date = days - day;
        let targetAvg = target / days;
        let costAvg = cost / day;
        if (target > cost) {
            let rest_target = target > cost ? target - cost : cost - target;
            return (<Text>Your monthly costing status is <Text style={{ color: 'yellow' }}>{targetAvg > costAvg ? 'Cheep' : 'Expensive'}</Text> now You have to cost per day  !!<Text style={{ color: 'yellow' }}>{Math.round(rest_target / rest_date)} Tk</Text></Text>)
        } else {
            return (<Text style={{ color: 'red' }}>You crossed your budget limit !!</Text>)
        }
    }

    return (
        <>
            {
                Object.keys(yearlyData).length > 0 ?
                    <>
                        <View style={{ backgroundColor: '#e9f3f5', height: 300, paddingTop: 10, margin: 10 }}>
                            <Heading style={{ paddingLeft: 10, fontSize: 18 }}>
                                <IconM
                                    name={'decagram'}
                                    style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
                                /> Expenses summary - {total?.dTotal} <IconM
                                    name={'currency-bdt'}
                                    style={{ color: '#7978B5', fontSize: 22, marginRight: 10 }}
                                /></Heading>
                            <PieChart
                                data={totalMonthlyDebit}
                                width={370}
                                height={200}
                                chartConfig={{
                                    decimalPlaces: 1, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                }} accessor={"amount"}
                                absolute
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 6,
                                    padding: 10
                                }}
                            />
                        </View>

                        <View style={{ backgroundColor: '#e9f3f5', height: 300, margin: 10 }}>

                            <Heading style={{ paddingLeft: 10, fontSize: 18, marginTop: 20 }}>
                                <IconM
                                    name={'decagram'}
                                    style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
                                /> Income <IconM
                                    name={'decagram'}
                                    style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
                                /> Expenses <IconM
                                    name={'decagram'}
                                    style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
                                />Savings
                            </Heading>

                            {
                                totalData?.labels?.length && (
                                    <BarChart
                                        data={totalData}
                                        width={370} // from react-native
                                        height={200}
                                        yAxisLabel="$"
                                        horizontalLabelRotation={-10}
                                        fromZero={true}
                                        showValuesOnTopOfBars={true}
                                        yAxisInterval={1} // optional, defaults to 1
                                        chartConfig={{
                                            backgroundGradientFrom: "#e9f3f5",
                                            backgroundGradientTo: "#e9f3f5",
                                            decimalPlaces: 0, // optional, defaults to 2dp
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                paddingLeft: 10
                                            },
                                            propsForDots: {
                                                r: "6",
                                                strokeWidth: "2",
                                                stroke: "#fcfcfc"
                                            }
                                        }}
                                        bezier
                                        style={{
                                            marginTop: 30,
                                            borderRadius: 6,
                                            paddingLeft: 3
                                        }}
                                    />
                                )
                            }
                        </View>
                        <View style={{ backgroundColor: '#e9f3f5', height: 400, margin: 10 }}>
                            <Heading style={{ paddingLeft: 10, fontSize: 18, marginTop: 20 }}>
                                <IconM
                                    name={'decagram'}
                                    style={{ color: '#7978B5', fontSize: 18, marginRight: 10 }}
                                /> Expenses target (Total/monthly)
                            </Heading>

                            <BarChart
                                style={{
                                    marginTop: 30,
                                    paddingLeft: 3,
                                    borderRadius: 6
                                }}
                                data={{
                                    labels: ["Total target", "Total cost", "Monthly Target", "Monthly cost"],
                                    datasets: [
                                        {
                                            // data:[100,200,300,400]
                                            data: [monthlyTarget?.totalTarget || 0, yearlyData?.dTotal || 0, monthlyTarget?.current_total || 0, total?.dTotal || 0]
                                        }
                                    ]
                                }}
                                width={370}
                                height={200}
                                yAxisInterval={1}
                                horizontalLabelRotation={-10}
                                showValuesOnTopOfBars={true}
                                fromZero={true}
                                yAxisLabel="$"
                                chartConfig={{
                                    backgroundGradientFrom: "#e9f3f5",
                                    backgroundGradientTo: "#e9f3f5",
                                    decimalPlaces: 0, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        paddingLeft: 10
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#fcfcfc"
                                    }
                                }}
                            />
                            <View style={{ backgroundColor: '#9cc3d6' }}>
                                <Text style={{ marginTop: 10, fontSize: 14 }}> <Icon color="red" as={<AntDesign name="inbox" />} size="sm" />
                                    Your Yearly costing status is <Text style={{ color: 'yellow' }}>{
                                        monthlyTarget?.totalTarget || 0 < yearlyData?.dTotal || 0 ? 'Expensive' : 'Cheep'
                                    }</Text>
                                </Text>
                                <Text style={{ marginTop: 10, fontSize: 14 }}> <Icon color="red" as={<AntDesign name="inbox" />} size="sm" />
                                    {monthlyCostingStatusCalculation(date?.getDate(), monthlyTarget?.current_total || 0, total?.dTotal || 0)}
                                </Text>
                            </View>
                            {/* {
                                monthlyTarget?.totalTarget && yearlyData?.dTotal && total?.dTotal && (
                                    <>
                                        <BarChart
                                            data={{
                                                labels: ["Total target", "Total cost", "Monthly Target", "Monthly cost"],
                                                datasets: [
                                                    {
                                                        data:[100,200,300,400]
                                                        // data: [monthlyTarget?.totalTarget, yearlyData?.dTotal, monthlyTarget?.current_total, total?.dTotal]
                                                    }
                                                ]
                                            }}
                                            width={370} // from react-native
                                            height={200}
                                            yAxisLabel="k"
                                            horizontalLabelRotation={-10}
                                            yAxisSuffix="tk"
                                            fromZero={true}
                                            showValuesOnTopOfBars={true}
                                            yAxisInterval={1} // optional, defaults to 1
                                            chartConfig={{
                                                backgroundGradientFrom: "#e9f3f5",
                                                backgroundGradientTo: "#e9f3f5",
                                                decimalPlaces: 2, // optional, defaults to 2dp
                                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                                style: {
                                                    paddingLeft: 10
                                                },
                                                propsForDots: {
                                                    r: "6",
                                                    strokeWidth: "2",
                                                    stroke: "#fcfcfc"
                                                }
                                            }}
                                            bezier
                                            style={{
                                                marginTop: 30,
                                                paddingLeft: 3,
                                                borderRadius: 6
                                            }}
                                        />
                                        <View style={{ backgroundColor: '#9cc3d6' }}>
                                            <Text style={{ marginTop: 10, fontSize: 14 }}> <Icon color="red" as={<AntDesign name="inbox" />} size="sm" />
                                                Your Yearly costing status is <Text style={{ color: 'yellow' }}>{
                                                    monthlyTarget?.totalTarget < yearlyData?.dTotal ? 'Expensive' : 'Cheep'
                                                }</Text>
                                            </Text>
                                            <Text style={{ marginTop: 10, fontSize: 14 }}> <Icon color="red" as={<AntDesign name="inbox" />} size="sm" />
                                                {monthlyCostingStatusCalculation(date?.getDate(), monthlyTarget?.current_total, total?.dTotal)}
                                            </Text>
                                        </View>
                                    </>
                                )
                            } */}
                        </View>
                    </> :
                    <>

                    </>
            }
        </>

    )
}

