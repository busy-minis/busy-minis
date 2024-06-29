import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
const Footer = () => {
  return (
    <footer className="bg-neutral-900 overflow-x-hidden text-neutral-300  mt-24 pb-24">
      <Wrap />
      <section className=" py-12 mt-8 flex  gap-48  container mx-auto leading-relaxed">
        <div className="space-y-2">
          <h3 className="text-8xl pr-2 bg-gradient-to-r from-neutral-100 via-yellow-100 to-neutral-400 inline-block text-transparent bg-clip-text drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,.8)]  font-bold tracking-tighter uppercase ">
            Busy Minis
          </h3>

          <p>
            &copy; 2024 Busy Minis Transportation Company. All rights reserved.
          </p>
          <p>000 University Avenue, Fayetteville, GA 30214</p>
          <p>Telephone: 000-595-1911 | Email: lia@busyminis.com</p>
        </div>
        <aside className="text-base space-y-2">
          <h3 className="font-bold mt-4 text-xl">Menu</h3>
          <p>Home</p>
          <p>Pricing</p>
          <p>About</p>
          <p>Drivers</p>
          <p>Services</p>
        </aside>
      </section>
    </footer>
  );
};

const Wrap = () => {
  return (
    <section className="relative w-fit py-6 -left-4 ">
      <div className="bg-white absolute -rotate-1 text-2xl py-1 border-2  border-neutral-900 text-neutral-900 font-bold tracking-tighter uppercase flex gap-4 items-center whitespace-nowrap overflow-hidden w-fit">
        Minis <Arr /> Transportation <Arr /> Busy <Arr />
        Minis <Arr /> Transportation <Arr /> Busy <Arr />
        Minis <Arr /> Transportation <Arr /> Busy <Arr />
        Minis <Arr /> Transportation <Arr /> Busy <Arr />
      </div>
      <div className="bg-white rotate-1 absolute text-2xl  border-2 py-1  border-neutral-900 text-neutral-900 font-bold tracking-tighter uppercase flex gap-4 items-center whitespace-nowrap overflow-hidden w-fit ">
        Busy <Arr /> Minis <Arr /> Transportation <Arr />
        Busy <Arr /> Minis <Arr /> Transportation <Arr />
        Busy <Arr /> Minis <Arr /> Transportation <Arr />
        Busy <Arr /> Minis <Arr /> Transportation <Arr />
      </div>
    </section>
  );
};

const Arr = () => {
  return (
    <div className="flex justify-center bg-neutral-900 text-white rounded-full p-1 w-fit text-lg ">
      <ArrowRight />
    </div>
  );
};

export default Footer;
