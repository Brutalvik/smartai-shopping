"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Button, Select, SelectItem } from "@heroui/react";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";
import { categories } from "@/data/categories";
import { addToast } from "@heroui/react";

interface ProductFormProps {
  product?: Product | null;
  onSubmitSuccess: () => void;
}

export default function ProductForm({
  product,
  onSubmitSuccess,
}: ProductFormProps) {
  const isEditing = !!product;

  const formik = useFormik({
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      quantity: product?.quantity || 0,
      category: product?.category || "",
      tags: product?.tags.join(", ") || "",
      isActive: product?.isActive || false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number()
        .min(0)
        .required("Price is required")
        .typeError("Price must be a number"),
      quantity: Yup.number()
        .integer()
        .min(0)
        .required("Quantity is required")
        .typeError("Quantity must be an integer"),
      category: Yup.string().required("Category is required"),
      tags: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      const payload = {
        title: values.title,
        description: values.description,
        price: values.price,
        quantity: values.quantity,
        category: values.category,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        isActive: values.isActive,
      };

      const url = isEditing
        ? `${CDN.sellerProductsApi}/seller/products/${product?.productId}`
        : `${CDN.sellerProductsApi}/seller/products`;

      const method = isEditing ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        if (res.ok) {
          addToast({
            description: `Product ${isEditing ? "updated" : "created"} successfully!`,
            color: "success",
            timeout: 3000,
          });
          onSubmitSuccess();
        } else {
          const errorData = await res.json();
          addToast({
            description: `Failed to ${isEditing ? "update" : "create"} product: ${errorData.error || errorData.message || res.statusText}`,
            color: "danger",
            timeout: 5000,
          });
          console.error("Failed to submit product:", errorData);
        }
      } catch (error: any) {
        addToast({
          description: `An error occurred: ${error.message}`,
          color: "danger",
          timeout: 5000,
        });
        console.error("Submission error:", error);
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
        value={String(formik.values.price)}
        onChange={formik.handleChange}
        errorMessage={formik.touched.price && formik.errors.price}
      />
      <Input
        label="Quantity"
        name="quantity"
        type="number"
        value={String(formik.values.quantity)}
        onChange={formik.handleChange}
        errorMessage={formik.touched.quantity && formik.errors.quantity}
      />
      <Select
        label="Category"
        placeholder="Select a category"
        selectedKeys={
          formik.values.category
            ? new Set([formik.values.category])
            : new Set([])
        }
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys).at(0);
          formik.setFieldValue(
            "category",
            selectedKey ? String(selectedKey) : ""
          );
        }}
        errorMessage={formik.touched.category && formik.errors.category}
      >
        {categories.map((cat) => (
          <SelectItem key={cat.label}>{cat.label}</SelectItem>
        ))}
      </Select>
      <Input
        label="Tags (comma-separated)"
        name="tags"
        value={formik.values.tags}
        onChange={formik.handleChange}
        errorMessage={formik.touched.tags && formik.errors.tags}
      />
      <div className="flex items-center gap-4">
        <span className="text-sm text-default-600">Active / Published</span>
        <Switch
          name="isActive"
          isSelected={formik.values.isActive}
          onValueChange={(val) => formik.setFieldValue("isActive", val)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          color="primary"
          variant="solid"
          onPress={() =>
            formik
              .setFieldValue("isActive", false)
              .then(() => formik.handleSubmit())
          }
          isDisabled={formik.isSubmitting}
        >
          Save as Draft
        </Button>
        <Button
          type="submit"
          color="success"
          variant="solid"
          isLoading={formik.isSubmitting}
        >
          {isEditing ? "Update Product" : "Submit Product"}
        </Button>
      </div>
    </form>
  );
}
