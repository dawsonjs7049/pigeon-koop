import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import Expense from "@/models/Expense";
import { formatDate, getTimestamp } from "@/utils/utilities";
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, ModalOverlay, Modal, Text, Button, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, HStack, useToast, VStack, Input, Flex, Spacer } from '@chakra-ui/react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import ReactSelect from "react-select";
import ExpenseCard from "@/components/ExpenseCard";
import { AnimatePresence } from "framer-motion";

export default function Expenses() {

    const [user, loading] = useAuthState(auth);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const [allExpenses, setAllExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [runningTotal, setRunningTotal] = useState(0);
    const [filteredTotal, setFilteredTotal] = useState(0);
    const [type, setType] = useState('Deposit (+)');
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isAdmin, setIsAdmin] = useState(true);

    const ONE_MONTH = 1;
    const SIX_MONTH = 6;
    const TWELVE_MONTH = 12;
    const ALL = -1;
    const CUSTOM = -2;

    const types = [
        {
            label: 'Deposit (+)',
            value: 'Deposit',
        },
        {
            label: 'Payment (-)',
            value: 'Payment',
        }
    ];

    const filters = [
        {
            label: '1 Month',
            value: ONE_MONTH,
        },
        {
            label: '6 Months',
            value: SIX_MONTH,
        },
        {
            label: '12 Months',
            value: TWELVE_MONTH,
        },
        {
            label: 'All Time',
            value: ALL,
        }
    ];

    useEffect(() => {
        if(user) 
        {
            setIsAdmin((user.email === 'jake906@charter.net' || user.email === 'kevin@gmail.com'))
        }

        const expensesRef = collection(db, 'Expenses');
        const q = query(expensesRef, orderBy('timestamp'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let expenses = snapshot.docs.map((expense) => {
                return new Expense({ ...expense.data(), id: expense.id });
            });

            console.log("EXPENSES");
            console.log(expenses);

            let runningTotal = 0;
            for(let i = 0; i < expenses.length; i++)
            {
                runningTotal += parseFloat(expenses[i].amount);
            }

            setRunningTotal(runningTotal.toFixed(2));
            setAllExpenses(expenses);

            handleSetFilteredExpenses(SIX_MONTH, expenses, null, null);
        });

        return unsubscribe;

    }, [user, loading]);

    const handleSetFilteredExpenses = (timeframe, startingArr, start, end) => {
        let filterArr = (startingArr !== null ? startingArr : allExpenses);
        let newArr = [];

        const timestamp = getTimestamp(timeframe);
        switch(timeframe) {
            case ONE_MONTH:
            case SIX_MONTH:
            case TWELVE_MONTH:
                filterArr.forEach((expense) => {
                    let myTimestamp = (expense.timestamp !== null ? expense.timestamp.seconds : new Date().getTime() / 1000);
                    if(myTimestamp > timestamp)
                    {
                        newArr.push(expense);
                    }
                });
                break;

            case ALL:
                newArr = filterArr;
                break;

            default:
                filterArr.forEach((expense) => {
                    if(expense.timestamp.seconds > start && expense.timestamp.seconds < end)
                    {
                        newArr.push(expense);
                    }
                });
        };

        let filteredTotal = 0;
        newArr.forEach((expense) => {
            filteredTotal += parseFloat(expense.amount);
        })

        setFilteredTotal(filteredTotal.toFixed(2));
        setFilteredExpenses(newArr);
    }

    const handleFilterChange = (item) => {
        handleSetFilteredExpenses(item.value, null, null, null);

        setStartDate('');
        setEndDate('');
    }
 
    const handleSetStartDate = (e) => {
        let start = e.target.value;
        let end = '';

        start = new Date(start).getTime() / 1000;
        end = (endDate === '' ? new Date().getTime() : new Date(endDate).getTime()) / 1000;

        setStartDate(e.target.value);

        handleSetFilteredExpenses(CUSTOM, null, start, end);
    }

    const handleSetEndDate = (e) => {
        let end = e.target.value;
        let start = '';

        end = new Date(end).getTime() / 1000;
        start = (startDate === '' ? new Date('1970-01-01').getTime() : new Date(startDate).getTime()) / 1000;

        setEndDate(e.target.value);

        handleSetFilteredExpenses(CUSTOM, null, start, end);
    }

    const handleAdd = async () => {
        const collectionRef = collection(db, 'Expenses');
        const amountToAdd = (type === 'Deposit (+)' ? parseFloat(amount).toFixed(2) : "-" + parseFloat(amount).toFixed(2));

        await addDoc(collectionRef, {
            description: description,
            type: type,
            amount: amountToAdd,
            date: formatDate(new Date()),
            timestamp: serverTimestamp()
        });

        onClose();

        setDescription('');
        setAmount(0);
        setType('Deposit (+)');

        toast({
            title: 'Success',
            description: 'Successfully Added Expense',
            status: 'success',
            duration: 5000,
            isClosable: true
        });
    }

    const handleDelete = async (id) => {
        const expenseRef = doc(db, 'Expenses', id);
        await deleteDoc(expenseRef);

        toast({
            title: 'Success',
            description: 'Successfully Deleted Expense',
            status: 'success',
            duration: 5000,
            isClosable: true
        });
    }

    return (
        <Flex justifyContent='center'>
            <VStack w='100%' maxW="1300px" p='5'>
                <Box mt='16' w='100%'>
                    <HStack w='100%'>
                        <Text fontSize="2xl" fontWeight="bold" textAlign='start'>Expense Tracking</Text>
                        <Spacer/>
                        {
                            isAdmin &&
                                <Button bg='teal.400' color='white' onClick={onOpen} borderRadius='full' >
                                    <AiOutlinePlusCircle fontSize='25px' />
                                </Button>
                        }
                    </HStack>
                </Box>
                <Flex mt='5' p='8' w='100%' borderRadius='md' shadow='md' bg='ghostwhite' justify='space-between' alignItems='center'>
                    <HStack>
                        <VStack mr='5'>
                            <Text fontWeight='bold'>Running Total</Text>
                            <Box p='3' bg='white' shadow='md' borderRadius='md' w='100%' textAlign='center'>${runningTotal}</Box>
                        </VStack>
                        <VStack>
                            <Text fontWeight='bold'>Filtered Total</Text>
                            <Box p='3' bg='white' shadow='md' borderRadius='md' w='100%' textAlign='center'>${filteredTotal}</Box>
                        </VStack>
                    </HStack>
                    <HStack>
                        <VStack>
                            <Text fontWeight='bold'>Filter</Text>
                            <ReactSelect
                                defaultValue={{ label: "6 Months", value: SIX_MONTH }}
                                onChange={(item) => handleFilterChange(item)}
                                options={filters}
                                menuPlacement="bottom"
                            /> 
                        </VStack>
                        <VStack>
                            <Text fontWeight='bold'>Custom Start</Text>
                            <Input bg='white' shadow='sm' type="date" value={startDate} onChange={(e) => handleSetStartDate(e)} />
                        </VStack>
                        <VStack>
                            <Text fontWeight='bold'>Custom End</Text>
                            <Input bg='white' shadow='sm' type='date' value={endDate} onChange={(e) => handleSetEndDate(e)} />
                        </VStack>
                    </HStack>
                </Flex>
                <VStack w='100%' maxH='1200px' overflowY='auto' pt='5'>
                    <AnimatePresence mode='sync'>
                        {filteredExpenses && filteredExpenses.length > 0 && 
                            filteredExpenses.map((expense, index) => {
                                return <ExpenseCard key={expense.id} expense={expense} index={index} handleDelete={handleDelete} isAdmin={isAdmin} />
                            })
                        }
                    </AnimatePresence>
                </VStack>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent h='fit-content'>
                    <ModalHeader>Add Expense</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb='10'>
                        <Text fontSize='xl' mb='2'>Expense Description</Text>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." type="text" />

                        <Text fontSize='xl' mt='5' mb='2'>Amount</Text>
                        <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" />
                        
                        <Text fontSize='xl' mt='5' mb='2'>Type</Text>
                        <ReactSelect
                            defaultValue={{ label: "Deposit (+)", value: "Deposit" }}
                            onChange={(item) => setType(item.label)}
                            options={types}
                            menuPlacement="bottom"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleAdd} bgColor="teal.300" mr='3'>
                            Add
                        </Button>
                        <Button onClick={onClose} bgColor="red.300">
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}