import Photo from "@/models/Photo";
import { auth, db, storage } from "@/utils/firebase";
import { Box, Button, HStack, Input, Spacer, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Textarea, Toast, useToast, Spinner } from "@chakra-ui/react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from '@/styles/Photos.module.css'
import ReactImageGallery from "react-image-gallery";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { formatDate } from "@/utils/utilities";
import CommentContainer from "@/components/CommentContainer";
import { BsTrash } from "react-icons/bs";

export default function Photos() {

    const [user, loading] = useAuthState(auth);
    const [images, setImages] = useState([]);
    const [uploadImage, setUploadImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [comment, setComment] = useState();
    const [currentGalleryImage, setCurrentGalleryImage] = useState();

    const toast = useToast();

    const { isOpen: uploadIsOpen, onOpen: uploadOnOpen, onClose: uploadOnClose } = useDisclosure();

    useEffect(() => {
        const photosRef = collection(db, 'images');
        const q = query(photosRef, orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let images = snapshot.docs.map((doc) => {
                return new Photo({ ...doc.data(), id: doc.id });
            });

            console.log("images");
            console.log(images);
            setImages(images);

            console.log("SETTING CURRENT GALLERY IMAGE");
            console.log(images[0]);
            setCurrentGalleryImage(images[0]);
        });

        return unsubscribe;
    }, [user, loading]);

    const handleUpload = () => {
        const storageRef = ref(storage, `cabinPictures/${uploadImage.name}`);

        const uploadTask = uploadBytesResumable(storageRef, uploadImage);

        setIsUploading(true);

        uploadTask.on('state_changed', 
        (snapshot) => {
            
        },
        (error) => {
            toast({
                title: 'Failure',
                description: "Your Photo Failed to Upload",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });

            setIsUploading(false);
        },
        () => {
            // successfully uploaded
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                uploadFileUrl(downloadUrl);
            });
        });
    }

    const uploadFileUrl = async (url) => {
        const collectionRef = collection(db, 'images');

        await addDoc(collectionRef, {
            comment: comment,
            owner: user.email,
            date: formatDate(new Date()),
            timestamp: serverTimestamp(),
            url: url,
            filename: `cabinPictures/${uploadImage.name}`,
        });

        setIsUploading(false);
        setUploadImage(null);
        setComment('');

        uploadOnClose();

        toast({
            title: 'Success',
            description: "Your Photo was Successfully Uploaded",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    const handleDelete = async () => {
        const imageStorageRef = ref(storage, currentGalleryImage.filename);

        deleteObject(imageStorageRef).then(async () => {
            const imageRef = doc(db, 'images', currentGalleryImage.id);

            await deleteDoc(imageRef);
    
            toast({
                title: 'Success',
                description: 'Your Photo was Successfully Deleted',
                duration: 5000,
                isClosable: true,
            });
        }).catch((error) => {
            console.log(error);
            toast({
                title: 'Failure',
                description: 'Your Photo was Unable to be Deleted',
                duration: 5000,
                isClosable: true,
            });
        });       
    }

    return (
        <Box style={styles} maxW='1300px' margin='auto' w='100%' p='5'>
            <HStack my='5'>
                <Text fontSize="2xl">Photo Gallery</Text>
                <Spacer />
                <Button onClick={uploadOnOpen}>Upload Picture</Button>
            </HStack>
            
            <Box borderRadius='5px' boxShadow='md' p='5' minH='60vh'>
                <ReactImageGallery 
                    items={images.map((imageObj) => { 
                        return { original: imageObj.url, thumbnail: imageObj.url, thumbnailHeight: '200px', thumbnailWidth: '200px' }
                    })}
                    onBeforeSlide={(index) => setCurrentGalleryImage(images[index])}
                />
            </Box>
            { currentGalleryImage &&
                <>
                    <Box w='100%' rounded='md' shadow='md' p='5' mt='2'>
                        {currentGalleryImage.comment !== '' &&
                            <Box>
                                <Text>{currentGalleryImage.comment}</Text>
                            </Box>
                        }
                        <HStack justifyContent='space-between'>
                            <Box>
                                <Text fontSize='sm'>Posted by {currentGalleryImage.owner} on {currentGalleryImage.date}</Text>
                            </Box>
                            {currentGalleryImage.owner === user.email &&
                                <Box>
                                    <Button onClick={handleDelete} colorScheme='red' p='0'>
                                        <BsTrash fontSize='20px' />
                                    </Button>
                                </Box>
                            }
                        </HStack>
                    </Box>
                    
                    <CommentContainer photoId={currentGalleryImage.id} user={user} />
                </>
            }

            <Modal isOpen={uploadIsOpen} onClose={uploadOnClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent h='fit-content'>
                    <ModalHeader>Upload Photo</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb='2'>Select a Photo to Upload</Text>
                        <Input type="file" mb="5" onChange={(e) => setUploadImage(e.target.files[0])}/>
                        <Text mb='2'>Add a Comment</Text>
                        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment..." />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={uploadOnClose}>
                            Close
                        </Button>
                        <Button variant='outline' transition='ease-in-out' display={uploadImage != null ? 'block' : 'none'} onClick={() => handleUpload()}>{isUploading ? <Spinner color='red.500' /> : 'Upload'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}