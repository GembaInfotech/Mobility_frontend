import React, { useState } from "react";
import { AdaptableCard, DoubleSidedImage } from "components/shared";
import { Input, FormItem, Upload, Button } from "components/ui";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import appConfig from "configs/app.config";
import { Field } from "formik";
import { AiOutlineDelete } from "react-icons/ai";

const SeoFields = ({ id, values, touched, errors, setFieldValue }) => {
  const [image, setImage] = useState();
  const ImageHandler = (e) => {
    setImage(URL.createObjectURL(e[0]));
    setFieldValue("seoImage", e[0]);
  };


  return (
    <AdaptableCard className="mb-4" divider>
      <h5>SEO details</h5>
      <p  className="mb-6">Section to config the SEO attributes</p>
      <FormItem
        label="Seo Title"
        invalid={errors.seoTitle && touched.seoTitle}
        errorMessage={errors.seoTitle}
      >
        <Field
          type="text"
          autoComplete="off"
          name="seoTitle"
          placeholder="Seo Title"
          component={Input}
          prefix={<HiOutlineMenuAlt1 className="text-lg" />}
        />
      </FormItem>
      <FormItem
        label="Seo Description"
        invalid={errors.seoDescription && touched.seoDescription}
        errorMessage={errors.seoDescription}
      >
        <Field
          textArea
          type="text"
          autoComplete="off"
          name="seoDescription"
          placeholder="Seo Description"
          value={values?.seoDescription}
          component={Input}
          onChange={(e) => setFieldValue("seoDescription", e?.target?.value)}
        />
      </FormItem>
      <FormItem
        label="Seo Image"
        invalid={errors.seoImage && touched.seoImage}
        errorMessage={errors.seoImage}
      >
        {!!(values?.seoImage?.name || values?.seoImage?.original) && (
          <div className="flex flex-col justify-end">
            <img
              className="my-5 rounded-xl"
              src={
                image
                  ? image
                  : `${appConfig?.imageBaseUrl}${values?.seoImage?.original} `
              }
            />
            {/* <Button
              size="xs"
              className="mb-3"
              variant="twoTone"
              color="red-600"
              icon={<AiOutlineDelete />}
              type="button"
              onClick={() => {
                setFieldValue("seoImage", "");

              }}
            >
              Remove Image
            </Button> */}
          </div>
        )}
        <Upload
          draggable
          uploadLimit={1}
          showList={false}
          onChange={(e) => ImageHandler(e)}
        >
          <div className=" text-center">
            <DoubleSidedImage
              className="mx-auto"
              src="/img/others/upload.png"
              darkModeSrc="/img/others/upload-dark.png"
            />
            <p className="font-semibold">
              <span className="text-gray-800 dark:text-white">
                Drop your image here, or{" "}
              </span>
              <span className="text-blue-500">browse</span>
            </p>
            <p className="mt-1 opacity-60 dark:text-white">
              Support: jpeg, png, svg
            </p>
          </div>
        </Upload>
      </FormItem>
    </AdaptableCard>
  );
};

export default SeoFields;
