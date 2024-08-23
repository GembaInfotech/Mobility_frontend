import React, { useState } from "react";
import { AdaptableCard, DoubleSidedImage } from "components/shared";
import { Upload, Button } from "components/ui";
import appConfig from "configs/app.config";

const BannerImage = ({ touched, errors, values, setFieldValue }) => {
  const [image, setImage] = useState();

  const ImageHandler = (e) => {
    setImage(URL.createObjectURL(e[0]));
    setFieldValue("bannerImage", e[0]);
  };
  return (
    <AdaptableCard className="mb-4" divider>
      <h5>Banner Image</h5>
      <p className="mb-6">Add or change image for the banner</p>
      {!!(values?.bannerImage?.name || values?.bannerImage?.original) && (
        <div className="flex flex-col justify-end">
          <img
            className="my-5 rounded-xl"
            // src={`${appConfig.imageBaseUrl}${values?.seoImage?.original} `}
            src={
              image
                ? image 
                : `${appConfig.imageBaseUrl}${values?.bannerImage?.original} `
            }
          />
        </div>
      )}
      <Upload
        draggable
        name="bannerImage"
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
    </AdaptableCard>
  );
};

export default BannerImage;
