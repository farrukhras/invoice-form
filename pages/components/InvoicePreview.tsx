import React from "react";
import { InvoiceData } from "../../interfaces/types";

interface InvoicePreviewProps {
  invoiceData: InvoiceData | undefined;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData }) => {
  // Provide default values if invoiceData is undefined or properties are missing
  const {
    billFrom = {
      companyName: "",
      companyEmail: "",
      country: "",
      city: "",
      postalCode: "",
      streetAddress: "",
    },
    billTo = {
      clientName: "",
      clientEmail: "",
      country: "",
      city: "",
      postalCode: "",
      streetAddress: "",
    },
    invoiceDate = "",
    paymentTerms = "",
    projectDescription = "",
    items = [],
  } = invoiceData || {};

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1;
    return subtotal + tax;
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(parsedDate);
  };
  

  const formatPaymentTerms = (terms: string) => {
    return terms.replace(/_/g, ' ');
  };

  const labelStyle = "text-base font-normal text-[#76787D] mb-3";
  const valueStyle = "text-[#101828] font-medium text-base mb-4";

  return (
    <>
      <div className="w-full bg-[#F5F5F5] p-4 md:p-6 rounded-3xl flex flex-col h-full">
        <div className="mb-8 flex flex-col h-full">
          <h3 className="text-2xl font-semibold mb-5">Preview</h3>
          <div className="w-full bg-white p-4 md:p-6 rounded-2xl shadow-xl">
            <div className="bg-white">
              <h3 className="text-lg font-semibold mb-3 text-[#101828]">
                New Invoice
              </h3>
              <hr />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-6">
                <div className="flex flex-col">
                  <label className={labelStyle}>Invoice Date</label>
                  <p className={valueStyle}>{formatDate(invoiceDate)}</p>
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Payment Terms</label>
                  <p className={valueStyle}>
                    {formatPaymentTerms(paymentTerms)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className={labelStyle}>Billed From</label>
                  <p className={`break-all ${valueStyle}`}>
                    {billFrom.companyName}
                  </p>
                  <p className={`break-all ${valueStyle}`}>
                    {billFrom.companyEmail}
                  </p>
                  <p className={valueStyle}>{billFrom.streetAddress}</p>
                  <p className={`break-all ${valueStyle}`}>
                    {billFrom.city}
                    {billFrom.city && billFrom.postalCode && ","}{" "}
                    {billFrom.postalCode}
                  </p>
                  <p className={`break-all ${valueStyle}`}>{billFrom.country}</p>
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Billed To</label>
                  <p className={`break-all ${valueStyle}`}>{billTo.clientName}</p>
                  <p className={`break-all ${valueStyle}`}>{billTo.clientEmail}</p>
                  <p className={valueStyle}>{billTo.streetAddress}</p>
                  <p className={`break-all ${valueStyle}`}>
                    {billTo.city}
                    {billTo.city && billTo.postalCode && ","}{" "}
                    {billTo.postalCode}
                  </p>
                  <p className={`break-all ${valueStyle}`}>{billTo.country}</p>
                </div>
              </div>
              <div className="">
                <div className="flex flex-col">
                  <label className={labelStyle}>Project Description</label>
                  <p className={valueStyle}>{projectDescription}</p>
                </div>
              </div>
              <div className="mb-4 mt-2">
                <div className="grid grid-cols-4 gap-4 bg-[#F5F5F5] p-2 rounded">
                  <span className="font-normal text-base text-left text-[#76787D]">
                    Item
                  </span>
                  <span className="font-normal text-base text-left text-[#76787D]">
                    Qty.
                  </span>
                  <span className="font-normal text-base text-left text-[#76787D]">
                    Price
                  </span>
                  <span className="font-normal text-base text-right text-[#76787D]">
                    Total Amount
                  </span>
                </div>
                {items.map((item, index) => {
                  const price = Number(item.price) || 0;
                  return (
                    <div key={index} className="grid grid-cols-4 gap-4 p-2">
                      {item.name && (
                        <>
                          <span className="text-left text-[#101828] font-medium text-base whitespace-normal break-words">
                            {item.name}
                          </span>
                          <span className="text-left text-[#101828] font-medium text-base">
                            {item.quantity}
                          </span>
                          <span className="text-left text-[#101828] font-medium text-base">
                            ${price.toFixed(2)}
                          </span>
                          <span className="text-right text-[#101828] font-medium text-base">
                            ${(item.quantity * price).toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <hr />

              <div className="mb-2 mt-6 text-[#101828] text-base font-semibold">
                <div className="flex md:justify-end">
                  <div className="md:text-right">
                    <div className="flex justify-between mb-4">
                      <span className="md:mr-32">Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="mr-8">Tax (10%):</span>
                      <span>${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl">
                      <span className="mr-8">Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePreview;
