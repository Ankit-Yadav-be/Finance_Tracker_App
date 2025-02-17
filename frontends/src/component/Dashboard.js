import React, { useEffect, useState } from 'react';
import {
  Box, SimpleGrid, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex, Heading, Icon
} from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { FaExchangeAlt, FaRupeeSign, FaLayerGroup } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, catRes] = await Promise.all([
          axios.get(`https://finance-tracker-app-vgak.onrender.com/api/transactions/all`),
          axios.get(`https://finance-tracker-app-vgak.onrender.com/api/categories/all`),
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

  const COLORS = ['#6DD5FA', '#FF6B6B', '#FFD93D', '#7D5FFF', '#FF914D', '#B5FF6B'];

  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh" bgGradient="linear(to-r, cyan.500, blue.500)">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  return (
    <Box p={6} bgGradient="linear(to-br, gray.900, gray.700)" minH="100vh" color="white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        <Heading mb={6} textAlign="center" fontFamily="'Poppins', sans-serif">📊 Expense Dashboard</Heading>
      </motion.div>

      <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={6}>
        {[{
          icon: FaExchangeAlt, title: 'Total Transactions', value: transactions.length, color: 'blue.600'
        }, {
          icon: FaRupeeSign, title: 'Total Expenses', value: `₹${totalAmount}`, color: 'green.600'
        }, {
          icon: FaLayerGroup, title: 'Categories', value: categories.length, color: 'purple.600'
        }].map((item, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }}>
            <Box bg={item.color} p={6} borderRadius="xl" textAlign="center" boxShadow="xl">
              <Icon as={item.icon} boxSize={6} mb={2} />
              <Text fontSize="xl" fontWeight="bold">{item.title}</Text>
              <Text fontSize="3xl">{item.value}</Text>
            </Box>
          </motion.div>
        ))}
      </SimpleGrid>

      <Flex direction={['column', 'row']} gap={6}>
        <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 1.2 }}>
          <Box flex="1" mb={[6, 0]} p={4} bg="gray.800" borderRadius="lg" boxShadow="lg">
            <Text fontSize="xl" mb={4} fontWeight="bold" textAlign="center">🧾 Recent Transactions</Text>
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="white">Date</Th>
                  <Th color="white">Description</Th>
                  <Th color="white">Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.slice(-5).map((t) => (
                  <Tr key={t._id} _hover={{ bg: 'gray.600' }}>
                    <Td>{new Date(t.date).toLocaleDateString()}</Td>
                    <Td>{t.description}</Td>
                    <Td>₹{t.amount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </motion.div>

        <motion.div initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: 1.2 }}>
          <Box flex="2" display="flex" alignItems="center" justifyContent="center" bg="gray.800" borderRadius="lg" boxShadow="lg" p={4}>
            <Box>
              <Text fontSize="xl" mb={4} fontWeight="bold" textAlign="center">📈 Expenses by Category</Text>
              <ResponsiveContainer width={700} height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={2000}
                    isAnimationActive={true}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ color: 'black' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </motion.div>
      </Flex>
    </Box>
  );
};

export default Dashboard;
