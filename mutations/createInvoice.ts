import { GraphQLClient, gql } from 'graphql-request';
import { InvoiceData } from '../interfaces/types';

// Initialize a GraphQL client with the API endpoint
const client = new GraphQLClient('https://sse-frontend-assessment-api-823449bb66ac.herokuapp.com/graphql');

// Define the GraphQL mutation for creating an invoice
const CREATE_INVOICE_MUTATION = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      billingFrom {
        companyName
      }
      billingTo {
        clientName
      }
      items {
        name
        quantity
        price
      }
      totalAmount
    }
  }
`;

// Define the structure of the response from the createInvoice mutation
interface CreateInvoiceResponse {
  createInvoice: {
    id: string;
    billingFrom: {
      companyName: string;
    };
    billingTo: {
      clientName: string;
    };
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    totalAmount: number;
  };
}

// Function to create an invoice using the GraphQL mutation
// Takes in invoice data of type InvoiceData and returns the created invoice's details
export async function createInvoice(invoiceData: InvoiceData): Promise<CreateInvoiceResponse['createInvoice']> {
  // Prepare the variables for the GraphQL mutation, mapping the InvoiceData structure to the GraphQL input format
  const variables = {
    input: {
      createInvoiceAttributes: {
        billingFromAddress: {
          streetAddress: invoiceData.billFrom.billingFromAddress.streetAddress,
          city: invoiceData.billFrom.billingFromAddress.city,
          country: invoiceData.billFrom.billingFromAddress.country,
          postalCode: invoiceData.billFrom.billingFromAddress.postalCode,
        },
        companyName: invoiceData.billFrom.companyName,
        companyEmail: invoiceData.billFrom.companyEmail,
        billingToAddress: {
          streetAddress: invoiceData.billTo.billingToAddress.streetAddress,
          city: invoiceData.billTo.billingToAddress.city,
          country: invoiceData.billTo.billingToAddress.country,
          postalCode: invoiceData.billTo.billingToAddress.postalCode,
        },
        clientName: invoiceData.billTo.clientName,
        clientEmail: invoiceData.billTo.clientEmail,
        invoiceDate: invoiceData.invoiceDate,
        paymentTerms: invoiceData.paymentTerms,
        projectDescription: invoiceData.projectDescription,
        items: invoiceData.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }
    }
  };

  try {
    // Execute the GraphQL mutation with the prepared variables
    const response = await client.request<CreateInvoiceResponse>(CREATE_INVOICE_MUTATION, variables);
    
    // Return the created invoice's details from the response
    return response.createInvoice;
  } catch (error) {
    // Log and throw an error if the mutation fails
    console.error('GraphQL Error:', error);
    throw new Error('Failed to create invoice.');
  }
}