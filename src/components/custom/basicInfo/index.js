import React from "react";
import { AdaptableCard } from "components/shared";
import { Input, FormItem, Switcher } from "components/ui";
import {
  HiOutlineHashtag,
  HiOutlineMenuAlt1,
  HiOutlineCloud,
  HiOutlineArrowUp,
  HiOutlineMap,
} from "react-icons/hi";
import { HiOutlineBuildingOffice2, HiOutlineMapPin } from "react-icons/hi2";
import { AiOutlineCode } from "react-icons/ai";
import { Field } from "formik";
import { makeSlug } from "utils/helpers";

const InfoFields = ({ touched, errors, values, setFieldValue, name }) => {
  return (
    <AdaptableCard divider>
      <h5>Basic Information</h5>
      <p class="mb-6">{`Section to config basic ${name}  information`}</p>
      <FormItem
        label={`${name} Code`}
        invalid={errors.code && touched.code}
        errorMessage={errors.code}
      >
        <Field
          type="text"
          autoComplete="off"
          name="code"
          placeholder="BANJARA2023"
          component={Input}
          prefix={<AiOutlineCode className="text-lg" />}
        />
      </FormItem>
      <FormItem
        label={`${name} Name`}
        invalid={errors.name && touched.name}
        errorMessage={errors.name}
      >
        <Field
          type="text"
          autoComplete="off"
          name="name"
          placeholder={`${name} Name`}
          component={Input}
          value={values?.name}
          onChange={(e) => {
            setFieldValue("name", e?.target?.value);
            setFieldValue("slug", makeSlug(e?.target?.value));
          }}
          prefix={<HiOutlineBuildingOffice2 className="text-lg" />}
        />
      </FormItem>
      <FormItem
        label="Slug"
        invalid={errors.slug && touched.slug}
        errorMessage={errors.slug}
      >
        <Field
          type="text"
          autoComplete="off"
          name="slug"
          placeholder="Enter slug"
          component={Input}
          prefix={<HiOutlineMenuAlt1 className="text-lg" />}
        />
      </FormItem>
      {name === "Property" ? (
        <div className="grid grid-cols-1">
          <FormItem label="Short Description">
            <Field
              component={Input}
              textArea
              type="text"
              autoComplete="off"
              name="shortDescription"
              placeholder="Short Description"
              value={values?.shortDescription}
              onChange={(e) =>
                setFieldValue("shortDescription", e?.target?.value)
              }
            />
          </FormItem>
          <FormItem label={`Distance (in kms)`}>
            <Field
              type="text"
              autoComplete="off"
              name="distance"
              placeholder="Enter distance"
              component={Input}
              prefix={<HiOutlineArrowUp className="text-lg" />}
            />
          </FormItem>
        </div>
      ) : (
        ""
      )}

      {name === "Property" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem label={`Weather (in celsius)`}>
            <Field
              type="text"
              autoComplete="off"
              name="weather"
              placeholder="Enter weather"
              component={Input}
              prefix={<HiOutlineCloud className="text-lg" />}
            />
          </FormItem>
          <FormItem label="Altitude">
            <Field
              type="text"
              autoComplete="off"
              name="altitude"
              placeholder="Enter altitude"
              component={Input}
              prefix={<HiOutlineArrowUp className="text-lg" />}
            />
          </FormItem>
        </div>
      ) : (
        ""
      )}
      {name === "Property" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem label="Google Map URL">
            <Field
              type="text"
              autoComplete="off"
              name="googleMapUrl"
              placeholder="Enter google map URL"
              component={Input}
              prefix={<HiOutlineMap className="text-lg" />}
            />
          </FormItem>
          <FormItem label="Location">
            <Field
              type="text"
              autoComplete="off"
              name="location"
              placeholder="Enter location"
              component={Input}
              prefix={<HiOutlineMapPin className="text-lg" />}
            />
          </FormItem>
        </div>
      ) : (
        ""
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <FormItem
            label="SKU"
            invalid={errors.sku && touched.sku}
            errorMessage={errors.sku}
          >
            <Field
              type="text"
              autoComplete="off"
              name="sku"
              placeholder="BTACM5455"
              component={Input}
              prefix={<HiOutlineHashtag className="text-lg" />}
            />
          </FormItem>
        </div>
        <div className="col-span-1 justify-self-center">
          <FormItem
            label="Published"
            invalid={errors.isPublished && touched.isPublished}
            errorMessage={errors.isPublished}
          >
            <Field
              component={Switcher}
              checked={values?.isPublished}
              name="isPublished"
              onChange={(e) => setFieldValue("isPublished", e)}
            />
          </FormItem>
        </div>

        {name === "Property" ? (
          <div className="col-span-1 justify-self-center">
            <FormItem label="Enable Booking">
              <Field
                component={Switcher}
                checked={values?.enableBooking}
                name="enableBooking"
                onChange={(e) => setFieldValue("enableBooking", e)}
              />
            </FormItem>
          </div>
        ) : (
          ""
        )}
      </div>

      <FormItem
        label={`${name} Description`}
        invalid={errors?.description && touched?.description}
        errorMessage={errors?.description}
      >
        <Field
          component={Input}
          textArea
          type="text"
          autoComplete="off"
          name="description"
          placeholder={`${name} Description`}
          value={values?.description}
          onChange={(e) => setFieldValue("description", e?.target?.value)}
        />
      </FormItem>
    </AdaptableCard>
  );
};

export default InfoFields;
