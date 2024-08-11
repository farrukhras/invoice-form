# Invoice Form

## Overview

This project is a Next.js application for creating an invoice, mainly to create, and save invoices. It uses React with TypeScript for the frontend, along with Formik for form handling and validation. The application communicates with a GraphQL backend to save the invoice data.

The project also utilizes a REST API to fetch a list of countries for the billing information section of the form. API Link: [https://restcountries.com/v3.1/all](https://restcountries.com/v3.1/all).

The application is deployed and accessible on Vercel: [https://invoice-form-six.vercel.app/](https://invoice-form-six.vercel.app/).

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Creating an Invoice](#creating-an-invoice)
  - [Previewing an Invoice](#previewing-an-invoice)
  - [Saving an Invoice](#saving-an-invoice)

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **Formik**: Form library for React that simplifies form management and validation.
- **Yup**: Schema validation library used with Formik for form validation.
- **GraphQL**: Query language for APIs used to interact with the backend.
- **Tailwind CSS**: Utility-first CSS framework for styling the application.

## Project Structure
```
├── interfaces
│ └── types.ts
├── mutations
│ └── createInvoice.ts
├── pages
│ └── index.tsx
│ └── components
│  ├── InvoiceForm.tsx
│  ├── InvoicePreview.tsx
│  ├── Header.tsx
│  ├── ButtonLoader.tsx
│  ├── PaymentTermsDropdown
│  ├── SubmissionToast
├── utils
│ └── SuccessToast.ts
└── README.md
```


- **components**: Contains the main components used in the application.
- **interfaces**: Holds TypeScript interfaces for type definitions.
- **mutations**: Contains the GraphQL mutation function for creating invoices.
- **pages**: Contains the main page of the Next.js application.
- **util/**: Utility functions like toasters for user feedback.

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/farrukhras/invoice-form.git
   cd invoice-form
   ```

2. Install the dependencies:
   
   ```bash
   npm install
   ```

3. Start the development server:
   
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser to see the application.


## Usage
### Creating an Invoice
1. Navigate to the main page of the application.
2. Fill out the form with your billing details, client details, invoice items, and project description.
3. Use the "Add New Item" button to include multiple items in the invoice.
   
### Previewing an Invoice
1. As you fill out the form, the invoice preview on the right side of the page updates in real-time.
2. The preview shows the invoice date, payment terms, billing details, itemized list, and total amount including tax.

### Saving an Invoice
1. Once the form is complete, click the "Save" button.
2. The form data is validated using Formik and Yup before being sent to the GraphQL API.
3. A success message is displayed upon successfully saving the invoice.
