export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  billFrom: {
    companyName: string;
    companyEmail: string;
    country: string;
    city: string;
    postalCode: string;
    streetAddress: string;
  };
  billTo: {
    clientName: string;
    clientEmail: string;
    country: string;
    city: string;
    postalCode: string;
    streetAddress: string;
  };
  invoiceDate: string;
  paymentTerms: string;
  projectDescription: string;
  items: InvoiceItem[];
}
