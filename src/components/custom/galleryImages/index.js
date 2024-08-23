import { useRef, useState } from "react";
import { AdaptableCard, DoubleSidedImage } from "components/shared";
import { FormItem, Input, Upload, Button } from "components/ui";
import {
  HiOutlineLibrary,
  HiOutlineMenuAlt1,
  HiOutlinePlus,
} from "react-icons/hi";
import { getApi, postApi } from "services/CommonService";
import { APIS, LIST_DATA_TYPE } from "constants/api.constant";
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import { Field, FieldArray } from "formik";
import appConfig from "configs/app.config";
import React from "react";

//////// DEFAULT VALUES FOR ADD MORE FIELDS ///////

const defaultValue = {
  image: "",
  caption: "",
};

//////// GALLERY IMAGES FIELDS /////////

const GalleryImages = ({ id, touched, errors, values, setFieldValue,name }) => {
  const arrayHelpersRef = useRef(null);
  const [image, setImage] = useState();

  //////// FUNCTION FOR UPLOAD IMAGE //////

  const uploadGalleryImages = (imgs, index) => {
    const payload = new FormData();

    payload.append("image", ...imgs);

    postApi(APIS.UPLOAD_IMAGE, payload).then((res) => {
      let img = res.data;

      setFieldValue(`galleryImages.${index}.image`, img);
      setImage(img);
    });
  };

  //////// FUNCTION FOR REMOVE IMAGE //////

  const removeUploadGalleryImages = (img, index) => {
    postApi(APIS.REMOVE_IMAGE, {
      deleteImages: [
        {
          original: img?.original,
          thumbnail: img?.thumbnail,
        },
      ],
    }).then(() => {
      setFieldValue(`galleryImages.${index}.image`, "");
    });
  };

  //////////// RETURN /////////
  return (
    <AdaptableCard divider>
      <div className="flex justify-between mb-6">
        <div>
          <h5>Your Gallery Images At {name} </h5>
          <p>Section to config Gallery Images information</p>
        </div>
        <Button
          size="md"
          variant="twoTone"
          icon={<HiOutlinePlus />}
          type="button"
          onClick={() => arrayHelpersRef.current.push(defaultValue)}
        />
      </div>

      <FieldArray
        name="galleryImages"
        render={(arrayHelpers) => {
          arrayHelpersRef.current = arrayHelpers;
          return (
            <div>
              {values?.galleryImages?.map((dayAct, index) => (
                <AdaptableCard
                  className="mt-3 pb-10"
                  divider
                  border
                  key={index}
                >
                  <h5 className="mb-5">Gallery Image {index + 1}</h5>
                  <Upload
                    draggable
                    name={`galleryImages.${index}.image`}
                    className="h-4/5 w-full mb-4"
                    uploadLimit={1}
                    showList={false}
                    onChange={(image) => uploadGalleryImages(image, index)}
                  >
                    <DoubleSidedImage
                      className="mx-auto"
                      src="/img/others/upload.png"
                      darkModeSrc="/img/others/upload-dark.png"
                    />
                  </Upload>

                  {/*     GALLERY IMAGE PREVIEW        */}

                  {(values?.galleryImages?.[index]?.image || dayAct?.image) && (
                    <div className="flex items-center justify-between my-3 p-2  border-2 rounded-xl">
                      <div className="flex items-center">
                        <img
                          className="w-15 h-12 rounded-xl mr-2"
                          src={`${appConfig.imageBaseUrl}${
                            [index]?.image?.original ||
                            values?.galleryImages?.[index]?.image?.original
                          }`}
                        />
                        <span>{dayAct?.image?.original}</span>
                      </div>
                      <AiOutlineClose
                        className="text-2xl cursor-pointer"
                        onClick={() => removeUploadGalleryImages(image, index)}
                      />
                    </div>
                  )}
                  <div class="col-span-2 ...">
                    <FormItem label="Caption">
                      <Field
                        type="text"
                        autoComplete="off"
                        name={`galleryImages.${index}.caption`}
                        placeholder="Caption"
                        component={Input}
                        prefix={<HiOutlineMenuAlt1 className="text-lg" />}
                      />
                    </FormItem>

                    <div className="inline flex  justify-end">
                      <Button
                        size="xs"
                        variant="twoTone"
                        color="red-600"
                        icon={<AiOutlineDelete />}
                        type="button"
                        onClick={() => arrayHelpersRef.current.remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </AdaptableCard>
              ))}
            </div>
          );
        }}
      />
      {values?.galleryImages?.length ? (
        <div className="inline flex  justify-end mt-5">
          <Button
            size="md"
            variant="twoTone"
            icon={<HiOutlinePlus />}
            type="button"
            onClick={() => arrayHelpersRef.current.push(defaultValue)}
          >
            Gallery Image
          </Button>
        </div>
      ) : (
        ""
      )}
    </AdaptableCard>
  );
};

export default GalleryImages;
