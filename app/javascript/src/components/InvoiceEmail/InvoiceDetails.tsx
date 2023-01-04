import React from "react";

import InvoiceInfo from "./InvoiceInfo";
import InvoiceTotalSummary from "./InvoiceTotalSummary";

import CompanyInfo from "../Invoices/common/CompanyInfo";
import ClientInfo from "../Invoices/Invoice/ClientInfo";
import InvoiceLineItems from "../Invoices/Invoice/InvoiceLineItems";

const InvoiceDetails = ({ invoice, company, lineItems, client, logo }) => (
  <>
    <CompanyInfo company={company} logo={logo} />
    <div className="flex h-36 justify-between border-b-2 border-miru-gray-400 px-10 py-5">
      <ClientInfo client={client} />
      <InvoiceInfo company={company} invoice={invoice} />
    </div>
    <InvoiceLineItems
      currency={company.base_currency}
      items={lineItems}
      showHeader={lineItems.length > 0}
    />
    <InvoiceTotalSummary
      company={company}
      invoice={invoice}
      lineItems={lineItems}
    />
  </>
);

export default InvoiceDetails;
