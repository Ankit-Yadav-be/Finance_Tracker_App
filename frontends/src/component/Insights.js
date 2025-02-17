import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { FaMoneyBillWave, FaChartPie, FaPercent, FaBalanceScale } from 'react-icons/fa';

const SpendingInsights = () => {
  const [insights, setInsights] = useState({
    topCategory: 'N/A',
    totalSpending: 0,
    budgetUsage: 0,
    averageSpending: 0,
  });

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const transactionsRes = await axios.get(`https://finance-tracker-app-vgak.onrender.com/api/transactions/all`);
        const budgetsRes = await axios.get(`https://finance-tracker-app-vgak.onrender.com/api/budgets/all`);

        const transactions = transactionsRes.data || [];
        const budgets = budgetsRes.data || [];

        const totalSpending = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

        const categorySpending = transactions.reduce((acc, tx) => {
          const categoryName = tx.category?.name || 'Uncategorized';
          acc[categoryName] = (acc[categoryName] || 0) + (tx.amount || 0);
          return acc;
        }, {});

        const topCategory = Object.entries(categorySpending).reduce(
          (max, [category, amount]) => (amount > max.amount ? { category, amount } : max),
          { category: 'N/A', amount: 0 }
        ).category;

        const totalBudget = budgets.reduce((acc, budget) => acc + (budget.monthlyLimit || 0), 0);

        const budgetUsage = totalBudget > 0 ? ((totalSpending / totalBudget) * 100).toFixed(2) : 0;

        const categoryCount = Object.keys(categorySpending).length;
        const averageSpending = categoryCount > 0 ? (totalSpending / categoryCount).toFixed(2) : 0;

        setInsights({
          topCategory,
          totalSpending,
          budgetUsage,
          averageSpending,
        });
      } catch (error) {
        console.error('Error fetching insights:', error);
      }
    };

    fetchInsights();
  }, []);

  const bgColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('white', 'gray.800');

  const statColors = [
    { icon: FaChartPie, color: 'purple.500' },
    { icon: FaMoneyBillWave, color: 'green.400' },
    { icon: FaPercent, color: 'blue.300' },
    { icon: FaBalanceScale, color: 'orange.300' },
  ];

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="xl" minH="100vh">
      <Heading size="xl" mb={6} color="teal.300" textAlign="center" fontWeight="bold" letterSpacing="wide">
        💹 Spending Insights Dashboard
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        {Object.entries(insights).map(([key, value], index) => (
          <Stat
            key={key}
            p={6}
            borderWidth={2}
            borderRadius="xl"
            bg="gray.700"
            color={textColor}
            boxShadow="dark-lg"
            transition="transform 0.3s"
            _hover={{ transform: 'translateY(-10px)' }}
          >
            <Icon as={statColors[index]?.icon || FaChartPie} boxSize={8} color={statColors[index]?.color} mb={4} />
            <StatLabel fontSize="lg" fontWeight="semibold" textTransform="capitalize">
              {key.replace(/([a-z])([A-Z])/g, '$1 $2')}
            </StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold">
              {key.includes('Spending') || key.includes('average') ? `₹${value}` : `${value}${key.includes('Usage') ? '%' : ''}`}
            </StatNumber>
            <StatHelpText fontSize="sm" color="gray.400">
              {key === 'topCategory' ? 'Highest Spending Category' : 'Insights Summary'}
            </StatHelpText>
          </Stat>
        ))}
      </SimpleGrid>
      <Text color="gray.300" textAlign="center" mt={6}>
        Analyze your spending patterns and optimize your budget efficiently! 🚀
      </Text>
    </Box>
  );
};

export default SpendingInsights;
