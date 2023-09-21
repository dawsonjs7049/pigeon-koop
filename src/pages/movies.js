import Movie from "@/models/Movie";
import { auth, db } from "@/utils/firebase";
import { Button, useToast, HStack, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, VStack, useDisclosure, Box, ModalFooter, Icon } from "@chakra-ui/react"
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { motion } from "framer-motion";
import ReactSelect from "react-select";
import MovieCard from "@/components/MovieCard";
import { FaDice } from 'react-icons/fa';


export default function Movies() {
    const ALPHABETICAL = 'Alphabetical';
    const LIKES = 'Likes';
    const filterTypes = [
        {
            label: ALPHABETICAL,
            value: ALPHABETICAL,
        },
        {
            label: LIKES,
            value: LIKES,
        }
    ];


    const [movieName, setMovieName] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [allMovies, setAllMovies] = useState([]);
    const [filterType, setFilterType] = useState(ALPHABETICAL);
    const [filteredMovies, setFilteredMovies] = useState([]);
    
    const [user, loading] = useAuthState(auth);
    
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    useEffect(() => {
        const moviesRef = collection(db, 'Movies');
        const q = query(moviesRef, orderBy('name'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let movies = snapshot.docs.map((movie) => {
                return new Movie({ ...movie.data(), id: movie.id });
            });

            console.log("MOVIES", movies);

            setAllMovies(movies);

            applyFilter(movies);
        });

        return unsubscribe;
    }, [user, loading])

    useEffect(() => {
        applyFilter();
    }, [filterType]);

    useEffect(() => {
        handleSearch();
    }, [searchInput])

    const applyFilter = (initialMovies) => {
        let starting = initialMovies || allMovies;
        console.log('initial movies', starting);

        let filtered = [];
        if (filterType === ALPHABETICAL) {
            console.log('filtering by alaphabet');
            filtered = starting.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            console.log('filtering by likes')
            filtered = starting.sort((a, b) => b.likes.length - a.likes.length);
        }

        console.log('after filter', filtered);
        setFilteredMovies([...filtered]);
    }

    const handleAdd = async () => {
        const collectionRef = collection(db, 'Movies');
console.log('adding movie', movieName)
        await addDoc(collectionRef, {
            name: movieName,
            addedBy: user.email,
            likes: [],
            timestamp: serverTimestamp()
        });

        setMovieName('');

        onClose();

        toast({
            title: 'Success',
            description: 'Successfully Added Movie',
            status: 'success',
            duration: 5000,
            isClosable: true
        });
    }

    const handleDelete = async (id) => {
        const movieRef = doc(db, 'Movies', id);
        await deleteDoc(movieRef);

        toast({
            title: 'Success',
            description: 'Successfully Deleted Movie',
            status: 'success',
            duration: 5000,
            isClosable: true
        });
    }

    const handleSearch = () => {
        if (searchInput == '') {
            setFilteredMovies([...allMovies]);

            applyFilter([...allMovies]);
        } else {
            const search = searchInput.toLowerCase();
            let newArr = allMovies.filter((movie) => movie.name.toLowerCase().includes(search));

            setFilteredMovies(newArr);
        }
    }

    const randomize = () => {
        const random = Math.floor(Math.random() * allMovies.length);
        console.log('random', random);
        setSearchInput(allMovies[random].name)
    }

    return (
        <>
            <VStack w="full" h="full" p="5" maxW="1300px" margin="auto">
                <HStack w="full" mt="10" justifyContent="space-between">
                    <Text fontSize="2xl" fontWeight="bold" textAlign='start'>Movies</Text>
                    <Button bg='blue.500' color='white' onClick={onOpen} borderRadius='full' >
                        <AiOutlinePlusCircle fontSize='25px' />
                    </Button>
                </HStack>
                <HStack color='black' mt='5' p='8' w='100%' borderRadius='md' shadow='md' bg='ghostwhite' justifyContent="space-between">
                    <HStack>
                        <Input w="300px" type="text" bg="white" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search Movies..."/>
                        <Box w="180px">
                            <ReactSelect
                                defaultValue={filterTypes[0]}
                                onChange={(item) => setFilterType(item.label)}
                                options={filterTypes}
                                menuPlacement="bottom"
                            />
                        </Box>
                    </HStack>
                    <Button bg="blue.500" onClick={() => randomize()}><Icon as={FaDice} color="white" boxSize="6"/></Button>
                </HStack>
                <VStack w="100%" p="1" flexGrow="1" overflowY="auto" mt="10" alignItems="flex-start" justifyContent="flex-start" gap="2">
                    <motion.div layout style={{ width: '100%', height: '100%', paddingTop: '20px' }} className="motion-container">
                        {filteredMovies && filteredMovies.length > 0 && 
                            filteredMovies.map((movie, index) => {
                                return <MovieCard key={movie.id} movie={movie} index={index} user={user} handleDelete={handleDelete} />
                            })
                        }
                    </motion.div>
                </VStack>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent h='fit-content'>
                    <ModalHeader>Add Movie</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb='10'>
                        <Text fontSize='xl' mb='2'>Movie Name</Text>
                        <Input value={movieName} onChange={(e) => setMovieName(e.target.value)} placeholder="Name..." type="text" />
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