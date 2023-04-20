import Comment from "@/models/Comment"
import { db } from "@/utils/firebase"
import { formatDate } from "@/utils/utilities"
import { Box, Button, Flex, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Spinner, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import CommentCard from "./CommentCard"

export default function CommentContainer({ photoId, user }) {

    const [comments, setComments] = useState(null);
    const [comment, setComment] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    useEffect(() => {
        const commentsRef = collection(db, 'Comments');

        const q = query(commentsRef, where('photoId', '==', photoId), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let comments = snapshot.docs.map((doc) => {
                return new Comment({ ...doc.data(), id: doc.id });
            });

            console.log("comments");
            console.log(comments);

            setComments(comments);
        });

        return unsubscribe;
    }, [photoId]);

    const handleAddComment = async () => {
        const collectionRef = collection(db, 'Comments');

        await addDoc(collectionRef, {
            author: user.email,
            comment: comment,
            date: formatDate(new Date()),
            photoId: photoId,
            likes: 0,
            timestamp: serverTimestamp()
        });

        onClose();
        setIsUploading(false);

        toast({
            title: 'Success',
            description: "Your Comment was Posted",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    return (
        <Box w='100%' mt='10'>
            <HStack mb="5">
                <Text fontSize='3xl'>Comments</Text>
                <Spacer />
                <Button onClick={onOpen}>
                    Add Comment
                </Button>
            </HStack>
            <AnimatePresence mode='sync'>
                <Flex justify='space-evenly' wrap='wrap'>
                    {comments && comments.length > 0 ? 
                        (
                            comments.map((comment) => {
                                return <CommentCard comment={comment} key={comment.id} user={user} />
                            })
                        )
                        :
                        (
                            <motion.div
                                key={'noCommentTextKey'}
                                initial="initialState"
                                animate="animateState"
                                exit="exitState"
                                transition={{ duration: 0.6 }}
                                variants={{
                                    initialState: {
                                        opacity: 0,
                                        y: '-20px'
                                    },
                                    animateState: {
                                        opacity: 1,
                                        y: '0px'
                                    },
                                    exitState: {
                                        opacity: 0, 
                                        y: '20px'
                                    }
                                }}
                            >
                                <Text>So far no one thinks this is cool enough to leave a comment...</Text>
                            </motion.div>
                        )
                    }
                </Flex>
            </AnimatePresence>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent h='fit-content'>
                    <ModalHeader>Add a Comment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb='2'>Comment</Text>
                        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment..." />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='outline' transition='ease-in-out' display={comment.length > 0 ? 'block' : 'none'} onClick={() => handleAddComment()}>{isUploading ? <Spinner color='red.500' /> : 'Upload'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}