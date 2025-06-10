import React from "react";
import ImageBanner from "@/components/ImageBanner";

const Banner = () => {
  const bannerImages = ["/banner1.png", "/banner2.png"];
  return <ImageBanner images={bannerImages} />;
};

export default Banner;
