import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-gray-100">
      <div id="hero" className="">
        Hero Section
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
