import React, { useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
import Header from "./components/Header";
import { InvoiceData } from "../interfaces/types";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const initialFormData: InvoiceData = {
  billFrom: {
    companyName: "",
    companyEmail: "",
    billingFromAddress: {
      country: "",
      city: "",
      postalCode: "",
      streetAddress: "",
    },
  },
  billTo: {
    clientName: "",
    clientEmail: "",
    billingToAddress: {
      country: "",
      city: "",
      postalCode: "",
      streetAddress: "",
    },
  },
  invoiceDate: new Date().toISOString().split("T")[0],
  paymentTerms: "",
  projectDescription: "",
  items: [{ name: "", quantity: 1, price: 0 }],
};

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialFormData);

  return (
    <div className={`${inter.className}`}>
      <Header />
      <InvoiceForm
        invoiceData={invoiceData}
        setInvoiceData={setInvoiceData}
        initialFormData={initialFormData}
      />
    </div>
  );
}