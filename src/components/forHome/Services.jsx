import React from "react";
import Neo4jGraph from "./graph"; 
import { color } from "framer-motion";
import { blue } from "@mui/material/colors";
import  Searchinput from '../forSearchPage/searchInput'
import image2 from '../../assets/7273 2.png'
const Services = () => {
  return (
    <section className="services">
      <h2>Search</h2>
      <p>Explore the data-driven insights we provide</p>
      <Searchinput></Searchinput>
      <div className="graph-container">
        <h3>search by graph !</h3>
        <p>we provide our users a graphic research where they <br /> can simply explore their <br />needs graphically</p>
        <Neo4jGraph />
      </div>
    </section>
  );
};

export default Services;