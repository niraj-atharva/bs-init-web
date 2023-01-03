import React, { useCallback, useEffect, useState } from "react";

import { CountryList } from "constants/countryList";
import { currencyList } from "constants/currencyList";

import { Formik, Form, Field, FieldArray } from "formik";
import { Multiselect } from 'multiselect-react-dropdown';
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';
import * as Yup from "yup";

import leadItemsApi from "apis/lead-items";
import leads from "apis/leads";
import Toastr from "common/Toastr";

import { unmapLeadDetails } from "../../../mapper/lead.mapper";

const newLeadSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name cannot be blank"),
  last_name: Yup.string().required("Last Name cannot be blank"),
  budget_amount: Yup.number().nullable().typeError("Invalid budget amount"),
  email: Yup.string().nullable().email("Invalid email ID"),
  mobilephone: Yup.number().nullable().typeError("Invalid mobilephone"),
  telephone: Yup.number().nullable().typeError("Invalid telephone"),
  emails: Yup.array().min(0).of(Yup.string().nullable().email("Invalid email ID"))
});

const getInitialvalues = (lead) => ({
  name: lead.name,
  description: lead.description,
  budget_amount: lead.budget_amount,
  industry_code_id: lead.industry_code_id,
  donotemail: lead.donotemail,
  donotbulkemail: lead.donotbulkemail,
  donotfax: lead.donotfax,
  donotphone: lead.donotphone,
  preferred_contact_method_code: lead.preferred_contact_method_code,
  priority_code: lead.priority_code,
  first_name: lead.first_name,
  last_name: lead.last_name,
  job_position: lead.job_position,
  source_code: lead.source_code,
  tech_stack_ids: lead.tech_stack_ids || [],
  emails: lead.emails || [],
  websites: lead.websites || [],
  preferred_contact_method_code_name: lead.preferred_contact_method_code_name,
  source_code_name: lead.source_code_name,
  base_currency: lead.base_currency,
  title: lead.title,
  email: lead.email,
  mobilephone: lead.mobilephone,
  telephone: lead.telephone,
  address: lead.address,
  country: lead.country,
  skypeid: lead.skypeid,
  linkedinid: lead.linkedinid
});

