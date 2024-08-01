import Image from "next/image";
const Footer = () => {
  return (
    <footer className="  bg-neutral-100 ">
      {/* <Wrap /> */}
      <footer className="rounded-lg  text-teal-800   m-4  mt-24">
        <div className="w-full max-w-screen-2xl mx-auto p-4 md:py-8">
          <div className="flex flex-col items-center  sm:flex-row  sm:items-center sm:justify-between">
            <div className="flex pb-4 sm:pb-0 items-center  text-2xl font-semibold whitespace-nowrap ">
              <p className="text-sm">@BusyMinis</p>
            </div>

            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium  sm:mb-0 ">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline  me-4 md:me-6">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline ">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-400 sm:mx-auto  lg:my-8" />
          <div className="block whitespace-nowrap overflow-x-hidden text-center text-xs sm:text-sm  sm:text-center ">
            &copy; 2024 Busy Minis Transportation Company. All rights reserved.
          </div>
        </div>
      </footer>
    </footer>
  );
};

export default Footer;
