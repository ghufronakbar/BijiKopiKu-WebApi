import { Box, Button, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import Image from "next/image";
import axiosInstance from "@/config/axiosInstance";
import { AuthResponse, ResErr, ResOk } from "@/models/Api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";
import toast from "@/helper/toast";
import { GiCoffeeBeans } from "react-icons/gi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      toast.loading();
      const { data } = await axiosInstance.post<ResOk<AuthResponse>>(
        "/account/login",
        { email, password }
      );
      Cookies.set("accessToken", data.data.accessToken);
      toast.success("Berhasil login");
      router.push("/dashboard");
    } catch (error) {
      const err = error as ResErr;
      toast.error(err.response?.data.message);
      console.log(error);
    }
  };

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
        className="flex items-center justify-center px-4 py-4 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[40%] 2xl:w-[30%] max-w-[400px] bg-black bg-opacity-70 z-10"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <form onSubmit={(e) => onSubmit(e)} className="w-full">
          <Stack gap="4" align="flex-start" className="w-full">
            <div className="flex flex-row items-center justify-center gap-2 w-full my-4">
              <GiCoffeeBeans className="text-white w-16 h-16" />
              <h1 className="text-white text-3xl font-black">BIJIKOPI.KU</h1>
            </div>
            <h2 className="text-2xl font-bold text-white">Login</h2>
            <Field label="Email" className="text-white">
              <Input
                className="bg-neutral-900 px-2 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password" className="text-white">
              <Input
                type="password"
                className="bg-neutral-900 px-2 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button
              type="submit"
              className="w-full bg-primary text-white font-semibold"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
      <Toaster />
    </div>
  );
};

export default LoginPage;
