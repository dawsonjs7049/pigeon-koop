import Comment from "@/models/Comment"
import { db } from "@/utils/firebase"
import { Box, Button, HStack, Spacer, Text } from "@chakra-ui/react"
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import CommentCard from "./CommentCard"

export default function CommentContainer({ photoId }) {

    const [comments, setComments] = useState(null);

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

    return (
        <Box w='100%' mt='10'>
            <HStack>
                <Text fontSize='3xl'>Comments</Text>
                <Spacer />
                <Button>
                    Add Comment
                </Button>
            </HStack>
            <AnimatePresence mode='wait'>
                {comments && comments.length > 0 ? 
                    (
                        comments.map((comment) => {
                            return <CommentCard comment={comment} key={comment.id} />
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
            </AnimatePresence>
        </Box>
    )
}