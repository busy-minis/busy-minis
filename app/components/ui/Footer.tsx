import Image from "next/image";
const Footer = () => {
  return (
    <footer className="   ">
      {/* <Wrap /> */}
      <footer className="rounded-lg    m-4  mt-24">
        <div className="w-full max-w-screen-2xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="self-center text-2xl font-semibold whitespace-nowrap ">
              BusyMinis
            </span>

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
          <hr className="my-6 border-theme-orange/50 sm:mx-auto  lg:my-8" />
          <span className="block text-sm  sm:text-center ">
            &copy; 2024 Busy Minis Transportation Company. All rights reserved.
          </span>
        </div>
      </footer>
    </footer>
  );
};

export default Footer;
