import { Box, Button, Flex, HStack, SlideFade, Text, useColorMode, useDisclosure, VStack } from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";
import { useContext, useEffect, useMemo } from "react";
import { DarkModeContext } from "./Layout";

export default function TodoCard({ todo, index, handleDelete }) {
    
    const { isOpen, onToggle } = useDisclosure();
    const isDarkMode = useContext(DarkModeContext);

    let bg = 'white';
    let color = 'black';

    if(isDarkMode)
    {
        if(index % 2 == 0)
        {
            bg = 'gray.500';
        } 
        else 
        {
            bg = 'gray.600';
        }

        color = 'white';
    }
    else 
    {
        if(index % 2 != 0)
        {
            bg = 'ghostwhite';
        }
    }

    return (
        <motion.div
            key={todo.id}
            style={{width: '100%', marginTop: '10px'}}
            layout
            >
            <HStack
                w='100%'
                p='3'
                rounded='md'
                bg={bg} 
                color={color}
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