import React, { useEffect, useState } from "react";
import { Box, Spinner, useToast, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonthlyExpensesChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/transactions/all`
        );
        const transactions = response.data;

        const monthlyExpenses = transactions.reduce((acc, transaction) => {
          const month = new Date(transaction.date).toLocaleString("default", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + transaction.amount;
          return acc;
        }, {});

        const formattedData = Object.entries(monthlyExpenses).map(
          ([month, total]) => ({
            month,
            total,
          })
        );

        setChartData(formattedData);
      } catch (error) {
        toast({
          title: "Error fetching chart data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(to-r, gray.800, gray.900)"
      >
        <Spinner size="xl" color="teal.300" />
      </Box>
    );
  }

  return (
    <Box
      height="100vh"
      width="100%"
      bgGradient="linear(to-r, gray.800, gray.900)"
      color="white"
      p={6}
    >
      <Heading mb={4} textAlign="center" color="teal.300">
        Monthly Expenses Overview
      </Heading>
      <Text mb={6} textAlign="center" fontSize="lg" color="gray.300">
        Track your monthly expenses with a clear and interactive chart.
      </Text>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="gray" />
          <XAxis dataKey="month" stroke="white" />
          <YAxis stroke="white" />
          <Tooltip contentStyle={{ backgroundColor: "#1A202C", color: "white" }} />
          <Legend wrapperStyle={{ color: "white" }} />
          <Bar dataKey="total" fill="#38B2AC" name="Monthly Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MonthlyExpensesChart;
