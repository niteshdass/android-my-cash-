import React from 'react';
import {
   PieChart
  } from "react-native-chart-kit";

export default function PiChart({ totalDebit }) {
    return (
        <PieChart
            data={totalDebit}
            width={400}
            height={200}
            chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }} accessor={"amount"}
            backgroundColor={"transparent"}
            absolute
        />
    )
}
