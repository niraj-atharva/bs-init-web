import React from "react";

import { Formik, Form, Field, FormikProps } from "formik";
import * as Yup from "yup";

import clientApi from "apis/clients";
import Dialog from "common/Modal/Dialog";
import Toastr from "common/Toastr";

const newClientSchema = Yup.object().shape({
  name: Yup.string().required("Name cannot be blank"),
  email: Yup.string()
    .email("Invalid email ID")
    .required("Email ID cannot be blank"),
  phone: Yup.number().typeError("Invalid phone number"),
  address: Yup.string().required("Address cannot be blank"),
});

const initialValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

interface FormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EditClient = ({ setnewClient, clientData, setClientData }) => {
  const handleSubmit = async values => {
    const res = await clientApi.create(values);
    setClientData([...clientData, { ...res.data, minutes: 0 }]);
    setnewClient(false);
    Toastr.success("Client added successfully");
  };

  return (
    <Dialog title="Add New Client" open={true} onClose={() => { setnewClient(false); }}>
      <Formik
        initialValues={initialValues}
        validationSchema={newClientSchema}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<FormValues>) => {
          const { touched, errors } = props;

          return (
            <Form>
              <div className="mt-4">
                <div className="field">
                  <div className="field_with_errors">
                    <label className="form__label">Name</label>
                    <div className="block text-xs tracking-wider text-red-600">
                      {errors.name && touched.name && (
                        <div>{errors.name}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    <Field
                      name="name"
                      className={`form__input ${
                        errors.name &&
                        touched.name &&
                        "border-red-600 focus:border-red-600 focus:ring-red-600"
                      } `}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="field">
                  <div className="field_with_errors">
                    <label className="form__label">Email</label>
                    <div className="block text-xs tracking-wider text-red-600">
                      {errors.email && touched.email && (
                        <div>{errors.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    <Field
                      name="email"
                      className={`form__input ${
                        errors.email &&
                        touched.email &&
                        "border-red-600 focus:border-red-600 focus:ring-red-600"
                      } `}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="field">
                  <div className="field_with_errors">
                    <label className="form__label">Phone number</label>
                    <div className="block text-xs tracking-wider text-red-600">
                      {errors.phone && touched.phone && (
                        <div>{errors.phone}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    <Field
                      name="phone"
                      className={`form__input ${
                        errors.phone &&
                        touched.phone &&
                        "border-red-600 focus:border-red-600 focus:ring-red-600"
                      } `}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="field">
                  <div className="field_with_errors">
                    <label className="form__label">Address</label>
                    <div className="block text-xs tracking-wider text-red-600">
                      {errors.address && touched.address && (
                        <div>{errors.address}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    <Field
                      as="textarea"
                      name="address"
                      className={`form__input h-12 p-2 ${
                        errors.address &&
                        touched.address &&
                        "border-red-600 focus:border-red-600 focus:ring-red-600"
                      } `}
                    />
                  </div>
                </div>
              </div>
              <div className="actions mt-4">
                <input
                  className="form__input_submit"
                  name="commit"
                  type="submit"
                  value="SAVE CHANGES"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default EditClient;
