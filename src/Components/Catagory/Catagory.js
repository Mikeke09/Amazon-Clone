import React from 'react'
import { catagoryImage } from "./CatagoryFull";
import CatagoryCard from './CatagoryCard'
import "./Catagory.css"
function Catagory() {
  return (
    <section className='container_cat'>
      {catagoryImage.map((infos) => (
        <CatagoryCard data={infos} />
      ))}
    </section>
  );
}

export default Catagory
