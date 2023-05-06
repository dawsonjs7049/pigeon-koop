import { Box, Button, Flex, HStack, SlideFade, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";

export default function TodoCard({ todo, index, handleDelete }) {
    
    const { isOpen, onToggle } = useDisclosure();

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
                    <Box textAlign='start' w='100%'>
                        <Text>{todo.description}</Text>
                    </Box>
                    <Box textAlign='start' w='100%'>
                        <Text fontSize='sm'>{todo.author} on {todo.date} </Text> 
                    </Box>
                </VStack>
                <Box w='15%'>
                    <SlideFade in={isOpen} offsetX='20px'>
                        <Button colorScheme='red' onClick={() => handleDelete(todo.id)}>
                            <BsTrash fontSize='20px' />
                        </Button>
                    </SlideFade>
                </Box>
            </HStack>
        </motion.div>
    )
}