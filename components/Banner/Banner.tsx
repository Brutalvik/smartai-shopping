import React from "react";
import ImageBanner from "@/components/ImageBanner";

const Banner = () => {
  const bannerImages = [
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpg",
    "/img5.jpg",
  ];
  return <ImageBanner images={bannerImages} />;
};

export default Banner;
