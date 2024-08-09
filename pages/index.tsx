import React, { useState, useRef } from "react";
import InvoiceForm from "./components/InvoiceForm";
import Header from "./components/Header";
import { InvoiceData } from "./types";
import ButtonLoader from "./components/ButtonLoader";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const initialFormData: InvoiceData = {
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
  paymentTerms: "",
  projectDescription: "",
  items: [{ name: "", quantity: 1, price: 0 }],
};

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialFormData);
  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const submitFormRef = useRef<() => void>(() => {});

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setInvoiceData(initialFormData);
    }, 1000);
  };

  const handleSave = () => {
    setIsSaving(true);
    submitFormRef.current(); 
    setTimeout(() => {
      setIsSaving(false);
      console.log("Submitted values:", JSON.stringify(invoiceData, null, 2));
      setInvoiceData(initialFormData);
    }, 3000);
  };

  return (
    <div className={`${inter.className}`}>
      <Header />
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-8">
          <div className="flex flex-col mb-4 md:mb-0">
            <span className="text-3xl font-medium">New Invoice</span>
            <span className="text-base font-normal">
              Create new invoice for your customers
            </span>
          </div>
          <div className="flex space-x-3 justify-center md:justify-start">
            <button
              type="button"
              className="text-[#344054] font-medium text-base px-5 py-2.5 rounded-lg border border-[#D0D5DD]"
              onClick={handleReset}
            >
              {isResetting ? <ButtonLoader text={"Resetting"} /> : "Reset"}
            </button>
            <button
              type="button"
              className="bg-[#7F56D9] font-medium text-base text-white px-5 py-2.5 rounded-lg"
              onClick={handleSave}
            >
              {isSaving ? <ButtonLoader text={"Saving"} /> : "Save"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-screen items-center justify-between">
          <InvoiceForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            triggerSubmit={submitFormRef} // Pass ref to trigger submit
          />
          {/* <InvoicePreview invoiceData={invoiceData} /> */}
        </div>
      </div>
    </div>
  );
}
