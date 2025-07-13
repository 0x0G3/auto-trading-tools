import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import Hero from "../components/Hero";
import InfoCards from "../components/InfoCards";
import Testomonials from "../components/Testomonials";
import Slideshow from "../components/Slideshow";
import Twocardcta from "../components/TwoCardCta";
import Securedcheckout from "../components/Securedcheckout";
import { useNavigation } from "../context/navigation";
// import { useNavigation } from "../contexts/navigation"; // Adjust path

const Home: NextPage = () => {
  // const router = useRouter();
  const { push } = useNavigation(); // Use the custom navigation context
  return (
    <div className="flex flex-col">
      <div id="hero" className="">
        <Hero
          title="Choose Your Plan"
          description="Explore our flexible pricing options for traders of all levels."
          buttonText="View Plans"
          onButtonClick={() => push("/pricing")}
          bgClass="bg-gradient-to-r from-blue-500 to-purple-500"
          textColor="text-white"
          maxWidth="max-w-lg"
        />
      </div>
      <div>
        <div id="infocard" className="">
          <InfoCards />
        </div>
        <div id="testomonials" className="">
          <Testomonials />
        </div>
        <div id="slideshow" className="">
          <Slideshow />
        </div>
      </div>
      <div id="hero-cta" className="">
        <Twocardcta />
      </div>
      <div id="secured-checkout">
        <Securedcheckout />
      </div>
      <div id="secured-checkout">
        <Securedcheckout />
      </div>
    </div>
  );
};

export default Home;
