import { Flex, Box, SlideFade, useDisclosure, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BsTrash } from "react-icons/bs";

export default function ExpenseCard({ expense, index, handleDelete, isAdmin }) {

    const { isOpen, onToggle } = useDisclosure();
    
    return (
        <motion.div
            key={expense.id}
            style={{width: '100%'}}
            layout
            >
            <Flex 
                overflowY='hidden'
                w='100%'
                h='60px'
                borderRadius='md' 
                shadow='md' 
                bg={index % 2 == 0 ? 'white' : 'ghostwhite'} 
                mb='2'
                alignItems='center'
                overflowX='hidden'
                onMouseEnter={ isAdmin ? onToggle : () => {} } 
                onMouseLeave={ isAdmin ? onToggle : () => {} }
                >
                <Box w='2%' h='100%' bg={expense.amount > 0 ? 'teal.400' : 'red.400'} borderTopLeftRadius='md' borderBottomLeftRadius='md'></Box>
                <Box w='60%' p='3'>
                    {expense.description}
                </Box>
                <Box w='15%' p='3'>
                    {expense.date}
                </Box>
                <Box w='15%' p='3'>
                    {(expense.amount < 0 ? '-' : '')}${Math.abs(expense.amount)}
                </Box>
                <Box w='8%'>
                    <SlideFade in={isOpen} offsetX='20px'>
                        <Button colorScheme='red' onClick={() => handleDelete(expense.id)}>
                            <BsTrash fontSize='20px' />
                        </Button>
                    </SlideFade>
                </Box>
            </Flex>
        </motion.div>
    )
}