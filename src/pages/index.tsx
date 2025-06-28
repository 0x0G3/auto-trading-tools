import type { NextPage } from "next";
import Hero from "../components/Hero";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col">
      <div id="hero" className="">
        <Hero />
      </div>
      <div>
        <div id="slideshow" className="">
          slideshow
        </div>
        <div id="infocard" className="">
          info cards
        </div>
        <div id="testomonials" className="">
          testimonials
        </div>
      </div>
      <div id="hero-cta" className="">
        two card cta
      </div>
    </div>
  );
};

export default Home;
