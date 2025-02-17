import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const BudgetComparisonChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBudgetAndActualSpending = async () => {
      try {
        const budgetResponse = await axios.get(`https://finance-tracker-app-vgak.onrender.com/api/budgets/all`);
        const budgets = budgetResponse.data;

        const transactionResponse = await axios.get(`https://finance-tracker-app-vgak.onrender.com/api/transactions/all`);
        const transactions = transactionResponse.data;

        const actualSpendingMap = transactions.reduce((acc, tx) => {
          if (tx.category && tx.category._id) {
            const categoryId = tx.category._id;
            acc[categoryId] = (acc[categoryId] || 0) + tx.amount;
          }
          return acc;
        }, {});

        const formattedData = budgets.map((budget) => ({
          category: budget.category.name,
          Budget: budget.monthlyLimit,
          Actual: actualSpendingMap[budget.category._id] || 0,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching budgets or transactions:', error);
      }
    };

    fetchBudgetAndActualSpending();
  }, []);

  return (
    <Box height="100vh" width="100vw" bgGradient="linear(to-r, teal.500, blue.500)" p={6} display="flex" justifyContent="center" alignItems="center">
      <VStack spacing={6} w="90%" h="80%" bg="white" borderRadius="xl" boxShadow="2xl" p={4}>
        <Heading size="xl" color="teal.700" textAlign="center" mb={4}>
          Budget vs. Actual Spending
        </Heading>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="category" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Budget" fill="#38B2AC" radius={[5, 5, 0, 0]} />
              <Bar dataKey="Actual" fill="#E53E3E" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Text color="gray.500" fontSize="lg">No budget data available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default BudgetComparisonChart;
