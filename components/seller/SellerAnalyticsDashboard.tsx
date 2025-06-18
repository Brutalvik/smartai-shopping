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
  Switch,
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
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Repeat,
  Percent,
  Star,
  ArrowDownCircle,
  PieChart,
  BarChart3,
  Globe,
} from "lucide-react";
import dayjs from "dayjs";
import { feature } from "topojson-client";
import { dummySales } from "@/data/dummySales";
import AnimatedCounter from "@/components/seller/AnimatedCounter";

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
const geoData = [
  { name: "USA", coordinates: [-100, 40], code: "US" },
  { name: "India", coordinates: [78.96, 20.59], code: "IN" },
  { name: "Indonesia", coordinates: [113.9, -0.789], code: "ID" },
  { name: "Canada", coordinates: [-106, 56], code: "CA" },
  { name: "Singapore", coordinates: [103.8, 1.35], code: "SG" },
];

type Product = { title: string; salesCount: number };

const IconWrapper = ({
  icon: Icon,
  color,
}: {
  icon: React.ElementType;
  color: string;
}) => (
  <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
    <Icon className="w-5 h-5" />
  </div>
);

export default function SellerAnalyticsDashboard(): JSX.Element {
  const [selectedDateRange, setSelectedDateRange] = useState<
    "7d" | "30d" | "all"
  >("30d");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [focusedMap, setFocusedMap] = useState(false);
  const [geoJson, setGeoJson] = useState<any | null>(null);
  const modal = useDisclosure();

  const dateCutoff = useMemo(() => {
    if (selectedDateRange === "all") return null;
    return dayjs().subtract(selectedDateRange === "7d" ? 7 : 30, "day");
  }, [selectedDateRange]);

  const filteredSales = useMemo(() => {
    return dummySales.filter((sale) => {
      const dateOK = !dateCutoff || dayjs(sale.orderDate).isAfter(dateCutoff);
      const countryOK =
        !selectedCountry || sale.buyerEmail?.includes(selectedCountry);
      return dateOK && countryOK;
    });
  }, [selectedDateRange, selectedCountry]);

  const derivedProducts = useMemo(() => {
    const map = new Map<string, number>();
    filteredSales.forEach((sale) => {
      map.set(sale.productTitle, (map.get(sale.productTitle) || 0) + 1);
    });
    return Array.from(map.entries()).map(([title, salesCount]) => ({
      title,
      salesCount,
    }));
  }, [filteredSales]);

  const totalSales = useMemo(
    () => filteredSales.reduce((sum, s) => sum + s.amount, 0),
    [filteredSales]
  );

  const totalOrders = useMemo(() => filteredSales.length, [filteredSales]);

  const repeatRate = useMemo(() => Math.floor(Math.random() * 30) + 10, []);

  const avgOrderValue = useMemo(
    () => (totalOrders ? totalSales / totalOrders : 0),
    [totalSales, totalOrders]
  );

  const totalTax = useMemo(
    () => filteredSales.reduce((sum, s) => sum + (s.tax || 0), 0),
    [filteredSales]
  );

  const returnRate = useMemo(() => {
    const returned = filteredSales.filter(
      (s) => s.status === "returned"
    ).length;
    return Math.floor((returned / totalOrders) * 100);
  }, [filteredSales, totalOrders]);

  const topProduct = useMemo(
    () => derivedProducts[0]?.title || "—",
    [derivedProducts]
  );

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

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((topology) => {
        const countries = feature(topology, topology.objects.countries);
        setGeoJson(countries);
      });
  }, []);

  const kpi = [
    {
      label: "Total Sales",
      value: totalSales,
      prefix: "$",
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      label: "Repeat Rate",
      value: repeatRate,
      suffix: "%",
      icon: Repeat,
      color: "yellow",
    },
    {
      label: "Return Rate",
      value: returnRate,
      suffix: "%",
      icon: ArrowDownCircle,
      color: "red",
    },
    {
      label: "Avg Order Value",
      value: avgOrderValue,
      prefix: "$",
      icon: Percent,
      color: "indigo",
    },
    {
      label: "Total Tax",
      value: totalTax,
      prefix: "$",
      icon: Percent,
      color: "purple",
    },
    { label: "Top Product", value: topProduct, icon: Star, color: "cyan" },
  ];

  return (
    <div className="w-full p-2 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">📊 Sales Analytics</h1>
        <select
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value as any)}
          className="border px-3 py-1.5 rounded text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
        {kpi.map(({ label, value, icon, prefix, suffix, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className={`border-l-4 border-${color}-500 shadow-md`}>
              <CardHeader className="flex items-center gap-2 text-gray-500">
                <IconWrapper icon={icon} color={color} />
                <span className="text-sm font-medium truncate">{label}</span>
              </CardHeader>
              <CardBody className="text-gray-500">
                {typeof value === "string" ? (
                  <div className="text-sm truncate">{value}</div>
                ) : (
                  <AnimatedCounter
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    className="text-gray-500"
                  />
                )}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          <Card>
            <CardHeader className="flex gap-2 items-center">
              <PieChart className="w-4 h-4 text-emerald-500" />
              Customer Breakdown
            </CardHeader>
            <CardBody>
              <div className="h-[200px]">
                <Doughnut
                  data={customerBreakdown}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="flex gap-2 items-center">
              <BarChart3 className="w-4 h-4 text-violet-500" />
              Revenue Trend
            </CardHeader>
            <CardBody>
              <div className="h-[200px]">
                <Bar
                  data={revenueTrend}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="col-span-1 lg:col-span-2 h-full">
            <CardHeader className="flex justify-between items-center">
              <span className="flex gap-2 items-center">
                <Globe className="w-4 h-4 text-blue-500" />
                Global Sales Map ({focusedMap ? "Focused" : "World"})
              </span>
              <Switch isSelected={focusedMap} onValueChange={setFocusedMap} />
            </CardHeader>
            <CardBody className="h-[300px]">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: focusedMap ? 220 : 140 }}
                className="w-full h-full"
              >
                <ZoomableGroup
                  center={focusedMap ? [100, 20] : [0, 0]}
                  zoom={focusedMap ? 1.7 : 1}
                >
                  {geoJson && (
                    <Geographies geography={geoJson}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const iso = geo.properties.ISO_A2 || geo.id;
                          const shouldRender =
                            !focusedMap ||
                            ["US", "CA", "IN", "ID", "SG"].includes(iso);
                          return shouldRender ? (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#f1f5f9"
                              stroke="#cbd5e1"
                            />
                          ) : null;
                        })
                      }
                    </Geographies>
                  )}
                  {geoData.map(({ name, coordinates, code }) => (
                    <Marker
                      key={code}
                      coordinates={coordinates as [number, number]}
                    >
                      <Tooltip content={name}>
                        <circle
                          r={10}
                          fill={
                            code === selectedCountry ? "#dc2626" : "#0ea5e9"
                          }
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
                </ZoomableGroup>
              </ComposableMap>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="col-span-1 lg:col-span-3 h-full">
          <CardHeader>Top Products</CardHeader>
          <CardBody>
            <ul className="space-y-2 max-h-[300px] overflow-y-auto">
              <li className="flex justify-between items-center border-b pb-1 cursor-pointer font-semibold">
                Product <span className="text-sm px-10">Qty</span>
              </li>
              {derivedProducts.map((product) => (
                <li
                  key={product.title}
                  className="flex justify-between items-center border-b pb-1 cursor-pointer hover:text-primary text-gray-500"
                  onClick={() => handleProductClick(product)}
                >
                  <span className="truncate max-w-[200px]">
                    {product.title}
                  </span>
                  <span className="text-sm px-10">
                    {product.salesCount} sold
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </motion.div>

      {/* Modal for Drilldown */}
      <Modal isOpen={modal.isOpen} onClose={modal.onClose} size="4xl">
        <ModalContent>
          <ModalHeader>{selectedProduct?.title} – Sales Trend</ModalHeader>
          <ModalBody>
            {selectedProduct && (
              <Line
                data={productSalesTrend(selectedProduct)}
                options={{ responsive: true }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
