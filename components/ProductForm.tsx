"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Card, CardHeader, CardBody } from "@heroui/card";
import Image from "next/image";
import { UploadCloud, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

export default function SellerProductUploadPage() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [draftSaved, setDraftSaved] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const draft = localStorage.getItem("sellerProductDraft");
    if (draft) {
      const parsed = JSON.parse(draft);
      formik.setValues(parsed);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      tags: "",
      isActive: true,
      images: [] as File[],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      price: Yup.number().required("Price is required").min(0),
      quantity: Yup.number().required("Quantity is required").min(0),
    }),
    onSubmit: async (values) => {
      console.log("Submitting", values);
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const newFiles = fileArray.slice(0, 7 - imagePreviews.length);
    const updatedPreviews = [...imagePreviews, ...newFiles.map((file) => URL.createObjectURL(file))];
    const updatedFiles = [...formik.values.images, ...newFiles];

    formik.setFieldValue("images", updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleDraftSave = () => {
    const draft = JSON.stringify(formik.values);
    localStorage.setItem("sellerProductDraft", draft);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const nextImage = () => {
    setCarouselIndex((prev) => (prev + 1) % imagePreviews.length);
  };

  const prevImage = () => {
    setCarouselIndex((prev) => (prev - 1 + imagePreviews.length) % imagePreviews.length);
  };

  const handleImageRemove = (index: number) => {
    const updatedPreviews = [...imagePreviews];
    const updatedFiles = [...formik.values.images];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    setImagePreviews(updatedPreviews);
    formik.setFieldValue("images", updatedFiles);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updatedPreviews = [...imagePreviews];
    const updatedFiles = [...formik.values.images];
    const [removedPreview] = updatedPreviews.splice(result.source.index, 1);
    const [removedFile] = updatedFiles.splice(result.source.index, 1);
    updatedPreviews.splice(result.destination.index, 0, removedPreview);
    updatedFiles.splice(result.destination.index, 0, removedFile);
    setImagePreviews(updatedPreviews);
    formik.setFieldValue("images", updatedFiles);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Upload Your Product</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <Card className="p-6">
          <CardHeader className="mb-4 font-semibold text-xl">Product Details</CardHeader>
          <CardBody className="space-y-4">
            <Input id="title" name="title" placeholder="Product Title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.title && formik.errors.title && <p className="text-sm text-red-500">{formik.errors.title}</p>}
            <Textarea id="description" name="description" placeholder="Description" value={formik.values.description} onChange={formik.handleChange} rows={4} />
            <div className="flex gap-4">
              <Input id="price" name="price" placeholder="Price ($)" type="number" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <Input id="quantity" name="quantity" placeholder="Quantity" type="number" value={formik.values.quantity} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            </div>
            {(formik.touched.price && formik.errors.price) && <p className="text-sm text-red-500">{formik.errors.price}</p>}
            {(formik.touched.quantity && formik.errors.quantity) && <p className="text-sm text-red-500">{formik.errors.quantity}</p>}
            <Input id="category" name="category" placeholder="Category" value={formik.values.category} onChange={formik.handleChange} />
            <Input id="tags" name="tags" placeholder="Tags (comma-separated)" value={formik.values.tags} onChange={formik.handleChange} />
            <div className="flex items-center gap-4">
              <Switch
                id="isActive"
                checked={formik.values.isActive}
                onChange={(e) => formik.setFieldValue("isActive", e.target.checked)}
              />
              <label htmlFor="isActive">Make this product live</label>
            </div>
          </CardBody>
        </Card>

        <Card className="p-6 relative">
          <CardHeader className="mb-4 font-semibold text-xl">Product Images</CardHeader>
          <CardBody className="space-y-6">
            {imagePreviews.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-64 cursor-pointer"
                onClick={() => document.getElementById("images")?.click()}
              >
                <label htmlFor="images" className="flex flex-col items-center cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-gray-400 cursor-pointer" />
                  <p className="text-sm mt-2 text-gray-500">Click to upload images</p>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="relative w-full h-60 rounded-lg overflow-hidden">
                  <Image src={imagePreviews[carouselIndex]} alt={`carousel-${carouselIndex}`} fill className="object-cover rounded" />
                  <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-2">
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-2">
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div className="flex justify-between items-end mt-4 gap-3 flex-wrap" ref={provided.innerRef} {...provided.droppableProps}>
                        <AnimatePresence>
                          {imagePreviews.map((src, idx) => (
                            <Draggable key={src} draggableId={src} index={idx}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="relative"
                                >
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative"
                                  >
                                    <Image src={src} alt={`preview-${idx}`} width={60} height={60} className="rounded-md object-cover border" />
                                    <button
                                      onClick={() => handleImageRemove(idx)}
                                      className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full p-1 shadow-md"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </motion.div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                        {imagePreviews.length < 7 && (
                          <label htmlFor="images" className="ml-auto mt-4 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 border border-gray-300 rounded-md cursor-pointer">
                            <UploadCloud className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">Upload More</span>
                            <input id="images" name="images" type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                          </label>
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
        <Button type="submit" onPress={formik.submitForm} className="w-full text-lg py-6">Submit Product</Button>
        <Button variant="bordered" onPress={handleDraftSave} className="w-full">Save Draft</Button>
        {draftSaved && <p className="text-green-600 text-center">Draft saved locally!</p>}
      </div>
    </div>
  );
}
