import TodoCard from "./TodoCard"
import { db } from "@/utils/firebase"
import { Box, Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SlideFade, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { motion } from "framer-motion";
import { formatDate } from "@/utils/utilities";
import Todo from "@/models/Todo"

export default function TodoList({ user }) {

    const [todos, setTodos] = useState([]);
    const [todoDescription, setTodoDescription] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    useEffect(() => {
        const todoRef = collection(db, 'todos');

        const q = query(todoRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let myTodos = snapshot.docs.map((doc) => {
                return new Todo({ ...doc.data(), id: doc.id });
            });

            console.log("TODOS");
            console.log(myTodos);

            setTodos(myTodos);
        });

        return unsubscribe;
    }, []);

    const handleAdd = async () => {
        const collectionRef = collection(db, 'todos')

        await addDoc(collectionRef, {
            description: todoDescription,
            date: formatDate(new Date()),
            author: user.email,
            timestamp: serverTimestamp()
        });

        onClose();

        toast({
            title: 'Success',
            description: "Your Todo was Uploaded",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    const handleDelete = () => {

    }

    return (
        <>
            <Box rounded='md' shadow='md' p='3'>
                <HStack>
                    <Text>To-Do</Text>
                    <Button onClick={onOpen}>Add</Button>
                </HStack>
                <VStack p='3'>
                    <motion.div layout style={{ width: '100%', height: 'fit-content' }}>
                        {todos.length > 0 ? (
                                todos.map((todo, index) => {
                                    return <TodoCard todo={todo} handleDelete={handleDelete} index={index} key={todo.id}/>
                                })
                            ) : (
                                <Text>No todos right now...</Text>
                            )
                        }
                    </motion.div>
                </VStack>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent h='fit-content'>
                    <ModalHeader>Add Todo</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb='10'>
                        <Text fontSize='xl' mb='2'>Description</Text>
                        <Input value={todoDescription} onChange={(e) => setTodoDescription(e.target.value)} placeholder="Description..." type="text" />
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
        </>
      
    )
}