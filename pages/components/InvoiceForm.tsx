import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InvoiceData } from "../types";
import { Trash2, Plus } from "lucide-react";
import axios from "axios";
interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  setInvoiceData,
}) => {
  const [countries, setCountries] = useState<string[]>([]);

  // Fetching countries from REST Countries API
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryNames = response.data.map(
          (country: any) => country.name.common
        );
        setCountries(countryNames.sort());
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const validationSchema = Yup.object().shape({
    billFrom: Yup.object({
      companyName: Yup.string().required("Company name is required"),
      companyEmail: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      country: Yup.string().required("Country is required"),
      city: Yup.string().required("City is required"),
      postalCode: Yup.string().required("Postal code is required"),
      streetAddress: Yup.string().required("Street address is required"),
    }),
    billTo: Yup.object({
      clientName: Yup.string().required("Client name is required"),
      clientEmail: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      country: Yup.string().required("Country is required"),
      city: Yup.string().required("City is required"),
      postalCode: Yup.string().required("Postal code is required"),
      streetAddress: Yup.string().required("Street address is required"),
    }),
    invoiceDate: Yup.string().required("Invoice date is required"),
    paymentTerms: Yup.string().required("Payment terms are required"),
    items: Yup.array().of(
      Yup.object({
        name: Yup.string().required("Item name is required"),
        quantity: Yup.number()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
        price: Yup.number()
          .min(0, "Price must be a positive number")
          .required("Price is required"),
      })
    ),
  });

  const formik = useFormik<InvoiceData>({
    initialValues: invoiceData,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Submitted values:", values);
      setInvoiceData(values);
    },
  });

  const inputClassName =
    "form-input mt-1 block w-full border border-[#D0D5DD] rounded-lg py-2.5 px-3.5 text-base font-normal";

  return (
    <div className="w-full bg-white p-6 rounded-3xl border border-[#D0D5DD]">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-9">
          <h3 className="text-2xl font-semibold mb-4">Bill From</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="billFrom.companyName"
                className="text-sm font-medium"
              >
                Company Name
              </label>
              <input
                type="text"
                id="billFrom.companyName"
                name="billFrom.companyName"
                value={formik.values.billFrom.companyName}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billFrom?.companyName &&
                formik.errors.billFrom?.companyName && (
                  <p className="text-red-500">
                    {formik.errors.billFrom.companyName}
                  </p>
                )}
            </div>
            <div>
              <label
                htmlFor="billFrom.companyEmail"
                className="text-sm font-medium"
              >
                Company Email
              </label>
              <input
                type="email"
                id="billFrom.companyEmail"
                name="billFrom.companyEmail"
                value={formik.values.billFrom.companyEmail}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billFrom?.companyEmail &&
                formik.errors.billFrom?.companyEmail && (
                  <p className="text-red-500">
                    {formik.errors.billFrom.companyEmail}
                  </p>
                )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="mb-4">
              <label htmlFor="billFrom.country" className="text-sm font-medium">
                Country
              </label>
              <select
                id="billFrom.country"
                name="billFrom.country"
                value={formik.values.billFrom.country}
                onChange={formik.handleChange}
                className={inputClassName}
              >
                <option value="" disabled>
                  Select Country
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {formik.touched.billFrom?.country &&
                formik.errors.billFrom?.country && (
                  <p className="text-red-500">
                    {formik.errors.billFrom.country}
                  </p>
                )}
            </div>

            <div>
              <label htmlFor="billFrom.city" className="text-sm font-medium">
                City
              </label>
              <input
                type="text"
                id="billFrom.city"
                name="billFrom.city"
                value={formik.values.billFrom.city}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billFrom?.city &&
                formik.errors.billFrom?.city && (
                  <p className="text-red-500">{formik.errors.billFrom.city}</p>
                )}
            </div>
            <div>
              <label
                htmlFor="billFrom.postalCode"
                className="text-sm font-medium"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="billFrom.postalCode"
                name="billFrom.postalCode"
                value={formik.values.billFrom.postalCode}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billFrom?.postalCode &&
                formik.errors.billFrom?.postalCode && (
                  <p className="text-red-500">
                    {formik.errors.billFrom.postalCode}
                  </p>
                )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="billFrom.streetAddress"
                className="text-sm font-medium"
              >
                Street Address
              </label>
              <input
                type="text"
                id="billFrom.streetAddress"
                name="billFrom.streetAddress"
                value={formik.values.billFrom.streetAddress}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billFrom?.streetAddress &&
                formik.errors.billFrom?.streetAddress && (
                  <p className="text-red-500">
                    {formik.errors.billFrom.streetAddress}
                  </p>
                )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Bill To</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="billTo.clientName"
                className="text-sm font-medium"
              >
                Client&apos;s Name
              </label>
              <input
                type="text"
                id="billTo.clientName"
                name="billTo.clientName"
                value={formik.values.billTo.clientName}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billTo?.clientName &&
                formik.errors.billTo?.clientName && (
                  <p className="text-red-500">
                    {formik.errors.billTo.clientName}
                  </p>
                )}
            </div>
            <div>
              <label
                htmlFor="billTo.clientEmail"
                className="text-sm font-medium"
              >
                Client&apos;s Email
              </label>
              <input
                type="email"
                id="billTo.clientEmail"
                name="billTo.clientEmail"
                value={formik.values.billTo.clientEmail}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billTo?.clientEmail &&
                formik.errors.billTo?.clientEmail && (
                  <p className="text-red-500">
                    {formik.errors.billTo.clientEmail}
                  </p>
                )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="mb-4">
              <label htmlFor="billTo.country" className="text-sm font-medium">
                Country
              </label>
              <select
                id="billTo.country"
                name="billTo.country"
                value={formik.values.billTo.country}
                onChange={formik.handleChange}
                className={inputClassName}
              >
                <option value="" disabled>
                  Select Country
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {formik.touched.billTo?.country &&
                formik.errors.billTo?.country && (
                  <p className="text-red-500">{formik.errors.billTo.country}</p>
                )}
            </div>

            <div>
              <label htmlFor="billTo.city" className="text-sm font-medium">
                City
              </label>
              <input
                type="text"
                id="billTo.city"
                name="billTo.city"
                value={formik.values.billTo.city}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billTo?.city && formik.errors.billTo?.city && (
                <p className="text-red-500">{formik.errors.billTo.city}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="billTo.postalCode"
                className="text-sm font-medium"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="billTo.postalCode"
                name="billTo.postalCode"
                value={formik.values.billTo.postalCode}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billTo?.postalCode &&
                formik.errors.billTo?.postalCode && (
                  <p className="text-red-500">
                    {formik.errors.billTo.postalCode}
                  </p>
                )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="billTo.streetAddress"
                className="text-sm font-medium"
              >
                Street Address
              </label>
              <input
                type="text"
                id="billTo.streetAddress"
                name="billTo.streetAddress"
                value={formik.values.billTo.streetAddress}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.billTo?.streetAddress &&
                formik.errors.billTo?.streetAddress && (
                  <p className="text-red-500">
                    {formik.errors.billTo.streetAddress}
                  </p>
                )}
            </div>
          </div>
        </div>

        <div className="mb-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="invoiceDate" className="text-sm font-medium">
                Invoice Date
              </label>
              <input
                type="date"
                id="invoiceDate"
                name="invoiceDate"
                value={formik.values.invoiceDate}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.invoiceDate && formik.errors.invoiceDate && (
                <p className="text-red-500">{formik.errors.invoiceDate}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="paymentTerms" className="text-sm font-medium">
                Payment Terms
              </label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                value={formik.values.paymentTerms}
                onChange={formik.handleChange}
                className={inputClassName}
              >
                <option value="" disabled>
                  Select Term
                </option>
                <option value="NET_10_DAYS">Net 10 Days</option>
                <option value="NET_20_DAYS">Net 20 Days</option>
                <option value="NET_30_DAYS">Net 30 Days</option>
              </select>
              {formik.touched.paymentTerms && formik.errors.paymentTerms && (
                <p className="text-red-500">{formik.errors.paymentTerms}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="projectDescription"
                className="text-sm font-medium"
              >
                Project Description
              </label>
              <input
                type="text"
                id="projectDescription"
                name="projectDescription"
                value={formik.values.projectDescription}
                onChange={formik.handleChange}
                className={inputClassName}
              />
              {formik.touched.projectDescription &&
                formik.errors.projectDescription && (
                  <p className="text-red-500">
                    {formik.errors.projectDescription}
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="">
          <h3 className="text-2xl font-semibold mb-4">Items List</h3>
          {formik.values.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-10 gap-2 mb-4"
            >
              <div className="col-span-3">
                <label
                  htmlFor={`items[${index}].name`}
                  className="text-sm font-medium"
                >
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="Item Name"
                  name={`items[${index}].name`}
                  value={formik.values.items[index].name}
                  onChange={formik.handleChange}
                  className={inputClassName}
                />
                {formik.touched.items?.[index]?.name &&
                  typeof formik.errors.items?.[index] !== "string" &&
                  formik.errors.items?.[index]?.name && (
                    <p className="text-red-500">
                      {formik.errors.items[index].name}
                    </p>
                  )}
              </div>

              <div className="col-span-2">
                <label
                  htmlFor={`items[${index}].quantity`}
                  className="text-sm font-medium"
                >
                  Qty.
                </label>
                <input
                  type="number"
                  placeholder="Qty"
                  name={`items[${index}].quantity`}
                  value={formik.values.items[index].quantity}
                  onChange={formik.handleChange}
                  className={inputClassName}
                />
                {formik.touched.items?.[index]?.quantity &&
                  typeof formik.errors.items?.[index] !== "string" &&
                  formik.errors.items?.[index]?.quantity && (
                    <p className="text-red-500">
                      {formik.errors.items[index].quantity}
                    </p>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor={`items[${index}].price`}
                  className="text-sm font-medium"
                >
                  Price
                </label>
                <input
                  type="number"
                  placeholder="Price"
                  name={`items[${index}].price`}
                  value={formik.values.items[index].price}
                  onChange={formik.handleChange}
                  className={inputClassName}
                />
                  {formik.touched.items?.[index]?.price &&
                  typeof formik.errors.items?.[index] !== "string" &&
                  formik.errors.items?.[index]?.price && (
                    <p className="text-red-500">
                      {formik.errors.items[index].price}
                    </p>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor={`items[${index}].price`}
                  className="text-sm font-medium"
                >
                  Total
                </label>
                <input
                  type="number"
                  placeholder="Price"
                  name={`items[${index}].price`}
                  value={formik.values.items[index].price}
                  onChange={formik.handleChange}
                  className={inputClassName}
                  disabled
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor={`items[${index}].price`}
                  className="text-sm font-medium opacity-0 h-0 overflow-hidden"
                >
                  Total
                </label>
                <div className="mt-1 block w-full py-2.5 flex justify-center">
                  <Trash2 className="w-6 h-6 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              formik.setFieldValue("items", [
                ...formik.values.items,
                { name: "", quantity: 1, price: 0 },
              ])
            }
            className="flex flex-row items-center justify-center bg-[#7F56D9] text-white font-medium text-base px-5 py-2.5 rounded-lg w-full space-x-1"
          >
            <Plus className="w-5 h-5 cursor-pointer" />
            <span>Add New Item</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
