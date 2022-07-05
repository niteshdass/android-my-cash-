import React from 'react'
import { ImageSourcePropType } from 'react-native'
import { Box, VStack, Heading, Image } from 'native-base'

interface Props {
  title: string
  image: ImageSourcePropType
  children: React.ReactNode
}

const Masthead = ({ title, image, children }: Props) => {
  return (
    <VStack h="230px" pb={5}>
      <Image
        position="absolute"
        left={0}
        right={0}
        bottom={10}
        w="full"
        h="230px"
        resizeMode="cover"
        source={image}
        alt="masthead image"
      />
      {children}
      <Box flex={1} />
      <Heading style={{ paddingBottom: 220, marginTop: -70 }} color="white" p={6} size="xl">
        {title} dd
      </Heading>
    </VStack>
  )
}

export default Masthead
