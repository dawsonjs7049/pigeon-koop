import Photo from "@/models/Photo";
import { auth, db } from "@/utils/firebase";
import { Box, Text } from "@chakra-ui/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from '@/styles/Photos.module.css'
import ReactImageGallery from "react-image-gallery";

export default function Photos() {

    const [user, loading] = useAuthState(auth);
    const [images, setImages] = useState([]);

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
        });

        return unsubscribe;
    }, [user, loading]);

    return (
        <Box style={styles} maxW='1300px' margin='auto' w='100%' p='5'>
            <Text fontSize="2xl">Photo Gallery</Text>
            <Box borderRadius='5px' boxShadow='md' p='5'>
                <ReactImageGallery 
                    items={images.map((imageObj) => { 
                        return { original: imageObj.url, thumbnail: imageObj.url, thumbnailHeight: '200px', thumbnailWidth: '200px' }
                    })}
                />
            </Box>
        </Box>
    )
}