"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { CDN } from "@/config/config";

interface Product {
  productId: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  tags: string[];
  isActive: boolean;
}

interface EditProductFormProps {
  product: Product;
  onUpdated: () => void;
}

export default function EditProductForm({
  product,
  onUpdated,
}: EditProductFormProps) {
  const formik = useFormik({
    initialValues: {
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      tags: product.tags.join(", "),
      isActive: product.isActive,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      price: Yup.number().min(0).required("Required"),
      quantity: Yup.number().min(0).required("Required"),
      category: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      formData.append("quantity", values.quantity.toString());
      formData.append("category", values.category);
      formData.append("tags", values.tags);
      formData.append("isActive", values.isActive ? "true" : "false");

      const res = await fetch(
        `${CDN.sellerProductsApi}/seller/products/${product.productId}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (res.ok) {
        onUpdated();
      } else {
        console.error("Failed to update product");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        label="Title"
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        errorMessage={formik.touched.title && formik.errors.title}
      />
      <Textarea
        label="Description"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        errorMessage={formik.touched.description && formik.errors.description}
      />
      <Input
        label="Price"
        name="price"
        type="number"
        value={JSON.stringify(formik.values.price)}
        onChange={formik.handleChange}
        errorMessage={formik.touched.price && formik.errors.price}
      />
      <Input
        label="Quantity"
        name="quantity"
        type="number"
        value={JSON.stringify(formik.values.quantity)}
        onChange={formik.handleChange}
        errorMessage={formik.touched.quantity && formik.errors.quantity}
      />
      <Input
        label="Category"
        name="category"
        value={formik.values.category}
        onChange={formik.handleChange}
        errorMessage={formik.touched.category && formik.errors.category}
      />
      <Input
        label="Tags (comma-separated)"
        name="tags"
        value={formik.values.tags}
        onChange={formik.handleChange}
      />
      <div className="flex items-center gap-4">
        <span className="text-sm text-default-600">Active</span>
        <Switch
          name="isActive"
          isSelected={formik.values.isActive}
          onValueChange={(val) => formik.setFieldValue("isActive", val)}
        />
      </div>
      <Button type="submit" color="primary">
        Update Product
      </Button>
    </form>
  );
}
