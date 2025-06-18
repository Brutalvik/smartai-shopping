"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import dayjs from "dayjs";
import { dummySales } from "@/data/dummySales";

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const geoData: { name: string; coordinates: [number, number]; code: string }[] =
  [
    { name: "USA", coordinates: [-100, 40], code: "US" },
    { name: "India", coordinates: [78.96, 20.59], code: "IN" },
    { name: "Germany", coordinates: [10.45, 51.16], code: "DE" },
    { name: "Canada", coordinates: [-106, 56], code: "CA" },
  ];

type Sale = (typeof dummySales)[number];

type Product = {
  title: string;
  salesCount: number;
};

const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, Math.round);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.2 });
    rounded.on("change", (latest) => setDisplay(latest));
    return () => controls.stop();
  }, [value]);

  return (
    <motion.span className="text-2xl font-semibold">
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function SellerAnalyticsDashboard(): JSX.Element {
  const [selectedDateRange, setSelectedDateRange] = useState<
    "7d" | "30d" | "all"
  >("30d");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const modal = useDisclosure();

  const dateCutoff = useMemo(() => {
    if (selectedDateRange === "all") return null;
    const days = selectedDateRange === "7d" ? 7 : 30;
    return dayjs().subtract(days, "day");
  }, [selectedDateRange]);

  const filteredSales = useMemo(() => {
    return dummySales.filter((sale) => {
      const dateOK = !dateCutoff || dayjs(sale.orderDate).isAfter(dateCutoff);
      const countryOK =
        !selectedCountry || sale.buyerEmail?.includes(selectedCountry); // Simplified region logic
      return dateOK && countryOK;
    });
  }, [selectedDateRange, selectedCountry]);

  const derivedProducts: Product[] = useMemo(() => {
    const map = new Map<string, number>();
    filteredSales.forEach((sale) => {
      map.set(sale.productTitle, (map.get(sale.productTitle) || 0) + 1);
    });
    return Array.from(map.entries()).map(([title, count]) => ({
      title,
      salesCount: count,
    }));
  }, [filteredSales]);

  const totalSales = filteredSales.reduce((sum, s) => sum + s.amount, 0);
  const totalOrders = filteredSales.length;
  const repeatRate = Math.floor(Math.random() * 30) + 10; // You can customize with a real repeat flag

  const customerBreakdown = {
    labels: ["Repeat", "New"],
    datasets: [
      {
        data: [repeatRate, 100 - repeatRate],
        backgroundColor: ["#10b981", "#f59e0b"],
      },
    ],
  };

  const revenueTrend = {
    labels: Array.from({ length: 6 }, (_, i) => `Week ${i + 1}`),
    datasets: [
      {
        label: "Revenue",
        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 3000)),
        backgroundColor: "#6366f1",
      },
    ],
  };

  const productSalesTrend = (product: Product) => ({
    labels: Array.from({ length: 6 }, (_, i) => `Week ${i + 1}`),
    datasets: [
      {
        label: product.title,
        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 1000)),
        borderColor: "#0ea5e9",
        fill: false,
        tension: 0.3,
      },
    ],
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    modal.onOpen();
  };

  return (
    <div className="w-full p-2 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Seller Analytics</h1>
        <select
          value={selectedDateRange}
          onChange={(e) =>
            setSelectedDateRange(e.target.value as "7d" | "30d" | "all")
          }
          className="border px-3 py-1.5 rounded text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>Total Sales</CardHeader>
          <CardBody>
            <AnimatedCounter value={totalSales} prefix="$" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Total Orders</CardHeader>
          <CardBody>
            <AnimatedCounter value={totalOrders} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Repeat Rate</CardHeader>
          <CardBody>
            <AnimatedCounter value={repeatRate} suffix="%" />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>Customer Breakdown</CardHeader>
          <CardBody>
            <Doughnut data={customerBreakdown} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Revenue Trend</CardHeader>
          <CardBody>
            <Bar data={revenueTrend} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>Global Sales Map</CardHeader>
        <CardBody>
          <ComposableMap projectionConfig={{ scale: 140 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#f1f5f9"
                    stroke="#cbd5e1"
                  />
                ))
              }
            </Geographies>
            {geoData.map(({ name, coordinates, code }) => (
              <Marker key={code} coordinates={coordinates}>
                <Tooltip content={`${name}`}>
                  <circle
                    r={6}
                    fill={code === selectedCountry ? "#dc2626" : "#0ea5e9"}
                    stroke="#fff"
                    strokeWidth={2}
                    className="cursor-pointer hover:scale-125 transition-transform duration-200"
                    onClick={() =>
                      setSelectedCountry((prev) =>
                        prev === code ? null : code
                      )
                    }
                  />
                </Tooltip>
              </Marker>
            ))}
          </ComposableMap>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Top Products</CardHeader>
        <CardBody>
          <ul className="space-y-2">
            {derivedProducts.map((product) => (
              <li
                key={product.title}
                className="flex justify-between items-center border-b pb-1 cursor-pointer hover:text-primary"
                onClick={() => handleProductClick(product)}
              >
                <span>{product.title}</span>
                <span className="text-sm text-gray-500">
                  {product.salesCount} sold
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Modal isOpen={modal.isOpen} onClose={modal.onClose} size="4xl">
        <ModalContent>
          <ModalHeader>{selectedProduct?.title} – Sales Trend</ModalHeader>
          <ModalBody>
            {selectedProduct && (
              <Line data={productSalesTrend(selectedProduct)} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
