import React from 'react';
import { Box, Flex, SimpleGrid, Heading, Button, HStack, useDisclosure, IconButton, VStack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaChartPie, FaClipboardList, FaEdit, FaTachometerAlt, FaBalanceScale, FaLightbulb, FaWallet, FaBars } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Main = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sections = [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { name: 'Monthly Expenses Chart', icon: FaChartPie, path: '/monthly-expenses' },
    { name: 'Transaction List', icon: FaClipboardList, path: '/transactions' },
    { name: 'Transaction Form', icon: FaEdit, path: '/add-transaction' },
    { name: 'Budget Comparison', icon: FaBalanceScale, path: '/budget-comparison' },
    { name: 'Spending Insights', icon: FaLightbulb, path: '/insights' },
    { name: 'Budget Form', icon: FaWallet, path: '/budget-form' },
  ];

  return (
    <Box p={6} minH="100vh" bg="gray.900" color="white">
      {/* Header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        p={4}
        bg="gray.800"
        position="sticky"
        top="0"
        zIndex="100"
        boxShadow="lg"
        borderBottom="2px solid #2d3748"
      >
        {/* Logo or Title */}
        <Heading
          fontSize="2xl"
          fontFamily="'Poppins', sans-serif"
          letterSpacing="wide"
          color="teal.400"
          onClick={() => navigate('/')}
          _hover={{ cursor: 'pointer', color: 'teal.300', transform: 'scale(1.1)', transition: 'all 0.3s ease' }}
        >
          Finance Dashboard
        </Heading>

        {/* Navigation Links */}
        <HStack spacing={8} display={['none', 'flex']}>
          <Button
            variant="link"
            color="teal.200"
            fontSize="lg"
            onClick={() => navigate('/dashboard')}
            _hover={{
              color: 'teal.400',
              textDecoration: 'underline',
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease',
            }}
          >
            Dashboard
          </Button>
          <Button
            variant="link"
            color="teal.200"
            fontSize="lg"
            onClick={() => navigate('/monthly-expenses')}
            _hover={{
              color: 'teal.400',
              textDecoration: 'underline',
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease',
            }}
          >
            Monthly Expenses
          </Button>
          <Button
            variant="link"
            color="teal.200"
            fontSize="lg"
            onClick={() => navigate('/transactions')}
            _hover={{
              color: 'teal.400',
              textDecoration: 'underline',
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease',
            }}
          >
            Transactions
          </Button>
          {/* Add more links as needed */}
        </HStack>

        {/* Hamburger Menu for Mobile */}
        <IconButton
          icon={<FaBars />}
          colorScheme="teal"
          variant="outline"
          aria-label="Open Menu"
          display={['block', 'none']}
          onClick={onOpen}
        />
      </Flex>

      {/* Main Content */}
      <Heading
        mb={8}
        textAlign="center"
        fontSize="4xl"
        fontFamily="'Poppins', sans-serif"
        letterSpacing="wider"
        color="teal.400"
        _hover={{ color: 'teal.300', transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
      >
        Finance Management Dashboard
      </Heading>

      <SimpleGrid columns={[1, 2, 3]} spacing={8}>
        {sections.map((section) => (
          <motion.div
            key={section.name}
            whileHover={{ scale: 1.1, boxShadow: '0 6px 12px rgba(0, 255, 255, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Box
              p={6}
              bg="gray.800"
              boxShadow="lg"
              borderRadius="lg"
              textAlign="center"
              _hover={{
                transform: 'translateY(-10px)',
                boxShadow: '0 8px 16px rgba(0, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate(section.path)}
            >
              <VStack spacing={4}>
                <Box
                  bg="transparent"
                  borderRadius="full"
                  p={3}
                  boxShadow="0 4px 8px rgba(0, 255, 255, 0.2)"
                  _hover={{
                    boxShadow: '0 8px 16px rgba(0, 255, 255, 0.4)',
                    transform: 'scale(1.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <section.icon size={56} color="teal.400" />
                </Box>
                <Text fontSize="xl" fontWeight="semibold" color="teal.100">
                  {section.name}
                </Text>
                <Button
                  colorScheme="teal"
                  variant="solid"
                  w="full"
                  mt={4}
                  _hover={{
                    bg: 'teal.600',
                    color: 'white',
                    transform: 'scale(1.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Explore {section.name}
                </Button>
              </VStack>
            </Box>
          </motion.div>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Main;
