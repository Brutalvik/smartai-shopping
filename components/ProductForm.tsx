// pages/seller/products/upload.tsx
"use client";

import { useEffect, useState, ChangeEvent, KeyboardEvent, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {
  Select,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { UploadCloud, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import ImageConditionsModal from "@/components/ImageConditionsModal";
import { categories } from "@/data/categories";
import { CDN } from "@/config/config";
import { addToast } from "@heroui/react";
import { MultiStepLoader } from "@/components/ui/MultiStepLoader/MultiStepLoader";

const loadingStates = [
  { text: "Preparing product data..." }, // More descriptive
  { text: "Uploading product data and images..." },
  { text: "Saving product to database..." },
  { text: "Product upload complete!" },
];

export default function SellerProductUploadPage() {
  const [showImageTerms, setShowImageTerms] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [draftSaved, setDraftSaved] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentTagInput, setCurrentTagInput] = useState("");
  const loaderRef = useRef<any>(null);

  const {
    isOpen: isDraftModalOpen,
    onOpen: onOpenDraftModal,
    onClose: onCloseDraftModal,
  } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: 0,
      quantity: 0,
      category: "",
      tags: [] as string[],
      isActive: false,
      images: [] as File[],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
      price: Yup.number()
        .required("Price is required")
        .min(0.1, "Price must be at least $0.10"),
      quantity: Yup.number()
        .required("Quantity is required")
        .min(0, "Quantity cannot be negative"),
      category: Yup.string().required("Category is required"),
      tags: Yup.array().of(Yup.string()).min(1, "At least one tag is required"),
      images: Yup.array()
        .of(
          Yup.mixed<File>()
            .test(
              "fileSize",
              "Each image must be less than 5MB",
              (value) => !value || value.size <= 5 * 1024 * 1024
            )
            .test(
              "fileType",
              "Unsupported file format",
              (value) =>
                !value ||
                ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
                  value.type
                )
            )
        )
        .min(3, "At least three images are required")
        .required("Images are required"),
    }),

    onSubmit: async (values) => {
      if (!values.isActive) {
        onOpenDraftModal();
        return;
      }

      loaderRef.current?.start();
      loaderRef.current?.stepTo(0); // "Preparing product data..."

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price.toFixed(2));
      formData.append("quantity", values.quantity.toString());
      formData.append("category", values.category);
      formData.append("tags", values.tags.join(","));
      formData.append("isActive", String(values.isActive));
      values.images.forEach((file) => formData.append("images", file));

      try {
        loaderRef.current?.stepTo(1); // "Uploading product data and images..."

        const response = await fetch(
          `${CDN.sellerProductsApi}/seller/products`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          loaderRef.current?.stop();
          let errorMessage = "Product upload failed!";
          if (
            result.message === "Validation Failed" &&
            result.details &&
            Array.isArray(result.details)
          ) {
            errorMessage = `Validation failed: ${result.details
              .map(
                (err: any) =>
                  `${err.path ? err.path.join(".") + ": " : ""}${err.message}`
              )
              .join(", ")}`;
          } else if (result.message) {
            errorMessage = result.message;
          } else if (result.error) {
            errorMessage = result.error;
          }

          addToast({
            description: errorMessage,
            color: "danger",
            timeout: 5000, // Increased timeout for detailed errors
          });
          return;
        }

        loaderRef.current?.stepTo(2); // "Saving product to database..."

        addToast({
          description: "Product uploaded successfully!",
          color: "success",
          timeout: 2000,
        });

        loaderRef.current?.stepTo(3); // "Product upload complete!"
        setTimeout(() => {
          loaderRef.current?.stop();
          formik.resetForm(); // Reset the form after successful upload
          setImagePreviews([]); // Clear image previews
          setCarouselIndex(0);
        }, 800);
      } catch (err) {
        loaderRef.current?.stop();
        console.error("Upload Error:", err);
        addToast({
          description:
            "An unexpected error occurred during upload! Check console for details.",
          color: "danger",
          timeout: 5000,
        });
      }
    },
  });

  useEffect(() => {
    const draft = localStorage.getItem("sellerProductDraft");
    if (draft) {
      const parsed = JSON.parse(draft);
      formik.setValues({ ...parsed, images: [] });
      setImagePreviews([]);
    }
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newImagePreviews: string[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} is too large (max 5MB).`);
      } else if (
        !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        )
      ) {
        errors.push(`${file.name} has an unsupported file type.`);
      } else {
        validFiles.push(file);
        newImagePreviews.push(URL.createObjectURL(file));
      }
    });

    const combinedFiles = [...formik.values.images, ...validFiles].slice(0, 7);
    const combinedPreviews = [...imagePreviews, ...newImagePreviews].slice(
      0,
      7
    );

    formik.setFieldValue("images", combinedFiles);
    setImagePreviews(combinedPreviews);

    if (errors.length > 0) {
      formik.setFieldError("images", errors.join(" "));
    } else if (
      formik.errors.images &&
      typeof formik.errors.images === "string"
    ) {
      formik.setFieldError("images", undefined);
    }

    formik.setFieldTouched("images", true);
    setTimeout(() => {
      formik.validateField("images").catch(console.error);
    }, 0);
  };

  const handleImageRemove = (index: number) => {
    const updatedPreviews = [...imagePreviews];
    const updatedFiles = [...formik.values.images];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    const newIndex = Math.min(carouselIndex, updatedPreviews.length - 1);
    setCarouselIndex(newIndex >= 0 ? newIndex : 0);
    setImagePreviews(updatedPreviews);
    formik.setFieldValue("images", updatedFiles);
    formik.validateField("images");
  };

  const handleDraftSave = () => {
    const draft = JSON.stringify({ ...formik.values, images: [] });
    localStorage.setItem("sellerProductDraft", draft);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
    addToast({
      // Added toast for draft save
      description: "Draft saved locally!",
      color: "default",
      timeout: 2000,
    });
  };

  const nextImage = () =>
    setCarouselIndex((prev) => (prev + 1) % imagePreviews.length);
  const prevImage = () =>
    setCarouselIndex(
      (prev) => (prev - 1 + imagePreviews.length) % imagePreviews.length
    );

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

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCurrentTagInput(e.target.value);

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const newTag = currentTagInput.trim();
      if (newTag && !formik.values.tags.includes(newTag)) {
        formik.setFieldValue("tags", [...formik.values.tags, newTag]);
        setCurrentTagInput("");
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    formik.setFieldValue(
      "tags",
      formik.values.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <div className="min-h-screen">
      <MultiStepLoader
        ref={loaderRef}
        loadingStates={loadingStates}
        duration={1000}
      />
      <h1 className="text-3xl font-bold text-center mb-8">
        Upload Your Product
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
        <Card className="w-full">
          <CardHeader className="mb-4 font-semibold text-xl">
            Product Details
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Product Title"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.title && formik.errors.title)}
              errorMessage={formik.errors.title}
            />
            <Textarea
              label="Description"
              id="description"
              name="description"
              placeholder="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              isInvalid={
                !!(formik.touched.description && formik.errors.description)
              }
              errorMessage={formik.errors.description}
            />
            <div className="flex gap-4">
              <div className="flex flex-col w-full">
                <Input
                  id="price"
                  name="price"
                  label="Price"
                  placeholder="0.00"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  value={
                    formik.values.price === 0
                      ? ""
                      : formik.values.price.toString()
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                      formik.setFieldValue(
                        "price",
                        val === "" ? 0 : parseFloat(val)
                      );
                    }
                  }}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    const num = parseFloat(e.target.value);
                    if (!isNaN(num) && num >= 0) {
                      formik.setFieldValue("price", parseFloat(num.toFixed(2)));
                    } else if (e.target.value === "") {
                      formik.setFieldValue("price", 0);
                    }
                  }}
                  isInvalid={!!(formik.touched.price && formik.errors.price)}
                  errorMessage={formik.errors.price}
                  className="no-spinner"
                />
              </div>
              <div className="flex flex-col w-full">
                <Input
                  label="Quantity"
                  id="quantity"
                  name="quantity"
                  placeholder="Quantity"
                  type="number"
                  min="0" // Aligned with backend: min 0
                  step="1"
                  inputMode="numeric"
                  value={String(formik.values.quantity)}
                  isInvalid={
                    !!(formik.touched.quantity && formik.errors.quantity)
                  }
                  errorMessage={formik.errors.quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      formik.setFieldValue("quantity", 0);
                    } else {
                      const parsed = parseInt(val);
                      if (!isNaN(parsed) && parsed >= 0) {
                        // Ensure parsed quantity is not negative
                        formik.setFieldValue("quantity", parsed);
                      }
                    }
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
            // ... (inside your SellerProductUploadPage component)
            <Select
              id="category"
              name="category"
              selectedKeys={new Set([formik.values.category])}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys).at(0);
                if (selectedKey) {
                  const selectedCategory = categories.find(
                    (cat) => cat.key === selectedKey
                  );
                  formik.setFieldValue(
                    "category",
                    selectedCategory ? selectedCategory.label : ""
                  );
                } else {
                  formik.setFieldValue("category", "");
                }
              }}
              label="Product Category"
              className="w-full"
              isInvalid={!!(formik.touched.category && formik.errors.category)}
              errorMessage={formik.errors.category}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.key}>{cat.label}</SelectItem>
              ))}
            </Select>
            <div>
              <Input
                label="Tags"
                id="tags"
                name="tagsInput"
                placeholder="Tags (type and press comma, space, or enter)"
                value={currentTagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                onBlur={() => {
                  const newTag = currentTagInput.trim();
                  if (newTag && !formik.values.tags.includes(newTag)) {
                    formik.setFieldValue("tags", [
                      ...formik.values.tags,
                      newTag,
                    ]);
                    setCurrentTagInput("");
                  }
                  // Explicitly mark tags field as touched on blur
                  formik.handleBlur({ target: { name: "tags" } });
                }}
                isInvalid={
                  !!(
                    formik.touched.tags &&
                    formik.errors.tags &&
                    formik.values.tags.length === 0 // Only show error if no tags and validation failed
                  )
                }
                errorMessage={
                  formik.touched.tags &&
                  formik.errors.tags &&
                  formik.values.tags.length === 0
                    ? (formik.errors.tags as string)
                    : undefined
                }
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formik.values.tags.map((tag, index) => (
                  <Chip
                    key={tag}
                    onClose={() => handleTagRemove(tag)}
                    variant="flat"
                    color="primary"
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                id="isActive"
                checked={formik.values.isActive}
                onChange={(e) =>
                  formik.setFieldValue("isActive", e.target.checked)
                }
              />
              <label htmlFor="isActive">Publish Now</label>
            </div>
          </CardBody>
        </Card>

        <Card className="p-2 relative">
          <CardHeader className="mb-4 font-semibold text-xl">
            Product Images
          </CardHeader>
          <CardBody className="space-y-6">
            {imagePreviews.length === 0 ? (
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-64 cursor-pointer"
              >
                <UploadCloud className="w-10 h-10 text-gray-400" />
                <p className="text-sm mt-2 text-gray-500">
                  Click to upload images
                </p>
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
            ) : (
              <>
                <div className="relative w-full h-60 rounded-lg overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={carouselIndex}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={imagePreviews[carouselIndex]}
                        alt={`carousel-${carouselIndex}`}
                        fill
                        className="object-cover rounded"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {imagePreviews.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </>
                  )}
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div
                        className="flex gap-3 flex-wrap mt-4"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
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
                                    <Image
                                      src={src}
                                      alt={`preview-${idx}`}
                                      width={60}
                                      height={60}
                                      className={`rounded-md object-cover border cursor-pointer ${
                                        idx === carouselIndex
                                          ? "ring-2 ring-blue-500"
                                          : ""
                                      }`}
                                      onClick={() => setCarouselIndex(idx)}
                                    />

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
                          <label
                            htmlFor="images"
                            className="absolute bottom-4 right-4 flex items-center gap-2 border border-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md cursor-pointer shadow transition-all"
                          >
                            <UploadCloud className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Upload More
                            </span>
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
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            )}
            {formik.touched.images &&
              typeof formik.errors.images === "string" && (
                <p className="text-center text-sm text-red-500 mt-2">
                  {formik.errors.images}
                </p>
              )}
          </CardBody>
          <CardFooter>
            <p className="text-center text-sm text-gray-600 mt-4">
              By uploading images, you confirm that you are the lawful owner or
              have appropriate rights to use them and{" "}
              <span
                onClick={() => setShowImageTerms(true)}
                className="underline cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
              >
                agree to the image usage terms
              </span>
              .
            </p>
            <ImageConditionsModal
              open={showImageTerms}
              onClose={() => setShowImageTerms(false)}
            />
          </CardFooter>
        </Card>
      </div>

      <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
        <Button
          type="submit"
          onPress={formik.submitForm}
          className="w-full text-lg py-6"
        >
          Submit Product
        </Button>
        <Button variant="bordered" onPress={handleDraftSave} className="w-full">
          Save Draft
        </Button>
        {draftSaved && (
          <p className="text-green-600 text-center">Draft saved locally!</p>
        )}
      </div>

      <Modal isOpen={isDraftModalOpen} onOpenChange={onCloseDraftModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-semibold">
                Product in Draft Mode
              </ModalHeader>
              <ModalBody>
                <p>
                  This product is currently set to be a draft. Would you like to
                  publish it now or save it as a draft?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  onPress={() => {
                    onClose();
                    handleDraftSave();
                  }}
                >
                  Save Draft
                </Button>
                <Button
                  onPress={() => {
                    onClose();
                    formik.setFieldValue("isActive", true);
                    formik.submitForm();
                  }}
                >
                  Publish
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
