"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Select, SelectItem } from "@heroui/react";
import Image from "next/image";
import { UploadCloud, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import ImageConditionsModal from "@/components/ImageConditionsModal";
import { categories } from "@/data/categories";

export default function SellerProductUploadPage() {
  const [showImageTerms, setShowImageTerms] = useState<boolean>(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

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
      price: 0,
      quantity: 0,
      category: "",
      tags: "",
      isActive: true,
      images: [] as File[],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
      price: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required")
        .min(0.1, "Price must be at least $0.10"),
      quantity: Yup.number()
        .typeError("Quantity must be a number")
        .required("Quantity is required")
        .min(1, "Quantity should be at least 1"),
      category: Yup.string().required("Category is required"),
      tags: Yup.string().required("At least one tag is required"),
      images: Yup.array()
        .of(Yup.mixed())
        .min(3, "At least three images are required")
        .required("Images are required"),
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
    <div className="min-h-screen px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Upload Your Product</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <Card className="p-6">
          <CardHeader className="mb-4 font-semibold text-xl">Product Details</CardHeader>
          <CardBody className="space-y-4">
            <Input id="title" name="title" placeholder="Product Title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.title && formik.errors.title && <p className="text-sm text-red-500">{formik.errors.title}</p>}
            <Textarea id="description" name="description" placeholder="Description" value={formik.values.description} 
              onChange={formik.handleChange} 
              rows={4} 
              isInvalid={(formik.touched.description && formik.errors.description) as boolean}
              errorMessage={formik.errors.description}
              />
            <div className="flex gap-4">
              <div className="flex flex-col w-full">
                <Input
                  id="price"
                  name="price"
                  placeholder="Price ($)"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={JSON.stringify(formik.values.price)}
                  isInvalid={!!(formik.touched.price && formik.errors.price)}
                  errorMessage={formik.errors.price}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      formik.setFieldValue("price", val);
                    } else {
                      formik.setFieldValue("price", 0);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  className="no-spinner"
                />
              </div>
              <div className="flex flex-col w-full">
                <Input
                  id="quantity"
                  name="quantity"
                  placeholder="Quantity"
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={String(formik.values.quantity)}
                  isInvalid={!!(formik.touched.quantity && formik.errors.quantity)}
                  errorMessage={formik.errors.quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      formik.setFieldValue("quantity", 0); 
                    } else {
                      const parsed = parseInt(val);
                      if (!isNaN(parsed)) {
                        formik.setFieldValue("quantity", parsed);
                      }
                    }
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
            <Select
              id="category"
              name="category"
              selectedKeys={formik.values.category}
              onSelectionChange={(key) => formik.setFieldValue("category", key)}
              label="Product Category"
              className="w-full"
              isInvalid={(formik.touched.category && formik.errors.category) as boolean}
              errorMessage={formik.errors.category}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.key}>{cat.label}</SelectItem>
              ))}
            </Select>
            <Input id="tags" name="tags" placeholder="Tags (comma-separated)" 
            value={formik.values.tags} 
            onChange={formik.handleChange} 
            isInvalid={(formik.touched.tags && formik.errors.tags) as boolean}
            errorMessage={formik.errors.tags}
            />
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
                  <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2">
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20  hover:bg-opacity-40 rounded-full p-2">
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
                                      className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-1 shadow-md bg-opacity-40 hover:bg-opacity-80"
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
                          <label htmlFor="images" className="ml-auto mt-4 flex items-center gap-2 hover:bg-gray-700 px-4 py-2 border border-gray-300 rounded-md cursor-pointer">
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
          <CardFooter>
            <p className="text-center text-sm text-gray-600 mt-4">
              By uploading images, you confirm that you are the lawful owner or have appropriate rights to use them and&nbsp;
              <span onClick={() => setShowImageTerms(true)} className="underline cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
                agree to the image usage terms
              </span>.
            </p>
            <ImageConditionsModal open={showImageTerms} onClose={() => setShowImageTerms(false)} />
          </CardFooter>
        </Card>
      </div>
      <div className="text-center text-sm text-red-500 mt-2">
        {formik.touched.images && typeof formik.errors.images === 'string' && formik.errors.images}
      </div>
      <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
        <Button type="submit" onPress={formik.submitForm} className="w-full text-lg py-6">Submit Product</Button>
        <Button variant="bordered" onPress={handleDraftSave} className="w-full">Save Draft</Button>
        {draftSaved && <p className="text-green-600 text-center">Draft saved locally!</p>}
      </div>
    </div>
  );
}
