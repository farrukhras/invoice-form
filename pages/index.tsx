import React, {useState} from "react";
import InvoiceForm from "./components/InvoiceForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    billFrom: {
      companyName: "",
      companyEmail: "",
      country: "",
      city: "",
      postalCode: "",
      streetAddress: "",
    },
    billTo: {
      clientName: "",
      clientEmail: "",
      country: "",
      city: "",
      postalCode: "",
      streetAddress: "",
    },
    invoiceDate: new Date().toISOString().split("T")[0],
    paymentTerms: "NET_10_DAYS",
    projectDescription: "",
    items: [{ name: "", quantity: 1, price: 0 }],
  });

  return (
    <div className={`${inter.className}`}>
      <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
    </div>
  );
}
