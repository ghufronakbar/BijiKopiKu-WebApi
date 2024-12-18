import { Box, Button, Stack } from "@chakra-ui/react";
import Image from "next/image";
import { GiCoffeeBeans } from "react-icons/gi";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Image
        src={"/bg.jpg"}
        alt=""
        width={2560}
        height={1440}
        className="w-full h-full object-cover fixed"
      />
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50" />
      <Box
        className="flex items-center justify-center px-4 py-4 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[60%] 2xl:w-[30%] max-w-[1000px] bg-black bg-opacity-70 z-10"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <div className="w-full">
          <Stack gap="4" align="flex-start" className="w-full">
            <div className="flex flex-row items-center justify-center gap-2 w-full my-4 text-center">
              <GiCoffeeBeans className="text-white w-16 h-16" />
              <h1 className="text-white text-xl font-black">
                WELCOME TO WEBSITE ADMIN BIJIKOPI.KU
              </h1>
            </div>

            <Button
              type="submit"
              className="w-full bg-secondary text-primary font-semibold"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </Stack>
        </div>
      </Box>
    </div>
  );
}
