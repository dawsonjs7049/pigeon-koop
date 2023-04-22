import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Expense from "@/models/Expense";
import { getTimestamp } from "@/utils/utilities";
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, ModalOverlay, Modal, Text, Button, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, HStack, useToast, VStack, Input, Flex, Spacer } from '@chakra-ui/react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import ReactSelect from "react-select";

export default function Expenses() {

    const [user, loading] = useAuthState(auth);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [allExpenses, setAllExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [runningTotal, setRunningTotal] = useState(0);
    const [filteredTotal, setFilteredTotal] = useState(0);
    const [type, setType] = useState('Deposit (+)');
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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

            setRunningTotal(runningTotal);
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

        setFilteredTotal(filteredTotal);
        setFilteredExpenses(newArr);
    }

    return (
        <Flex justifyContent='center'>
            <VStack w='100%' maxW="1300px" p='5'>
                <Text fontSize="2xl" fontWeight="bold" textAlign='start'>Expense Tracking</Text>
                <Box mt='10' w='100%'>
                    <HStack w='100%'>
                        <Text fontSize="2xl" fontWeight="bold" textAlign='start'>Expense Tracking</Text>
                        <Spacer/>
                        <Button colorScheme='cyan' onClick={onOpen} >
                            <AiOutlinePlusCircle fontSize='25px' />
                        </Button>
                    </HStack>
                </Box>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent h='fit-content'>
                    <ModalHeader>Add Expense</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb='10'>
                        <Text fontSize='xl' textAlign='center' mb='2'>Expense Description</Text>
                        <Input value={description} onChange={() => setDescription(e.target.value)} placeholder="Description..." type="text" />

                        <Text fontSize='xl' textAlign='center' mt='5' mb='2'>Amount</Text>
                        <Input value={amount} onChange={() => setAmount(e.target.value)} type="number" />
                        
                        <Text fontSize='xl' textAlign='center' mt='5' mb='2'>Type</Text>
                        <ReactSelect
                            defaultValue={{ label: "Deposit (+)", value: "Deposit" }}
                            onChange={(item) => setType(item.label)}
                            options={types}
                            menuPlacement="bottom"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} bgColor="red.300">
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}