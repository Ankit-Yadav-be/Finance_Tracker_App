import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex, useBreakpointValue } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, catRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/transactions/all`),
          axios.get(`http://localhost:8000/api/categories/all`),
        ]);
        setTransactions(transRes.data);
        setCategories(catRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAmount = transactions.reduce((acc, t) => acc + t.amount, 0);

  const categoryData = categories.map((cat) => {
    const catTotal = transactions
      .filter((t) => t.category && t.category._id === cat._id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat.name, value: catTotal };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) return <Spinner size="xl" color="blue.500" />;

  return (
    <Box p={8} bg="linear-gradient(135deg, #2d3748, #1a202c)" color="white" minHeight="100vh">
      {/* Summary Cards */}
      <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={8}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Box bg="linear-gradient(135deg, #4c8bf5, #2b6cb0)" p={6} borderRadius="lg" textAlign="center" boxShadow="lg" transition="all 0.3s ease">
            <Text fontSize="xl" fontWeight="bold" mb={2} color="white">Total Transactions</Text>
            <Text fontSize="2xl" color="white">{transactions.length}</Text>
          </Box>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Box bg="linear-gradient(135deg, #68d391, #38a169)" p={6} borderRadius="lg" textAlign="center" boxShadow="lg" transition="all 0.3s ease">
            <Text fontSize="xl" fontWeight="bold" mb={2} color="white">Total Expenses</Text>
            <Text fontSize="2xl" color="white">₹{totalAmount}</Text>
          </Box>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Box bg="linear-gradient(135deg, #a3bffa, #805ad5)" p={6} borderRadius="lg" textAlign="center" boxShadow="lg" transition="all 0.3s ease">
            <Text fontSize="xl" fontWeight="bold" mb={2} color="white">Categories</Text>
            <Text fontSize="2xl" color="white">{categories.length}</Text>
          </Box>
        </motion.div>
      </SimpleGrid>

      <Flex direction={['column', 'row']} gap={6} mb={8}>
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Box flex="1" mb={[6, 0]}>
            <Text fontSize="xl" mb={4} fontWeight="bold" textTransform="uppercase" letterSpacing="wide" color="white">Recent Transactions</Text>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th color="white">Date</Th>
                  <Th color="white">Description</Th>
                  <Th color="white">Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.slice(-5).map((t) => (
                  <Tr key={t._id}>
                    <Td>{new Date(t.date).toLocaleDateString()}</Td>
                    <Td>{t.description}</Td>
                    <Td>₹{t.amount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </motion.div>

        {/* Category-wise Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Box flex="1" display="flex" alignItems="center" justifyContent="center">
            <Box>
              <Text fontSize="xl" mb={4} fontWeight="bold" textAlign="center" textTransform="uppercase" letterSpacing="wide" color="white">Expenses by Category</Text>
              <PieChart width={400} height={300}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </Box>
          </Box>
        </motion.div>
      </Flex>
    </Box>
  );
};

export default Dashboard;
