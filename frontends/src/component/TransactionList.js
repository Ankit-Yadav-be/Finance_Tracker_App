import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Input,
  useToast,
  Heading,
  Text,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', date: '', description: '', category: '' });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/transactions/all`);
      setTransactions(res.data);
    } catch (error) {
      toast({ title: 'Failed to load transactions', status: 'error', duration: 3000 });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/transactions/delete/${id}`);
      toast({ title: 'Transaction deleted!', status: 'success', duration: 3000 });
      fetchTransactions();
    } catch (error) {
      toast({ title: 'Failed to delete transaction', status: 'error', duration: 3000 });
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      amount: transaction.amount,
      date: transaction.date.split('T')[0],
      description: transaction.description,
      category: transaction.category?._id || ''
    });
    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/api/transactions/update/${editingId}`, editForm, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast({ title: 'Transaction updated!', status: 'success', duration: 3000 });
      setEditingId(null);
      onClose();
      fetchTransactions();
    } catch (error) {
      toast({ title: 'Failed to update transaction', status: 'error', duration: 3000 });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  return (
    <Box minH="100vh" bg="gray.900" color="white" p={6} borderRadius="lg" boxShadow="dark-lg">
      <Heading mb={6} textAlign="center" fontSize="3xl" fontWeight="bold" textTransform="uppercase">
        Transaction List
      </Heading>
      <Table variant="striped" colorScheme="blackAlpha" size="lg" borderRadius="md" boxShadow="md">
        <Thead>
          <Tr bg="gray.700">
            <Th color="white" textAlign="center">Amount</Th>
            <Th color="white" textAlign="center">Date</Th>
            <Th color="white" textAlign="center">Description</Th>
            <Th color="white" textAlign="center">Category</Th>
            <Th color="white" textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction._id} _hover={{ bg: 'gray.800', transform: 'scale(1.02)', transition: 'all 0.2s ease' }}>
              <Td textAlign="center">
                {editingId === transaction._id ? (
                  <Input
                    name="amount"
                    value={editForm.amount}
                    onChange={handleInputChange}
                    bg="gray.700"
                    color="white"
                    border="none"
                    _focus={{ outline: 'none', bg: 'gray.600' }}
                  />
                ) : (
                  <Text>{transaction.amount}</Text>
                )}
              </Td>
              <Td textAlign="center">
                {editingId === transaction._id ? (
                  <Input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleInputChange}
                    bg="gray.700"
                    color="white"
                    border="none"
                    _focus={{ outline: 'none', bg: 'gray.600' }}
                  />
                ) : (
                  <Text>{transaction.date.split('T')[0]}</Text>
                )}
              </Td>
              <Td textAlign="center">
                {editingId === transaction._id ? (
                  <Input
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    bg="gray.700"
                    color="white"
                    border="none"
                    _focus={{ outline: 'none', bg: 'gray.600' }}
                  />
                ) : (
                  <Text>{transaction.description}</Text>
                )}
              </Td>
              <Td textAlign="center">
                {editingId === transaction._id ? (
                  <Input
                    name="category"
                    value={editForm.category}
                    onChange={handleInputChange}
                    bg="gray.700"
                    color="white"
                    border="none"
                    _focus={{ outline: 'none', bg: 'gray.600' }}
                  />
                ) : (
                  <Text>{transaction.category?.name || 'N/A'}</Text>
                )}
              </Td>
              <Td textAlign="center">
                {editingId === transaction._id ? (
                  <Button colorScheme="green" size="sm" onClick={handleUpdate} mr={2}>
                    Save
                  </Button>
                ) : (
                  <IconButton
                    icon={<FaEdit />}
                    colorScheme="yellow"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                    mr={2}
                    _hover={{ transform: 'scale(1.1)', boxShadow: 'xl' }}
                  />
                )}
                <IconButton
                  icon={<FaTrash />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDelete(transaction._id)}
                  _hover={{ transform: 'scale(1.1)', boxShadow: 'xl' }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Edit Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <Input
                name="amount"
                value={editForm.amount}
                onChange={handleInputChange}
                bg="gray.700"
                color="white"
                placeholder="Amount"
                _focus={{ outline: 'none', bg: 'gray.600' }}
              />
              <Input
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleInputChange}
                bg="gray.700"
                color="white"
                placeholder="Date"
                _focus={{ outline: 'none', bg: 'gray.600' }}
              />
              <Input
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                bg="gray.700"
                color="white"
                placeholder="Description"
                _focus={{ outline: 'none', bg: 'gray.600' }}
              />
              <Input
                name="category"
                value={editForm.category}
                onChange={handleInputChange}
                bg="gray.700"
                color="white"
                placeholder="Category"
                _focus={{ outline: 'none', bg: 'gray.600' }}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleUpdate}>
              Save Changes
            </Button>
            <Button colorScheme="red" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TransactionList;
