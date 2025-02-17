import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Select,
  useToast,
  Text,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import axios from 'axios';

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/categories/all`);
        setCategories(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching categories',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchCategories();
  }, [toast]);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      await axios.post(`http://localhost:8000/api/transactions/add`, formData);
      toast({ title: 'Transaction added!', status: 'success', duration: 3000, isClosable: true });
      setFormData({ amount: '', date: '', description: '', category: '' });
    } catch (error) {
      toast({ title: 'Error adding transaction', status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      bgGradient="linear(to-r, #1a202c, #2d3748)"
      color="white"
    >
      {/* Left Side */}
      <Box flex="1" display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={6}>
        <FaMoneyCheckAlt size="80" color="#63B3ED" />
        <Heading mt={4} mb={2} textAlign="center">Add Your Transactions</Heading>
        <Text fontSize="lg" textAlign="center">
          Easily track and manage your transactions with our secure form.
        </Text>
        <Divider mt={6} borderColor="gray.500" />
      </Box>

      {/* Right Side */}
      <Box flex="1" display="flex" justifyContent="center" alignItems="center" p={6}>
        <Box w="100%" maxW="400px" p={6} borderRadius="lg" boxShadow="xl" bg="gray.700">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.amount}>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  bg="gray.800"
                  color="white"
                />
                <FormErrorMessage>{errors.amount}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.date}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  bg="gray.800"
                  color="white"
                />
                <FormErrorMessage>{errors.date}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.description}>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  bg="gray.800"
                  color="white"
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.category}>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  bg="gray.800"
                  color="white"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} style={{ color: 'black' }}>{cat.name}</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.category}</FormErrorMessage>
              </FormControl>

              <Button colorScheme="blue" type="submit" w="full" _hover={{ transform: 'scale(1.05)', transition: '0.3s' }}>
                Add Transaction
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionForm;
