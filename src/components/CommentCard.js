import { Card, CardHeader, CardBody, CardFooter, Text, VStack, Box, HStack, Button, useToast, SlideFade, useDisclosure } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiThumbsUp } from 'react-icons/fi'
import { BsTrash } from 'react-icons/bs';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useState } from 'react';

export default function CommentCard({ comment, user }) {

    const { isOpen, onToggle } = useDisclosure();
    const [isLiked, setIsLiked] = useState(comment.likes ? comment.likes.includes(user.email) : false);

    const toast = useToast();

    const handleDelete = async () => {
        const commentRef = doc(db, 'Comments', comment.id);
        await deleteDoc(commentRef);

        toast({
            title: 'Success',
            description: "Your Comment was Deleted",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    const handleUpdateLike = async () => {
        let commentToUpdate = { ...comment };

        if(isLiked)
        {
            // we are un-liking the comment
            commentToUpdate.likes = commentToUpdate.likes.filter((person) => person !== user.email);
        }
        else 
        {
            // we are liking the comment
            commentToUpdate.likes = (commentToUpdate.likes ? commentToUpdate.likes.concat([user.email]) : [user.email]); 
        }

        const commentRef = doc(db, 'Comments', comment.id);
        await updateDoc(commentRef, { ...commentToUpdate})

        setIsLiked(!isLiked);
    }

    return (
        <motion.div
            key={comment.id}
            style={{width: '30%', marginBottom: '2rem', minWidth: '300px'}}
            layout
        >
            <Card h='300px' _hover={{ boxShadow: '0px 10px 34px -3px rgba(0,0,0,0.54)' }} transition='all .5s ease-in-out' onMouseEnter={onToggle} onMouseLeave={onToggle}>
                <CardBody>
                    <VStack justify='space-between' w='100%' h='100%'>
                        <Box w='100%' h='75%'>
                            <HStack h='20%' justify='space-between' alignItems='center'>
                                <Text fontSize='xl' fontWeight='bold'>{comment.author}</Text>
                                {comment.author === user.email &&
                                    <SlideFade in={isOpen} offsetX='20px'>
                                        <Button onClick={handleDelete} colorScheme='red' p='0'>
                                            <BsTrash fontSize='20px' />
                                        </Button>
                                    </SlideFade>
                                }
                            </HStack>
                            <Text h='75%' my='5' borderRadius='5px' backgroundColor='ghostwhite' color='black' p='5'>{comment.comment}</Text>
                        </Box>
                        <HStack w='100%' justify='space-between'>
                            <Text>Posted: {comment.date}</Text>
                            <HStack>
                                <Button onClick={handleUpdateLike}>
                                    <FiThumbsUp fontSize='20px' fill={isLiked ? 'black' : 'white'} /> 
                                    {comment.likes.length > 0 && 
                                        <Text ml='2'>{comment.likes.length}</Text>
                                    }
                                </Button>
                            
                            </HStack>
                        </HStack>
                    </VStack>
                </CardBody>
            </Card>
        </motion.div>
    )
}