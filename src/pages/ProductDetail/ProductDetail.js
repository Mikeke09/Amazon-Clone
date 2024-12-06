import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import LayOut from "../../LayOut/LayOut";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endPoint";
import ProductCard from "../../Components/Product/ProductCard";
import Loader from "../../Components/Loader/Loader";

function ProductDetail() {
  const { productId } = useParams();
  const [isLoading, setisLoading] = useState(false);
  const [product, setProduct] = useState({});
  useEffect(() => {
    setisLoading(true);
    axios
      .get(`${productUrl}/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  }, []);
  return (
    <LayOut>
      {isLoading ? (<Loader />) : (<ProductCard 
      Product={product} 
      flex={true}
      renderDesc={true}
      renderAdd={true}
      />)}
    </LayOut>
  );
}

export default ProductDetail;
