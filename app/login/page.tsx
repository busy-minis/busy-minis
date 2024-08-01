import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-wrap">
      <div className="flex w-full flex-col md:w-1/2">
        <div className="flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12">
          <Link href={"/"}>
            <Image
              src={"/logo-large.png"}
              alt="logo"
              height={300}
              width={300}
              quality={100}
            />
          </Link>
        </div>
        <div className="lg:w-[28rem] mx-auto text-center my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0">
          <p className="text-3xl font-bold ">Welcome back</p>
          <p className="mt-2  text-gray-500">
            Welcome back, please enter your details.
          </p>
          <button className="-2 mt-8 flex items-center justify-center rounded-md border px-4 py-1 outline-none ring-gray-400 ring-offset-2 transition focus:ring-2 hover:border-transparent hover:bg-black hover:text-white">
            <img
              alt="image"
              className="mr-2 h-5"
              src="https://static.cdnlogo.com/logos/g/35/google-icon.svg"
            />
            Log in with Google
          </button>
          <div className="relative mt-8 flex h-px place-items-center bg-gray-200">
            <div className="absolute left-1/2 h-6 w-14 -translate-x-1/2 bg-neutral-200 rounded-3xl text-center text-sm text-neutral-950">
              or
            </div>
          </div>
          <form className="flex flex-col pt-3 md:pt-8">
            <div className="flex flex-col pt-4">
              <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                <input
                  type="email"
                  id="login-email"
                  className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="mb-12 flex flex-col pt-4">
              <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                <input
                  type="password"
                  id="login-password"
                  className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Password"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-theme-orange px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2"
            >
              Log in
            </button>
          </form>
          <div className="py-12 text-center">
            <p className="whitespace-nowrap text-gray-600">
              Dont have an account?{" "}
              <Link
                href={"/signup"}
                className="underline-offset-4 font-semibold text-gray-900 underline"
              >
                Sign up for free.
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none relative hidden h-screen  select-none bg-theme-orange md:block md:w-1/2">
        <div className="absolute bottom-0 z-10 px-8 text-white opacity-100">
          <p className="mb-8 text-2xl font-semibold leading-10">
            At Busy Minis, we prioritize safety and reliability above all else.
            We maintain a steadfast commitment to punctuality and care. Our
            dedication ensures that children arrive safely and on time, while we
            continue to innovate with state-of-the-art safety features and
            personalized service.
          </p>
          <p className="mb-4 text-3xl font-semibold">Lia </p>
          <p className="">Founder, Busy Minis</p>
          <p className="mb-7 text-sm opacity-70">Transportaion Company</p>
        </div>
        {/* <img
          className="-z-1 absolute top-0 h-full w-full object-cover opacity-90"
          src="https://images.unsplash.com/photo-1565301660306-29e08751cc53?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
        /> */}
      </div>
    </div>
  );
}
