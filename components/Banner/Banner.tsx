import React from "react";
import ImageBanner from "@/components/ImageBanner";

const Banner = () => {
  const bannerImages = [
    "/banner/img1.jpg",
    "/banner/img2.jpg",
    "/banner/img3.jpg",
    "/banner/img4.jpg",
    "/banner/img5.jpg",
  ];
  return <ImageBanner images={bannerImages} />;
};

export default Banner;
