import { Box, Text } from "@chakra-ui/react";

export default function Map() {

    return (
        <Box maxW='1300px' w='100%' margin='auto' p='5'>
            <Text fontSize='2xl' fontWeight='bold' my='5'>Map</Text>
            <Box className="map-div">
                <Box className="gmap_canvas">
                    <iframe 
                        title="gmap"
                        width="600" 
                        height="500" 
                        id="gmap_canvas" 
                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBEWYCWX0NQa09g3-ccxoE72Aqg3ADJYe0&q=29035%20Pardun%20Road%20Danbury%20Wi&maptype=satellite"
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight="0" 
                        marginWidth="0">
                    </iframe>
                </Box>
            </Box>
        </Box>
    )
}