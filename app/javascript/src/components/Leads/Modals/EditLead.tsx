import React, { useEffect, useState } from "react";

import leadItemsApi from "apis/lead-items";
import leads from "apis/leads";
import { Formik, Form, Field } from "formik";
import { X } from "phosphor-react";
import * as Yup from "yup";

const newLeadSchema = Yup.object().shape({
  name: Yup.string().required("Name cannot be blank"),
  budget_amount: Yup.number().typeError("Invalid budget amount")
});

const getInitialvalues = (lead) => ({
  name: lead.name,
  budget_amount: lead.budget_amount,
  budget_status_code: lead.budget_status_code,
  industry_code: lead.industry_code,
  quality_code: lead.quality_code,
  state_code: lead.state_code,
  status_code: lead.status_code
});

export interface IEditLead {
  setShowEditDialog: any;
  lead: any;
}

const EditLead = ({ setShowEditDialog, lead }: IEditLead) => {

  const [apiError, setApiError] = useState<string>("");

  const [budgetStatusCodeList, setBudgetStatusCodeList] = useState<any>(null);
  const [industryCodeList, setIndustryCodeList] = useState<any>(null);
  const [qualityCodeList, setQualityCodeList] = useState<any>(null);
  const [stateCodeList, setStateCodeList] = useState<any>(null);
  const [statusCodeList, setStatusCodeList] = useState<any>(null);

  useEffect(() => {
    const getLeadItems = async () => {
      leadItemsApi.get()
        .then((data) => {
          setBudgetStatusCodeList(data.data.budget_status_codes);
          setIndustryCodeList(data.data.industry_codes);
          setQualityCodeList(data.data.quality_codes);
          setStateCodeList(data.data.state_codes);
          setStatusCodeList(data.data.status_codes);
        }).catch(() => {
          setBudgetStatusCodeList({});
          setIndustryCodeList({});
          setQualityCodeList({});
          setStateCodeList({});
          setStatusCodeList({});
        });
    };

    getLeadItems();
  }, []);

  const handleSubmit = async values => {
    await leads.update(lead.id, {
      lead: {
        ...values
      }
    }).then(() => {
      setShowEditDialog(false);
      document.location.reload();
    }).catch((e) => {
      setApiError(e.message);
    });
  };

  return (
    <div className="px-4 flex items-center justify-center">
      <div
        className="overflow-auto fixed top-0 left-0 right-0 bottom-0 inset-0 z-10 flex items-start justify-center"
        style={{
          backgroundColor: "rgba(29, 26, 49, 0.6)"
        }}
      >
        <div className="relative px-4 h-full w-full md:flex md:items-center md:justify-center">
          <div className="rounded-lg px-6 pb-6 bg-white shadow-xl transform transition-all sm:align-middle sm:max-w-md modal-width">
            <div className="flex justify-between items-center mt-6">
              <h6 className="text-base font-extrabold">Edit Lead</h6>
              <button type="button" onClick={() => { setShowEditDialog(false); }}>
                <X size={16} color="#CDD6DF" weight="bold" />
              </button>
            </div>
            <Formik
              initialValues={getInitialvalues(lead)}
              validationSchema={newLeadSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="form__label">Name</label>
                        <div className="tracking-wider block text-xs text-red-600">
                          {errors.name && touched.name &&
                          <div>{errors.name}</div>
                          }
                        </div>
                      </div>
                      <div className="mt-1">
                        <Field className={`form__input ${errors.name && touched.name && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="name" />
                      </div>
                    </div>
                  </div>
                  {/* <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="form__label">Email</label>
                        <div className="tracking-wider block text-xs text-red-600">
                          {errors.primary_email && touched.primary_email &&
                            <div>{errors.primary_email}</div>
                          }
                        </div>
                      </div>
                      <div className="mt-1">
                        <Field className={`form__input ${errors.primary_email && touched.primary_email && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="primary_email" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="form__label">Desciption</label>
                        <div className="tracking-wider block text-xs text-red-600">
                          {errors.description && touched.description &&
                            <div>{errors.description}</div>
                          }
                        </div>
                      </div>
                      <div className="mt-1">
                        <Field className={`form__input ${errors.description && touched.description && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="description" />
                      </div>
                    </div>
                  </div> */}
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="tracking-wider block text-xs font-normal text-miru-dark-purple-1000">
                          Budget Amount
                        </label>
                        <div className="tracking-wider block text-xs text-red-600">
                          {errors.budget_amount && touched.budget_amount &&
                            <div>{errors.budget_amount}</div>
                          }
                        </div>
                      </div>
                      <div className="mt-1">
                        <Field className={`form__input rounded tracking-wider border block w-full px-3 py-2 bg-miru-gray-100 shadow-sm text-xs text-miru-dark-purple-1000 focus:outline-none ${errors.budget_amount && touched.budget_amount && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="budget_amount" type="number" min="0" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="tracking-wider block text-xs font-normal text-miru-dark-purple-1000">
                          Budget Status
                        </label>
                      </div>
                      <div className="mt-1">
                        <select
                          defaultValue={lead.budget_status_code}
                          className="rounded border-0 block w-full px-2 py-1 bg-miru-gray-100 h-8 font-medium text-sm text-miru-dark-purple-1000 focus:outline-none sm:text-base"
                          name="budget_status_code">
                          <option value=''>Select Budget Status</option>
                          {budgetStatusCodeList &&
                            budgetStatusCodeList.map(e => <option value={e.id} key={e.id} selected={e.id === lead.budget_status_code}>{e.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="tracking-wider block text-xs font-normal text-miru-dark-purple-1000">
                          Industry
                        </label>
                      </div>
                      <div className="mt-1">
                        <select
                          defaultValue={lead.industry_code}
                          className="rounded border-0 block w-full px-2 py-1 bg-miru-gray-100 h-8 font-medium text-sm text-miru-dark-purple-1000 focus:outline-none sm:text-base"
                          name="industry_code">
                          <option value=''>Select Industry</option>
                          {industryCodeList &&
                            industryCodeList.map(e => <option value={e.id} key={e.id} selected={e.id === lead.industry_code}>{e.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="tracking-wider block text-xs font-normal text-miru-dark-purple-1000">
                          Quality
                        </label>
                      </div>
                      <div className="mt-1">
                        <select
                          defaultValue={lead.quality_code}
                          className="rounded border-0 block w-full px-2 py-1 bg-miru-gray-100 h-8 font-medium text-sm text-miru-dark-purple-1000 focus:outline-none sm:text-base"
                          name="quality_code">
                          <option value=''>Select Quality</option>
                          {qualityCodeList &&
                            qualityCodeList.map(e => <option value={e.id} key={e.id} selected={e.id === lead.quality_code}>{e.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="tracking-wider block text-xs font-normal text-miru-dark-purple-1000">
                          State
                        </label>
                      </div>
                      <div className="mt-1">
                        <select
                          defaultValue={lead.state_code}
                          className="rounded border-0 block w-full px-2 py-1 bg-miru-gray-100 h-8 font-medium text-sm text-miru-dark-purple-1000 focus:outline-none sm:text-base"
                          name="state_code">
                          <option value=''>Select State</option>
                          {stateCodeList &&
                            stateCodeList.map(e => <option value={e.id} key={e.id} selected={e.id === lead.state_code}>{e.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="tracking-wider block text-xs font-normal text-miru-dark-purple-1000">
                          Status
                        </label>
                      </div>
                      <div className="mt-1">
                        <select
                          defaultValue={lead.status_code}
                          className="rounded border-0 block w-full px-2 py-1 bg-miru-gray-100 h-8 font-medium text-sm text-miru-dark-purple-1000 focus:outline-none sm:text-base"
                          name="status_code">
                          <option value=''>Select Status</option>
                          {statusCodeList &&
                            statusCodeList.map(e => <option value={e.id} key={e.id} selected={e.id === lead.status_code}>{e.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <p className="tracking-wider mt-3 block text-xs text-red-600">{apiError}</p>
                  <div className="actions mt-4">
                    <input
                      type="submit"
                      name="commit"
                      value="SAVE CHANGES"
                      className="form__input_submit"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLead;
