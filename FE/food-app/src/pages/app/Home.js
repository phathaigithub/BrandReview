import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Layout from "../../components/Layouts/Layout";
import "../../styles/HomeStyle.css";
import "../../styles/Custom.css";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Section5 from "./Section5";
import Section6 from "./Section6";
import Section7 from "./Section7";

const Home = () => {
  return (
    <>
      <Layout>
        {/* Home Section Hero Banner */}
        <Section2 />
        <Section3 />

{/*         
        <Section6 /> */}
        {/* <Section1 /> */}

        {/* Home Section About */}
       

        {/* Home Section Menu */}

        {/* Home Section Promotion */}
        {/* <Section4 /> */}

        {/* Home Section Shop */}
        {/* <Section5 /> */}

        {/* Home Section Blog */}

        {/* Home Section Contact */}
        <Section7 />
      </Layout>
    </>
  );
};

export default Home;
