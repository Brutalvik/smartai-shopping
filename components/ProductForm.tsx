"use client";

import { useState, ChangeEvent } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import {Switch} from "@heroui/switch";
import { Card, CardBody } from "@heroui/card";
import { CDN } from "@/config/config";



interface ProductFormValues {
  title: string;
  description: string;
  price: string;
  category: string;
  tags: string;
  quantity: string;
  images: File[];
  isActive: boolean;
}

export default function ProductForm() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      tags: "",
      quantity: "",
      images: [],
      isActive: true,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      price: Yup.number().required("Price is required").min(0),
      quantity: Yup.number().required("Quantity is required").min(0),
    }),
    onSubmit: async (values, { setSubmitting }) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key === "images" && Array.isArray(value)) {
              (value as File[]).forEach((file) => formData.append("images", file));
            } else {
              formData.append(key, value as string);
            }
          });        
      
        try {
          const res = await fetch(`${CDN.sellerProductsApi}/seller/products`, {
            method: "POST",
            body: formData,
            credentials: "include",
          });
      
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to submit");
      
          // Optional: show success toast
          alert("Product submitted successfully!");
          formik.resetForm();
          setImagePreviews([]);
        } catch (error) {
          alert(`Error: ${(error as Error).message}`);
        } finally {
          setSubmitting(false);
        }
      }
      
  });
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    formik.setFieldValue("images", fileArray);
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    <Card className="max-w-3xl mx-auto mt-8 p-6 space-y-6 shadow-2xl">
      <h2 className="text-2xl font-semibold tracking-tight">Add a New Product</h2>
      <CardBody>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title">Product Title</label>
              <Input
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
              )}
            </div>
            <div>
              <label htmlFor="price">Price ($)</label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
              )}
            </div>
            <div>
              <label htmlFor="quantity">Quantity</label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.quantity}</p>
              )}
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <Input
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <label htmlFor="tags">Tags (comma separated)</label>
            <Input
              id="tags"
              name="tags"
              value={formik.values.tags}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <label htmlFor="images">Product Images</label>
            <Input
              id="images"
              name="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="flex gap-4 mt-4 flex-wrap">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} className="w-24 h-24 object-cover rounded shadow" alt="Preview" />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Switch
              checked={formik.values.isActive}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue("isActive", e.target.checked)}
              id="isActive"
            />
            <label htmlFor="isActive">Make this product live</label>
          </div>

          <Button type="submit" className="w-full mt-4">
            Submit Product
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
