import React from "react";

import { useNavigate } from "react-router-dom";

import candidates from "apis/candidates";
import ConfirmDialog from "common/Modal/ConfirmDialog";

interface IProps {
  candidate: any;
  setShowDeleteDialog: any;
  fetchCandidateList: any;
}

const DeleteCandidate = ({ candidate, setShowDeleteDialog, fetchCandidateList }: IProps) => {

  const navigate = useNavigate();

  const deleteCandidate = async (candidate: any) => {
    await candidates.destroy(candidate.id);
    setShowDeleteDialog(false);
    fetchCandidateList();
    navigate('/recruitment/candidates')
  };
  return (
    <ConfirmDialog
      title='Delete Candidate'
      open={true}
      onClose={() => setShowDeleteDialog(false) }
      onConfirm={ () => deleteCandidate(candidate) }
      yesButtonText="DELETE"
      noButtonText="CANCEL"
    >
      Are you sure you want to delete candidate <b className="font-bold">{candidate.name}</b>? This action cannot be reversed.
    </ConfirmDialog>
  );
};

export default DeleteCandidate;
