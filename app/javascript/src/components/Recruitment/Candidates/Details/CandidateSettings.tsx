/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";

import candidateAllowedUsersApi from "apis/candidate-allowed-users";
import candidateItemsApi from "apis/candidate-items";
import candidates from "apis/candidates";

import { unmapCandidateList } from "../../../../mapper/candidate.mapper";
import { X } from "phosphor-react";

const getInitialvalues = (candidateI) => ({
  assignee_id: candidateI.assignee_id,
  reporter_id: candidateI.reporter_id,
  status_code: candidateI.status_code,
});

const CandidateSettings = ({ candidateDetails, setCandidateDetails, setShowCandidateSetting }) => {
  const [statusCodeList, setStatusCodeList] = useState<any>(null);
  const [allowUserList, setAllowUserLIst] = useState<any>(null);

  useEffect(() => {
    const getAllowedUsers = async () => {
      candidateAllowedUsersApi.get()
        .then((data) => {
          setAllowUserLIst(data.data.allowed_user_list);
        }).catch(() => {
          setAllowUserLIst({});
        });
      candidateItemsApi.get()
        .then((data) => {
          setStatusCodeList(data.data.status_codes);
        }).catch(() => {
          setStatusCodeList({});
        });
    };

    getAllowedUsers();
    setCandidateDetails(candidateDetails);
  }, []);

  const handleSubmit = async (values: any) => {
    await candidates.update(candidateDetails.id, {
      candidate: {
        "assignee_id": parseInt(values.assignee_id),
        "reporter_id": parseInt(values.reporter_id),
        "status_code": parseInt(values.status_code)
      }
    }).then((res) => {
      setShowCandidateSetting(false);
      setCandidateDetails(unmapCandidateList(res).recruitmentCandidate);
    })
  };

  const changeAssignee = async (val: any) => {
    await candidates.update(candidateDetails.id, {
      candidate: {
        "assignee_id": parseInt(val)
      }
    }).then((res) => {
      setShowCandidateSetting(false);
      setCandidateDetails(unmapCandidateList(res).recruitmentCandidate);
    })
  };

  const changeReporter = async (val: any) => {
    await candidates.update(candidateDetails.id, {
      candidate: {
        "reporter_id": parseInt(val)
      }
    }).then((res) => {
      setShowCandidateSetting(false);
      setCandidateDetails(unmapCandidateList(res).recruitmentCandidate);
    })
  };

  const changeStatusCode = async (val: any) => {
    await candidates.update(candidateDetails.id, {
      candidate: {
        "status_code": parseInt(val)
      }
    }).then((res) => {
      setShowCandidateSetting(false);
      setCandidateDetails(unmapCandidateList(res).recruitmentCandidate);
    })
  };

  return (
    <>
<div className="sidebar__container flex flex-col p-6 justify-between overflow-auto">
      <div>

        <span className="mb-3 flex justify-between font-extrabold text-base text-miru-dark-purple-1000 leading-5">
          Candidate Settings
          <button onClick={() => {
            document.body.classList.remove('noscroll');
            setShowCandidateSetting(false)
          }}>
            <X size={15} color="#CDD6DF" />
          </button>
        </span>
        <Formik
          initialValues={getInitialvalues(candidateDetails)}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-6">
                <label className="block mb-2 text-sm text-gray-600">Assignee</label>
                <select
                  defaultValue={candidateDetails.assignee_id}
                  className="w-full px-3 py-2 bg-miru-gray-100 border border-gray-300 rounded-md  focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                  name="assignee_id" onChange={(e) => changeAssignee(e.target.value)}>
                  <option value=''>Select Assignee</option>
                  {allowUserList &&
  allowUserList.map(e => <option value={e.id} key={e.id} selected={e.id === candidateDetails.assignee_id}>{e.first_name}{' '}{e.last_name}</option>)}
                </select>
                <div className="tracking-wider block text-xs text-red-600">
                  {errors.assignee_id && touched.assignee_id &&
            <div>{`${errors.assignee_id}`}</div>
                  }
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm text-gray-600">Reporter</label>
                <select
                  defaultValue={candidateDetails.reporter_id}
                  className="w-full px-3 py-2 bg-miru-gray-100 border border-gray-300 rounded-md  focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                  name="reporter_id" onChange={(e) => changeReporter(e.target.value)}>
                  <option value=''>Select Reporter</option>
                  {allowUserList &&
  allowUserList.map(e => <option value={e.id} key={e.id} selected={e.id === candidateDetails.reporter_id}>{e.first_name}{' '}{e.last_name}</option>)}
                </select>
                <div className="tracking-wider block text-xs text-red-600">
                  {errors.reporter_id && touched.reporter_id &&
            <div>{`${errors.reporter_id}`}</div>
                  }
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm text-gray-600">Status</label>
                <select
                  defaultValue={candidateDetails.status_code}
                  className="w-full px-3 py-2 bg-miru-gray-100 border border-gray-300 rounded-md  focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                  name="status_code" onChange={(e) => changeStatusCode(e.target.value)}>
                  <option value=''>Select Status</option>
                  {statusCodeList &&
statusCodeList.map(e => <option value={e.id} key={e.id} selected={e.id === candidateDetails.status_code}>{e.name}</option>)}
                </select>
                <div className="flex justify-between items-center pt-1 text-red-700">
                  {errors.status_code && touched.status_code &&
              <p className="text-xs">{`${errors.status_code}`}</p>
                  }
                </div>
              </div>

                    </Form>
                  )}
                </Formik>
              </div>
            </div>
    </>
  );
};

export default CandidateSettings;
