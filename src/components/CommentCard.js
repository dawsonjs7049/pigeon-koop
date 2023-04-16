import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

export default function CommentCard({ comment }) {

    return (
        <motion.div
            key={comment.id}
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
            <Card>
                <CardBody>
                    <Text>{comment.comment}</Text>
                </CardBody>
            </Card>
        </motion.div>
    )
}