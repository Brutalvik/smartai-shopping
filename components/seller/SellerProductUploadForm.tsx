"use client";

import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { addToast } from "@heroui/react";
import { MultiStepLoader } from "@/components/ui/MultiStepLoader/MultiStepLoader";
import ImageConditionsModal from "@/components/ImageConditionsModal";
import { categories } from "@/data/categories";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";

interface SellerProductUploadFormProps {
  initialProduct?: Product | null;
}

const loadingStates = [
  { text: "Preparing product data..." },
  { text: "Uploading product data and images..." },
  { text: "Saving product to database..." },
  { text: "Product upload complete!" },
];

export default function SellerProductUploadForm({
  initialProduct,
}: SellerProductUploadFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = !!initialProduct;
  const loaderRef = useRef<any>(null);

  const [showImageTerms, setShowImageTerms] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialProduct?.images || []
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentTagInput, setCurrentTagInput] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);

  const {
    isOpen: isDraftModalOpen,
    onOpen: onOpenDraftModal,
    onClose: onCloseDraftModal,
  } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      title: initialProduct?.title || "",
      description: initialProduct?.description || "",
      price: initialProduct?.price || 0,
      quantity: initialProduct?.quantity || 0,
      category: initialProduct?.category || "",
      tags: initialProduct?.tags || [],
      isActive: initialProduct?.isActive || false,
      images: [] as File[],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().min(10).required("Description is required"),
      price: Yup.number().min(0.1).required("Price is required"),
      quantity: Yup.number().min(0).required("Quantity is required"),
      category: Yup.string().required("Category is required"),
      tags: Yup.array().of(Yup.string()).min(1, "At least one tag is required"),
      images: isEditing
        ? Yup.array()
        : Yup.array()
            .of(
              Yup.mixed<File>()
                .test("fileSize", "Each image must be under 5MB", (value) =>
                  value ? value.size <= 5 * 1024 * 1024 : true
                )
                .test("fileType", "Unsupported file type", (value) =>
                  value
                    ? [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                      ].includes(value.type)
                    : true
                )
            )
            .min(3, "At least three images are required")
            .required("Images required"),
    }),
    onSubmit: async (values) => {
      if (!values.isActive) {
        onOpenDraftModal();
        return;
      }

      loaderRef.current?.start();
      loaderRef.current?.stepTo(0);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      formData.append("quantity", String(values.quantity));
      formData.append("category", values.category);
      formData.append("tags", values.tags.join(","));
      formData.append("isActive", String(values.isActive));

      values.images.forEach((file) => formData.append("images", file));

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${CDN.sellerProductsApi}/seller/products/${initialProduct?.productId}`
        : `${CDN.sellerProductsApi}/seller/products`;

      try {
        loaderRef.current?.stepTo(1);
        const res = await fetch(url, {
          method,
          credentials: "include",
          body: formData,
        });

        const result = await res.json();
        if (!res.ok) {
          loaderRef.current?.stop();
          addToast({
            description: result.message || "Failed to upload product",
            color: "danger",
          });
          return;
        }

        loaderRef.current?.stepTo(2);
        addToast({
          description: isEditing
            ? "Product updated successfully!"
            : "Product uploaded successfully!",
          color: "success",
        });

        loaderRef.current?.stepTo(3);
        setTimeout(() => {
          loaderRef.current?.stop();
          if (isEditing) {
            router.push("/seller/products?updated=1");
          } else {
            formik.resetForm();
            setImagePreviews([]);
            setCarouselIndex(0);
          }
        }, 800);
      } catch (err) {
        loaderRef.current?.stop();
        console.error("Error uploading product:", err);
        addToast({
          description: "Unexpected error occurred",
          color: "danger",
        });
      }
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (
        file.size <= 5 * 1024 * 1024 &&
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        )
      ) {
        validFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });

    const combinedFiles = [...formik.values.images, ...validFiles].slice(0, 7);
    const combinedPreviews = [...imagePreviews, ...newPreviews].slice(0, 7);

    formik.setFieldValue("images", combinedFiles);
    setImagePreviews(combinedPreviews);
  };

  const handleImageRemove = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const nextImage = () =>
    setCarouselIndex((prev) => (prev + 1) % imagePreviews.length);
  const prevImage = () =>
    setCarouselIndex(
      (prev) => (prev - 1 + imagePreviews.length) % imagePreviews.length
    );

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      const tag = currentTagInput.trim();
      if (tag && !formik.values.tags.includes(tag)) {
        formik.setFieldValue("tags", [...formik.values.tags, tag]);
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
        {isEditing ? "Edit Product" : "Upload Your Product"}
      </h1>

      {/* Your existing form components remain unchanged */}
      {/* Update buttons accordingly */}
      <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
        <Button
          type="submit"
          onPress={formik.submitForm}
          className="w-full text-lg py-6"
        >
          {isEditing ? "Update Product" : "Submit Product"}
        </Button>
        {!isEditing && (
          <Button
            variant="bordered"
            onPress={() => {
              localStorage.setItem(
                "sellerProductDraft",
                JSON.stringify({ ...formik.values, images: [] })
              );
              setDraftSaved(true);
              setTimeout(() => setDraftSaved(false), 2000);
            }}
            className="w-full"
          >
            Save Draft
          </Button>
        )}
        {draftSaved && (
          <p className="text-green-600 text-center">Draft saved locally!</p>
        )}
      </div>

      {/* Include the Modal, ImageConditionsModal, etc. as you had before */}
    </div>
  );
}
