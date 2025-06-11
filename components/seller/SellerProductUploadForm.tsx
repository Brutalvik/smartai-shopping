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
import { useRouter } from "next/navigation";

interface SellerProductUploadFormProps {
  initialProduct?: Product | null;
}

export default function SellerProductUploadForm({
  initialProduct,
}: SellerProductUploadFormProps) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  const formik = useFormik({
    initialValues: {
      title: initialProduct?.title || "",
      description: initialProduct?.description || "",
      price: initialProduct?.price || 0,
      quantity: initialProduct?.quantity || 0,
      category: initialProduct?.category || "",
      tags: initialProduct?.tags.join(", ") || "",
      isActive:
        initialProduct?.isActive !== undefined ? initialProduct.isActive : true,
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
        ? `${CDN.sellerProductsApi}/seller/products/${initialProduct?.productId}`
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
          router.push("/seller/dashboard");
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

  const handleSaveAsDraft = () => {
    formik.setFieldValue("isActive", false).then(() => {
      formik.handleSubmit();
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Product" : "Upload New Product"}
      </h1>
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
            onPress={handleSaveAsDraft}
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
    </div>
  );
}
