import { Box, Button, HStack, SlideFade, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";

export default function TodoCard({ todo, index, handleDelete }) {
    
    const { isOpen, onToggle } = useDisclosure();
    console.log("TODO INSIDE");
    console.log(todo);
    return (
        <motion.div
            key={todo.id}
            style={{width: '100%'}}
            layout
            >
            <HStack
                w='100%'
                p='3'
                rounded='md'
                bg={index % 2 == 0 ? 'white' : 'ghostwhite'} 
                onMouseEnter={onToggle} 
                onMouseLeave={onToggle}
                >
                <VStack w='85%'>
                    <Box>
                        <Text>{todo.description}</Text>
                    </Box>
                    <Box>
                        Posted By: {todo.author} on {todo.date}  
                    </Box>
                </VStack>
                <Box w='15%'>
                    <SlideFade in={isOpen} offsetX='20px'>
                        <Button colorScheme='red' onClick={() => handleDelete(expense.id)}>
                            <BsTrash fontSize='20px' />
                        </Button>
                    </SlideFade>
                </Box>
            </HStack>
        </motion.div>
    )
}