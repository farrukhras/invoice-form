export interface Address {
  country: string;
  city: string;
  postalCode: string;
  streetAddress: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  billFrom: {
    companyName: string;
    companyEmail: string;
    billingFromAddress: Address;
  };
  billTo: {
    clientName: string;
    clientEmail: string;
    billingToAddress: Address;
  };
  invoiceDate: string;
  paymentTerms: string;
  projectDescription: string;
  items: InvoiceItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
}