const Summary = ({
  leadDetails,
  setLeadDetails,
  isEdit,
  setFormRef }) => {

  const [apiError, setApiError] = useState<string>("");
  const [showButton, setShowButton] = useState(false);
  const [industryCodeList, setIndustryCodeList] = useState<any>([]);
  const [currenciesOption, setCurrenciesOption] = useState([]);
  const [preferredContactMethodCodeList, setPreferredContactMethodCodeList] = useState<any>(null);
  const [sourceCodeList, setSourceCodeList] = useState<any>(null);
  const [countriesOption, setCountriesOption] = useState<any>(null);
  const [techStackList, setTechStackList] = useState<any>(null);
  const [selectedTechStacks, setSelectedTechStacks] = useState<any>(null);

  const [techStacks, setTechStacks] = useState<any>([]);

  const navigate = useNavigate();

  const formattedCurrency = (currency: Record<string, string>) => currency && `${currency.name} (${currency.symbol})`;
  const formattedCountry = (country: Record<string, string>) => country && country.name;

  const getCurrencies = async () => {
    const topCurrencies = currencyList.filter((item) => ['INR', 'USD', 'GBP'].includes(item.code));
    const currencies = [
      topCurrencies.map((item) => ({
        value: item.code,
        label: formattedCurrency(item)
      })),
      { value: '-', label: '---', isDisabled: true },
      currencyList.filter(val => !topCurrencies.includes(val)).map((item) => ({
        value: item.code,
        label: formattedCurrency(item)
      }))].flat();
    setCurrenciesOption(currencies);
  };

  const getCountries = async () => {
    const topCountries = CountryList.filter((item) => ['US', 'CA', 'IN'].includes(item.code));
    const countries = [
      topCountries.map((item) => ({
        value: item.code,
        label: formattedCountry(item)
      })),
      { value: '-', label: '---', isDisabled: true },
      CountryList.filter(val => !topCountries.includes(val)).map((item) => ({
        value: item.code,
        label: formattedCountry(item)
      }))].flat();
    setCountriesOption(countries);
  };

  const setIndustries = useCallback(async (data) => {
    const industries = data.map((item) => ({
      value: item.id,
      label: item.name
    }));
    setIndustryCodeList(industries);
  }, []);

  const setPreferredContactMethodCodes = async (data) => {
    const preferredContactMethodCodes = data.map((item) => ({
      value: item.id,
      label: item.name
    }));
    setPreferredContactMethodCodeList(preferredContactMethodCodes);
  };

  const setSourceCodes = async (data) => {
    const sourceCodes = data.map((item) => ({
      value: item.id,
      label: item.name
    }));
    setSourceCodeList(sourceCodes);
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const getLeadItems = async () => {
      leadItemsApi.get()
        .then((data) => {
          setIndustries(data.data.industry_codes);
          setPreferredContactMethodCodes(data.data.preferred_contact_method_code_names);
          setSourceCodes(data.data.source_codes);
          setTechStackList(data.data.tech_stacks);
        }).catch(() => {
          setIndustries({});
          setPreferredContactMethodCodes({});
          setSourceCodes({});
          setTechStackList({});
        });
    };
    getCurrencies();
    getCountries();
    getLeadItems();
  }, [leadDetails.id]);

  useEffect(() => {
    if (techStackList && leadDetails && leadDetails.tech_stack_ids && leadDetails.tech_stack_ids.length > 0) {
      const sanitizedSelectedStackList = techStackList.filter(option =>
        leadDetails.tech_stack_ids.map(Number).includes(parseInt(option.id))
      );
      setSelectedTechStacks([...sanitizedSelectedStackList]);

      const stackArray = []
      sanitizedSelectedStackList.filter(option =>
        stackArray.push(parseInt(option.id))
      );
      setTechStacks(stackArray);
    }
  }, [techStackList]);

  const addRemoveStack = (selectedList) => {
    const newStackArray = []
    selectedList.filter(option =>
      newStackArray.push(parseInt(option.id))
    );
    setTechStacks(newStackArray);
  };

  const handleCurrencyChange = useCallback((option) => {
    setLeadDetails({ ...leadDetails, base_currency: option.value });
  }, [leadDetails]);

  const handleIndustryChange = useCallback((option) => {
    setLeadDetails({ ...leadDetails, industry_code_id: option.value });
  }, [leadDetails]);

  const handleCreate = useCallback((inputValue: string) => {
    const newOption = { value: inputValue, label: inputValue };
    industryCodeList.push(newOption)
    setIndustryCodeList(industryCodeList);
    setLeadDetails({ ...leadDetails, industry_code_id: newOption.value });
  }, [industryCodeList]);

  const handlePreferredContactMethodCodeChange = useCallback((option) => {
    setLeadDetails({ ...leadDetails, preferred_contact_method_code: option.value });
  }, [leadDetails]);

  const handleSourceCodeChange = useCallback((option) => {
    setLeadDetails({ ...leadDetails, source_code: option.value });
  }, [leadDetails]);

  const handleCountryChange = useCallback((option) => {
    setLeadDetails({ ...leadDetails, country: option.value });
  }, [leadDetails]);

  const handleSubmit = async (values) => {
    const fields = {
      "title": values.title,
      "first_name": values.first_name,
      "last_name": values.last_name,
      "job_position": values.job_position,
      "email": values.email,
      "budget_amount": values.budget_amount,
      "description": values.description,
      "industry_code_id": values.industry_code_id,
      "donotemail": values.donotemail,
      "donotbulkemail": values.donotbulkemail,
      "donotfax": values.donotfax,
      "donotphone": values.donotphone,
      "preferred_contact_method_code": values.preferred_contact_method_code,
      "source_code": values.source_code,
      "address": values.address,
      "country": values.country,
      "skypeid": values.skypeid,
      "linkedinid": values.linkedinid,
      "emails": values.emails || [],
      "websites": values.websites || [],
      "mobilephone": values.mobilephone,
      "base_currency": values.base_currency,
      "telephone": values.telephone,
      "tech_stack_ids": techStacks ? techStacks.map(Number) : []
    }
    if (leadDetails.id) {
      await leads.update(leadDetails.id, { lead: fields }).then((res) => {
        setLeadDetails(unmapLeadDetails(res).leadDetails);
      }).catch((e) => {
        setApiError(e.message);
      });
    } else {
      Object.assign(fields, { "quality_code": 0, "status_code": 0 })
      await leads.create(fields).then(res => {
        navigate(`/leads/${res.data.id}`);
        Toastr.success("Lead added successfully");
      });
    }
  };

  return (
    <React.Fragment>

      <Formik
        initialValues={getInitialvalues(leadDetails)}
        validationSchema={newLeadSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values }) => (
          <Form ref={ref => setFormRef(ref)}>
            <div className="bg-white dark:bg-gray-800">
              <p className="tracking-wider mt-3 block text-xs text-red-600">{apiError}</p>
              <div className="container mx-auto bg-white dark:bg-gray-800 rounded">
                <div className="mx-auto">
                  <div className="grid grid-cols-2">
                    <div className="mx-auto xl:mx-0">
                      <div className="mt-8 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Project Name</label>
                          {isEdit ? <> <Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="title" placeholder="Title" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.title && touched.title &&
                                <p className="text-xs">{`${errors.title}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.title}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">First Name</label>
                          {isEdit ? <><Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="first_name" placeholder="First Name" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.first_name && touched.first_name &&
                                <p className="text-xs">{`${errors.first_name}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.first_name}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Last Name</label>
                          {isEdit ? <><Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="last_name" placeholder="Last Name" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.last_name && touched.last_name &&
                                <p className="text-xs">{`${errors.last_name}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.last_name}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Job Position</label>
                          {isEdit ? <><Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="job_position" placeholder="Job Position" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.job_position && touched.job_position &&
                                <p className="text-xs">{`${errors.job_position}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.job_position}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Currency</label>
                          {isEdit ?
                            <Select
                              name="base_currency"
                              classNamePrefix="react-select-filter"
                              options={currenciesOption}
                              onChange={handleCurrencyChange}
                              value={leadDetails.base_currency && currenciesOption.find(e => e.value === leadDetails.base_currency) || { label: "US Dollar ($)", value: "USD" }}
                            /> : <div className="col-span-2">
                              {formattedCurrency(currencyList.find((currency) => currency.code === leadDetails.base_currency))}
                            </div>
                          }</div>
                      </div>
                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Approx Budget</label>
                          {isEdit ? <>
                            <Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                              name="budget_amount" type="number" min="0" placeholder="Budget Amount" disabled={!isEdit} />
                            <div className="flex justify-between items-center pt-1 text-red-700">
                              {errors.budget_amount && touched.budget_amount &&
                                <p className="text-xs">{`${errors.budget_amount}`}</p>
                              }
                            </div>
                          </> : <div className="col-span-2">{leadDetails.budget_amount}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Industry</label>
                          {isEdit ? <>
                            <CreatableSelect
                              className=""
                              name="industry_code_id"
                              classNamePrefix="react-select-filter"
                              onCreateOption={handleCreate}
                              options={industryCodeList}
                              onChange={handleIndustryChange}
                              value={leadDetails.industry_code_id && industryCodeList.find(e => e.value === leadDetails.industry_code_id)}
                            />
                            <div className="flex justify-between items-center pt-1 text-red-700">
                              {errors.industry_code_id && touched.industry_code_id &&
                                <p className="text-xs">{`${errors.industry_code_id}`}</p>
                              }
                            </div>
                          </> : <div className="col-span-2">{leadDetails.industry_code_name}</div>
                          }
                        </div>
                      </div>
                    </div>

                    <div className="mx-auto xl:mx-0">
                      <div className="xl:w-full border-b border-gray-300 dark:border-gray-700 py-5">
                        <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                          <p className="text-lg text-gray-800 dark:text-gray-100 font-bold">More Information</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Contact Method</label>
                          {isEdit ? <>
                            <Select
                              name="preferred_contact_method_code"
                              classNamePrefix="react-select-filter"
                              options={preferredContactMethodCodeList}
                              onChange={handlePreferredContactMethodCodeChange}
                              value={leadDetails.preferred_contact_method_code && preferredContactMethodCodeList.find(e => e.value === leadDetails.preferred_contact_method_code)}
                            />
                            <div className="flex justify-between items-center pt-1 text-red-700">
                              {errors.preferred_contact_method_code && touched.preferred_contact_method_code &&
                                <p className="text-xs">{`${errors.preferred_contact_method_code}`}</p>
                              }
                            </div>
                          </> : <div className="col-span-2">{leadDetails.preferred_contact_method_code_name}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Source</label>
                          {isEdit ? <>
                            <Select
                              name="source_code"
                              classNamePrefix="react-select-filter"
                              options={sourceCodeList}
                              onChange={handleSourceCodeChange}
                              value={leadDetails.source_code && sourceCodeList.find(e => e.value === leadDetails.source_code)}
                            />
                            <div className="flex justify-between items-center pt-1 text-red-700">
                              {errors.source_code && touched.source_code &&
                                <p className="text-xs">{`${errors.source_code}`}</p>
                              }
                            </div>
                          </> : <div className="col-span-2">{leadDetails.source_code_name}</div>
                          }</div>
                      </div>
                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Websites</label>
                          {isEdit ? <FieldArray name="websites">
                            {({ remove, push }) => (
                              <div>
                                {
                                  values.websites && values.websites.length > 0 &&
                                  values.websites.map((website, index) => (
                                    <div className="grid grid-flow-row-dense grid-cols-12 gap-2" key={index}>
                                      <div className="col-span-11">
                                        <Field
                                          className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                                          name={`websites.${index}`}
                                          placeholder="Website"
                                          disabled={!isEdit}
                                        />
                                        <div className="flex justify-between items-center pt-1 text-red-700">
                                          {errors.websites && touched.websites &&
                                            <p className="text-xs">{`${errors.websites}`}</p>
                                          }
                                        </div>
                                      </div>
                                      {isEdit &&
                                        <div>
                                          <svg onClick={() => remove(index)} className="mt-2 fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                                        </div>
                                      }
                                    </div>
                                  ))
                                }
                                <button
                                  type="button"
                                  className="mt-4 w-2/6 header__button text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                                  onClick={() => push('')}
                                  disabled={!isEdit}
                                >
                                  Add Website
                                </button>
                              </div>
                            )}
                          </FieldArray> : <>{leadDetails.websites?.join(", ")}</>
                          }</div>
                      </div>
                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Description</label>
                          {isEdit ? <><Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="description" as="textarea" rows={8} placeholder="Description" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.description && touched.description &&
                                <p className="text-xs">{`${errors.description}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.description}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Tech Stacks</label>
                          {isEdit ? <><Multiselect
                            closeOnSelect={true}
                            selectedValues={selectedTechStacks}
                            options={techStackList ? techStackList : [{}]}
                            name="tech_stack_ids"
                            onSelect={((selectedList) => addRemoveStack(selectedList))}
                            onRemove={((selectedList) => addRemoveStack(selectedList))}
                            displayValue="name"
                            disable={!isEdit} />
                          </> : <div className="col-span-2">{leadDetails.tech_stack_names?.join(", ")}</div>
                          }</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container mx-auto bg-white dark:bg-gray-800 mt-6 rounded">
                <div className="xl:w-full border-b border-gray-300 dark:border-gray-700 py-5">
                  <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                    <p className="text-lg text-gray-800 dark:text-gray-100 font-bold">Contact Information</p>
                  </div>
                </div>
                <div className="mx-auto">
                  <div className="grid grid-cols-2">
                    <div className="mx-auto xl:mx-0">
                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Country</label>
                          {isEdit ? <>
                            <Select
                              name="country"
                              classNamePrefix="react-select-filter"
                              options={countriesOption}
                              onChange={handleCountryChange}
                              value={leadDetails.country && countriesOption.find(e => e.value === leadDetails.country)}
                            />
                            <div className="flex justify-between items-center pt-1 text-red-700">
                              {errors.country && touched.country &&
                                <p className="text-xs">{`${errors.country}`}</p>
                              }
                            </div>
                          </> : <div className="col-span-2">
                            {formattedCountry(CountryList.find((country) => country.code === leadDetails.country))}
                          </div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Address</label>
                          {isEdit ? <>
                            <Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                              name="address" as="textarea" rows={8} placeholder="Address" disabled={!isEdit} />
                            <div className="flex justify-between items-center pt-1 text-red-700">
                              {errors.address && touched.address &&
                                <p className="text-xs">{`${errors.address}`}</p>
                              }
                            </div>
                          </> : <div className="col-span-2">{leadDetails.address}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Mobile Phone</label>
                          {isEdit ? <><Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="mobilephone" placeholder="Mobile Phone" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.mobilephone && touched.mobilephone &&
                                <p className="text-xs">{`${errors.mobilephone}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.mobilephone}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Telephone</label>
                          {isEdit ? <><Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="telephone" placeholder="Telephone" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.telephone && touched.telephone &&
                                <p className="text-xs">{`${errors.telephone}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.telephone}</div>
                          }</div>
                      </div>
                    </div>

                    <div className="mx-auto xl:mx-0">
                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Primary Email</label>
                          {isEdit ? <><Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="email" placeholder="Primary Email" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.email && touched.email &&
                                <p className="text-xs">{`${errors.email}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.email}</div>
                          }</div>
                      </div>
                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Other Emails</label>
                          {isEdit ? <FieldArray name="emails">
                            {({ remove, push }) => (
                              <div>
                                {
                                  values.emails && values.emails.length > 0 &&
                                  values.emails.map((email, index) => (
                                    <div className="grid grid-flow-row-dense grid-cols-12 gap-2" key={index}>
                                      <div className="col-span-11">
                                        <Field
                                          className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                                          name={`emails.${index}`}
                                          placeholder="Email"
                                          disabled={!isEdit}
                                        />
                                        <div className="flex justify-between items-center pt-1 text-red-700">
                                          {errors.emails && touched.emails &&
                                            <p className="text-xs">{`${errors.emails}`}</p>
                                          }
                                        </div>
                                      </div>
                                      {isEdit &&
                                        <div>
                                          <svg onClick={() => remove(index)} className="mt-2 fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                                        </div>
                                      }
                                    </div>
                                  ))
                                }
                                <button
                                  type="button"
                                  className="mt-4 w-2/6 header__button text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                                  onClick={() => push('')}
                                  disabled={!isEdit}
                                >
                                  Add Email
                                </button>
                              </div>
                            )}
                          </FieldArray> : <div className="col-span-2">{leadDetails.emails?.join(", ")}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Skype ID</label>
                          {isEdit ? <><Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="skypeid" placeholder="Skpe ID" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.skypeid && touched.skypeid &&
                                <p className="text-xs">{`${errors.skypeid}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.skypeid}</div>
                          }</div>
                      </div>

                      <div className="mt-4 flex flex-col lg:w-9/12 md:w-1/2 w-full">
                        <div className={isEdit ? null : "grid grid-cols-3"}>
                          <label className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Linkedin ID</label>
                          {isEdit ? <><Field className="w-full border border-gray-400 p-1 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                            name="linkedinid" placeholder="Linkedin ID" disabled={!isEdit} />
                          <div className="flex justify-between items-center pt-1 text-red-700">
                            {errors.linkedinid && touched.linkedinid &&
                                <p className="text-xs">{`${errors.linkedinid}`}</p>
                            }
                          </div></> : <div className="col-span-2">{leadDetails.linkedinid}</div>
                          }</div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container mx-auto mt-10 rounded bg-gray-100 dark:bg-gray-700 w-11/12 xl:w-full">
                <div className="xl:w-full py-5 px-8">
                  <div className="flex items-center mx-auto">
                    <div className="container mx-auto">
                      <div className="mx-auto xl:w-full">
                        <p className="text-lg text-gray-800 dark:text-gray-100 font-bold">Alerts</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">Get updates of any new activity or features. Turn on/off your preferences</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container mx-auto pb-6">
                  <div className="px-8">
                    <div className="flex justify-between items-center mb-8 mt-4">
                      <div className="w-9/12">
                        <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Do not email</p>
                      </div>
                      <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                        <Field id="cb1" type="checkbox" name="donotemail" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto switch-checkbox" disabled={!isEdit} />
                        <label htmlFor="cb1" className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-8 mt-4">
                      <div className="w-9/12">
                        <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Do not bulk email</p>
                      </div>
                      <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                        <Field id="cb2" type="checkbox" name="donotbulkemail" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto switch-checkbox" disabled={!isEdit} />
                        <label htmlFor="cb2" className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-8 mt-4">
                      <div className="w-9/12">
                        <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Do not fax</p>
                      </div>
                      <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                        <Field id="cb3" type="checkbox" name="donotfax" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto switch-checkbox" disabled={!isEdit} />
                        <label htmlFor="cb3" className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-8 mt-4">
                      <div className="w-9/12">
                        <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Do not Phone</p>
                      </div>
                      <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                        <Field id="cb4" type="checkbox" name="donotphone" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto switch-checkbox" disabled={!isEdit} />
                        <label htmlFor="cb4" className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showButton && (
                <button
                  type="button"
                  onClick={scrollToTop}
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block p-3 bg-miru-han-purple-1000 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-miru-han-purple-700 hover:shadow-lg focus:bg-miru-han-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5 fixed"
                  id="btn-back-to-top"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    className="w-4 h-4"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default Summary;
