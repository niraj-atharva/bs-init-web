import React from "react";

import invoicesApi from "apis/invoices";
import ConfirmDialog from "common/Modal/ConfirmDialog";

interface IProps {
  invoices_ids: any;
  setShowBulkDeleteDialog: any;
  fetchInvoices: any;
}

const BulkDeleteInvoices = ({
  invoices_ids,
  setShowBulkDeleteDialog,
  fetchInvoices,
}: IProps) => {
  const destroyInvoices = async invoices_ids => {
    await invoicesApi.destroyBulk({ invoices_ids });
    setShowBulkDeleteDialog(false);
    fetchInvoices();
  };

  return (
    <ConfirmDialog
      title='Delete Invoices'
      open={true}
      onClose={() => setShowBulkDeleteDialog(false) }
      onConfirm={ () => destroyInvoices(invoices_ids) }
      yesButtonText="DELETE"
      noButtonText="CANCEL"
    >
      Are you sure you want to delete these invoice?
      <b className="font-bold" /> This action cannot
      be reversed.
    </ConfirmDialog>
  );
};
export default BulkDeleteInvoices;
