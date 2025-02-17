import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  Heading,
  useToast,
  Divider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaMoneyCheckAlt } from "react-icons/fa";

const BudgetForm = () => {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    monthlyLimit: "",
    month: "",
  });

  useEffect(() => {
    axios
      .get(`https://finance-tracker-app-vgak.onrender.com/api/categories/all`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.monthlyLimit || !formData.month) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `https://finance-tracker-app-vgak.onrender.com/api/budgets/add`,
        formData
      );
      toast({
        title: "Budget added successfully",
        status: "success",
        duration: 3000,
      });
      setFormData({ category: "", monthlyLimit: "", month: "" });
    } catch (error) {
      toast({
        title: error.response?.data?.error || "Failed to add budget",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      bgGradient="linear(to-r, #1a202c, #2d3748)"
      color="white"
    >
      {/* Left Side */}
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={6}
      >
        <FaMoneyCheckAlt size="80" color="#63B3ED" />
        <Heading mt={4} mb={2} textAlign="center">
          Add Monthly Budget
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Easily track and manage your monthly budgets.
        </Text>
        <Divider mt={6} borderColor="gray.500" />
      </Box>

      {/* Right Side */}
      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={6}
      >
        <Box
          w="100%"
          maxW="400px"
          p={6}
          borderRadius="lg"
          boxShadow="xl"
          bg="gray.700"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Select category"
                  bg="gray.800"
                  color="white"
                >
                  {categories.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                      style={{ color: "black" }}
                    >
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Monthly Limit</FormLabel>
                <Input
                  type="number"
                  name="monthlyLimit"
                  value={formData.monthlyLimit}
                  onChange={handleChange}
                  placeholder="Enter monthly limit"
                  bg="gray.800"
                  color="white"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Month</FormLabel>
                <Input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  bg="gray.800"
                  color="white"
                />
              </FormControl>

              <Button
                colorScheme="blue"
                type="submit"
                width="full"
                _hover={{
                  transform: "scale(1.05)",
                  transition: "0.3s",
                }}
              >
                Add Budget
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default BudgetForm;
