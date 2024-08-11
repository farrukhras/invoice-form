import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InvoiceData } from "../../interfaces/types";
import { Trash2, Plus } from "lucide-react";
import ButtonLoader from "./ButtonLoader";
import InvoicePreview from "./InvoicePreview";
import PaymentTermsDropdown from "./PaymentTermsDropdown";
import { successToaster } from "../../utils/SuccessToast";
import axios from "axios";
import { createInvoice } from "@/mutations/createInvoice";

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  initialFormData: InvoiceData;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  setInvoiceData,
  initialFormData,
}) => {
  const [isResetting, setIsResetting] = useState(false); // State for reset button loading
  const [isSaving, setIsSaving] = useState(false); // State for save button loading
  const [countries, setCountries] = useState<string[]>([]); // State to store the list of countries

  // Fetch the list of countries when the component mounts
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryNames = response.data.map(
          (country: any) => country.name.common
        );
        setCountries(countryNames.sort()); // Sort by name and set the countries
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Reset form to initial values
  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      formik.resetForm({ values: initialFormData });
      setInvoiceData(initialFormData);
    }, 1000);
  };

  // Validate and save the form data
  const handleSave = async () => {
    // Set touched fields to trigger validation messages
    formik.setTouched({
      billFrom: {
        companyName: true,
        companyEmail: true,
        billingFromAddress: {
          country: true,
          city: true,
          postalCode: true,
          streetAddress: true,
        },
      },
      billTo: {
        clientName: true,
        clientEmail: true,
        billingToAddress: {
          country: true,
          city: true,
          postalCode: true,
          streetAddress: true,
        },
      },
      invoiceDate: true,
      paymentTerms: true,
      projectDescription: true,
      items: formik.values.items.map(() => ({
        name: true,
        quantity: true,
        price: true,
      })),
    });

    // Validate the form
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      // Calculate subtotal, tax, and total
      const subtotal = calculateSubtotal();
      const tax = subtotal * 0.1; // Assuming 10% tax
      const total = subtotal + tax;

      const updatedInvoiceData = {
        ...formik.values,
        subtotal: subtotal,
        tax: tax,
        total: total,
      };

      setIsSaving(true);

      try {
        // const savedInvoice = await createInvoice(formik.values);
        // setIsSaving(false);
        // formik.resetForm({ values: initialFormData });
        // setInvoiceData(initialFormData);
        // successToaster(
        //   "Invoice created successfully!",
        //   "Your invoice has been created."
        // );
        // console.log("Saved Invoice:", savedInvoice);

        // Simulate save for demonstration purposes
        console.log(updatedInvoiceData);
        setTimeout(() => {
          setIsSaving(false);
          formik.resetForm({ values: initialFormData });
          setInvoiceData(initialFormData);
          successToaster(
            "Invoice created successfully!",
            "Your invoice has been created."
          );
        }, 1000);
      } catch (error) {
        console.error("Error creating invoice:", error);
        setIsSaving(false);
      }
    } else {
      console.log("Validation errors:", formik.errors);
    }
  };

  // Calculate the subtotal of all items
  const calculateSubtotal = () => {
    return formik.values.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  // Formik setup with initial values and validation schema
  const formik = useFormik<InvoiceData>({
    initialValues: invoiceData,
    validationSchema: Yup.object().shape({
      billFrom: Yup.object({
        companyName: Yup.string().required("Company name is required"),
        companyEmail: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        billingFromAddress: Yup.object({
          country: Yup.string().required("Country is required"),
          city: Yup.string().required("City is required"),
          postalCode: Yup.string().required("Postal code is required"),
          streetAddress: Yup.string().required("Street address is required"),
        }),
      }),
      billTo: Yup.object({
        clientName: Yup.string().required("Client name is required"),
        clientEmail: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        billingToAddress: Yup.object({
          country: Yup.string().required("Country is required"),
          city: Yup.string().required("City is required"),
          postalCode: Yup.string().required("Postal code is required"),
          streetAddress: Yup.string().required("Street address is required"),
        }),
      }),
      invoiceDate: Yup.string().required("Invoice date is required"),
      paymentTerms: Yup.string().required("Payment terms are required"),
      projectDescription: Yup.string().required(
        "Project description is required"
      ),
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
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setInvoiceData(values);
    },
  });

  const inputClassName =
    "form-input mt-1 block w-full border border-[#D0D5DD] rounded-lg py-2.5 px-3.5 text-base font-normal";

  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:px-12 px-6 py-6 h-full">
      <div className="flex flex-col mb-8 md:mb-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center text-center">
          <span className="text-3xl font-medium mb-4 md:mb-0">New Invoice</span>
          <div className="flex space-x-3 justify-center md:justify-start mb-4 md:mb-0">
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
        <span className="text-base font-light">
          Create new invoice for your customers
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* Invoice Form Section */}
        <div className="w-full bg-white p-6 rounded-3xl border border-[#D0D5DD] flex flex-col">
          <form onSubmit={formik.handleSubmit} className="flex flex-col h-full">
            {/* Bill From Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-3">Bill From</h3>
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
                    onBlur={formik.handleBlur}
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
                    onBlur={formik.handleBlur}
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
                <div>
                  <label
                    htmlFor="billFrom.billingFromAddress.country"
                    className="text-sm font-medium"
                  >
                    Country
                  </label>
                  <select
                    id="billFrom.billingFromAddress.country"
                    name="billFrom.billingFromAddress.country"
                    value={formik.values.billFrom.billingFromAddress.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                  {formik.touched.billFrom?.billingFromAddress?.country &&
                    formik.errors.billFrom?.billingFromAddress?.country && (
                      <p className="text-red-500">
                        {formik.errors.billFrom.billingFromAddress.country}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="billFrom.billingFromAddress.city"
                    className="text-sm font-medium"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="billFrom.billingFromAddress.city"
                    name="billFrom.billingFromAddress.city"
                    value={formik.values.billFrom.billingFromAddress.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClassName}
                  />
                  {formik.touched.billFrom?.billingFromAddress?.city &&
                    formik.errors.billFrom?.billingFromAddress?.city && (
                      <p className="text-red-500">
                        {formik.errors.billFrom.billingFromAddress.city}
                      </p>
                    )}
                </div>
                <div>
                  <label
                    htmlFor="billFrom.billingFromAddress.postalCode"
                    className="text-sm font-medium"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="billFrom.billingFromAddress.postalCode"
                    name="billFrom.billingFromAddress.postalCode"
                    value={formik.values.billFrom.billingFromAddress.postalCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClassName}
                  />
                  {formik.touched.billFrom?.billingFromAddress?.postalCode &&
                    formik.errors.billFrom?.billingFromAddress?.postalCode && (
                      <p className="text-red-500">
                        {formik.errors.billFrom.billingFromAddress.postalCode}
                      </p>
                    )}
                </div>
              </div>
              <div className="grid grid-cols-1">
                <div>
                  <label
                    htmlFor="billFrom.billingFromAddress.streetAddress"
                    className="text-sm font-medium"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="billFrom.billingFromAddress.streetAddress"
                    name="billFrom.billingFromAddress.streetAddress"
                    value={
                      formik.values.billFrom.billingFromAddress.streetAddress
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClassName}
                  />
                  {formik.touched.billFrom?.billingFromAddress?.streetAddress &&
                    formik.errors.billFrom?.billingFromAddress
                      ?.streetAddress && (
                      <p className="text-red-500">
                        {
                          formik.errors.billFrom.billingFromAddress
                            .streetAddress
                        }
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-3">Bill To</h3>
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
                    onBlur={formik.handleBlur}
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
                    onBlur={formik.handleBlur}
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
                <div>
                  <label
                    htmlFor="billTo.billingToAddress.country"
                    className="text-sm font-medium"
                  >
                    Country
                  </label>
                  <select
                    id="billTo.billingToAddress.country"
                    name="billTo.billingToAddress.country"
                    value={formik.values.billTo.billingToAddress.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                  {formik.touched.billTo?.billingToAddress?.country &&
                    formik.errors.billTo?.billingToAddress?.country && (
                      <p className="text-red-500">
                        {formik.errors.billTo.billingToAddress.country}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="billTo.billingToAddress.city"
                    className="text-sm font-medium"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="billTo.billingToAddress.city"
                    name="billTo.billingToAddress.city"
                    value={formik.values.billTo.billingToAddress.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClassName}
                  />
                  {formik.touched.billTo?.billingToAddress?.city &&
                    formik.errors.billTo?.billingToAddress?.city && (
                      <p className="text-red-500">
                        {formik.errors.billTo.billingToAddress.city}
                      </p>
                    )}
                </div>
                <div>
                  <label
                    htmlFor="billTo.billingToAddress.postalCode"
                    className="text-sm font-medium"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="billTo.billingToAddress.postalCode"
                    name="billTo.billingToAddress.postalCode"
                    value={formik.values.billTo.billingToAddress.postalCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClassName}
                  />
                  {formik.touched.billTo?.billingToAddress?.postalCode &&
                    formik.errors.billTo?.billingToAddress?.postalCode && (
                      <p className="text-red-500">
                        {formik.errors.billTo.billingToAddress.postalCode}
                      </p>
                    )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="billTo.billingToAddress.streetAddress"
                    className="text-sm font-medium"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="billTo.billingToAddress.streetAddress"
                    name="billTo.billingToAddress.streetAddress"
                    value={formik.values.billTo.billingToAddress.streetAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClassName}
                  />
                  {formik.touched.billTo?.billingToAddress?.streetAddress &&
                    formik.errors.billTo?.billingToAddress?.streetAddress && (
                      <p className="text-red-500">
                        {formik.errors.billTo.billingToAddress.streetAddress}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Invoice Details Section */}
            <div className="mb-8">
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
                    onBlur={formik.handleBlur}
                    className={inputClassName}
                  />
                  {formik.touched.invoiceDate && formik.errors.invoiceDate && (
                    <p className="text-red-500">{formik.errors.invoiceDate}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="paymentTerms" className="text-sm font-medium">
                    Payment Terms
                  </label>
                  <PaymentTermsDropdown
                    options={[
                      { value: "NET_10_DAYS", label: "Net 10 Days" },
                      { value: "NET_20_DAYS", label: "Net 20 Days" },
                      { value: "NET_30_DAYS", label: "Net 30 Days" },
                    ]}
                    value={formik.values.paymentTerms}
                    onChange={(value) =>
                      formik.setFieldValue("paymentTerms", value)
                    }
                    placeholder="Select Term"
                  />
                  {formik.touched.paymentTerms &&
                    formik.errors.paymentTerms && (
                      <p className="text-red-500">
                        {formik.errors.paymentTerms}
                      </p>
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
                    onBlur={formik.handleBlur}
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

            {/* Items List Section */}
            <div>
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
                      onBlur={formik.handleBlur}
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
                      onBlur={formik.handleBlur}
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
                      onBlur={formik.handleBlur}
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
                      type="text"
                      value={(item.quantity * item.price).toFixed(2)}
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
                      <Trash2
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => {
                          const items = formik.values.items.filter(
                            (_, i) => i !== index
                          );
                          formik.setFieldValue("items", items);
                        }}
                      />
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

        {/* Invoice Preview Section */}
        <div className="w-full flex flex-col">
          <InvoicePreview invoiceData={formik.values} />
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
