"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@heroui/react";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { formatPhoneNumber } from "@/utils/helper";

interface ExportButtonProps {
  sellerName: string;
  sellerId: string;
  businessName?: string;
  sellerFirstName?: string;
  sellerLastName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  data: any[]; // current page
  allData: any[]; // full data
  columns: string[];
}

const headerMap: Record<string, string> = {
  saleId: "Sale ID",
  productTitle: "Product Title",
  quantity: "Quantity",
  amount: "Amount",
  purchaseDate: "Purchase Date",
  status: "Status",
  orderDate: "Order Date",
  shippingMethod: "Shipping Method",
  paymentMethod: "Payment Method",
  total: "Total",
  isReturnable: "Returnable",
  buyerEmail: "Buyer Email",
  discount: "Discount",
  tax: "Tax",
  shippingCost: "Shipping Cost",
};

const formatValue = (key: string, value: any) => {
  if (key.toLowerCase().includes("date") && value) {
    return dayjs(value).format("MM/DD/YYYY hh:mm A");
  }
  return value ?? "";
};

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

export default function ExportButton({
  sellerName,
  sellerId,
  businessName,
  sellerFirstName,
  sellerLastName,
  sellerPhone,
  sellerEmail,
  data,
  allData,
  columns,
}: ExportButtonProps) {
  const trimmedId = sellerId.slice(sellerId.length / 2);
  const fileName = `${sellerName}_seller_${trimmedId}.csv`;
  const allColumnKeys = Object.keys(headerMap);

  const handleCSVExport = (exportData: any[], cols: string[]) => {
    const headers = cols.map((col) => headerMap[col] ?? col);
    const rows = [
      headers.join(","),
      ...exportData.map((row) =>
        cols.map((col) => JSON.stringify(formatValue(col, row[col]))).join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, fileName);
  };

  const handlePrint = (exportData: any[], cols: string[]) => {
    const printable = window.open("", "_blank", "fullscreen=yes");
    const headers = cols.map((col) => headerMap[col] ?? col);

    const rowsHtml = exportData
      .map((row) => {
        return `<tr>${cols
          .map((col) => {
            const val = formatValue(col, row[col]);
            if (col === "status") {
              const color =
                val.toLowerCase() === "delivered"
                  ? "#4CAF50"
                  : val.toLowerCase() === "pending"
                    ? "#FFC107"
                    : "#F44336";
              return `<td style="color: ${color}; font-weight: bold;">${val}</td>`;
            }
            return `<td>${val}</td>`;
          })
          .join("")}</tr>`;
      })
      .join("");

    const headerRow = headers
      .map((h) => `<th>${h.toUpperCase()}</th>`)
      .join("");

    const html = `
      <html>
        <head>
          <title>XYVO</title>
          <style>
            @page { margin: 50px 40px 70px 40px; }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #222;
            }
            .meta {
              display: flex;
              justify-content: space-between;
              margin-bottom: 16px;
              font-size: 14px;
            }
            .left-info {
              text-align: left;
            }
            .right-info {
              font-weight: bold;
              font-size: 18px;
              text-align: right;
              margin-left: auto;
            }
            .seller-info {
              margin-bottom: 12px;
              font-size: 14px;
              line-height: 1.6;
            }
            .seller-info div {
              display: block;
              margin: 4px 0;
            }
            .seller-info strong {
              font-weight: bold;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              table-layout: auto;
              page-break-inside: auto;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
              padding: 8px;
              text-align: left;
              border: 1px solid #ccc;
            }
            td {
              padding: 8px;
              border: 1px solid #ccc;
              word-break: break-word;
            }
            footer {
              position: fixed;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              font-size: 12px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="meta">
            <div class="right-info">${businessName}</div>
          </div>
          <div class="seller-info">
            <div><strong>Name:</strong> ${capitalize(sellerFirstName)} ${capitalize(sellerLastName)}</div>
            <div><strong>Phone:</strong> ${formatPhoneNumber(sellerPhone)}</div>
            <div><strong>Email:</strong> ${sellerEmail}</div>
          </div>
          <table>
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <footer>Source: https://www.xyvo.ca</footer>
          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printable?.document.write(html);
    printable?.document.close();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div>
          <Tooltip content="Download CSV/PDF">
            <Download
              size={26}
              className="cursor-pointer text-default-500 hover:text-primary"
              strokeWidth={1.75}
            />
          </Tooltip>
        </div>
      </DropdownTrigger>

      <DropdownMenu>
        <DropdownItem onPress={() => handleCSVExport(data, columns)} key="csv">
          📄 Export Current Page (CSV)
        </DropdownItem>
        <DropdownItem
          onPress={() => handleCSVExport(allData, columns)}
          key="csv-all"
        >
          📄 Export All Pages (CSV)
        </DropdownItem>
        <DropdownItem
          onPress={() => handleCSVExport(allData, allColumnKeys)}
          key="csv-all-full"
        >
          📄 Export All Pages & Columns (CSV)
        </DropdownItem>
        <DropdownItem onPress={() => handlePrint(data, columns)} key="pdf">
          🖨️ Print Current Page (PDF)
        </DropdownItem>
        <DropdownItem
          onPress={() => handlePrint(allData, columns)}
          key="pdf-all"
        >
          🖨️ Print All Pages (PDF)
        </DropdownItem>
        <DropdownItem
          onPress={() => handlePrint(allData, allColumnKeys)}
          key="pdf-all-full"
        >
          🖨️ Print All Pages & Columns (PDF)
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
