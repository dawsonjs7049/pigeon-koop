import { db } from "@/utils/firebase";
import { Flex, Box, SlideFade, useDisclosure, Button, Text } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FiThumbsUp } from "react-icons/fi";

export default function MovieCard({ movie, index, user, handleDelete }) {
    const [isLiked, setIsLiked] = useState(movie.likes ? movie.likes.includes(user.email) : false);

    const { isOpen, onToggle } = useDisclosure();
    
    const handleUpdateLike = async () => {
        let movieToUpdate = { ...movie };

        if(isLiked) {
            // we are un-liking the comment
            movieToUpdate.likes = movieToUpdate.likes.filter((person) => person !== user.email);
        } else {
            // we are liking the comment
            movieToUpdate.likes = (movieToUpdate.likes ? movieToUpdate.likes.concat([user.email]) : [user.email]); 
        }

        const movieRef = doc(db, 'Movies', movie.id);
        await updateDoc(movieRef, { ...movieToUpdate})

        setIsLiked(!isLiked);
    }

    return (
        <motion.div
            key={movie.id}
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
                onMouseEnter={onToggle} 
                onMouseLeave={onToggle}
                >
                <Box w="12%" p="3">     
                    <Button w="full" onClick={() => handleUpdateLike(movie)}>
                        <FiThumbsUp fontSize='20px' fill={isLiked ? 'black' : 'white'} /> 
                        {movie.likes.length > 0 && 
                            <Text ml='2'>{movie.likes.length}</Text>
                        }
                    </Button>
                </Box>
                <Box w='80%' p='3'>
                    {movie.name}
                </Box>
                <Box w='8%'>
                    <SlideFade in={isOpen} offsetX='20px'>
                        <Button colorScheme='red' onClick={() => handleDelete(movie.id)}>
                            <BsTrash fontSize='20px' />
                        </Button>
                    </SlideFade>
                </Box>
            </Flex>
        </motion.div>
    )
}