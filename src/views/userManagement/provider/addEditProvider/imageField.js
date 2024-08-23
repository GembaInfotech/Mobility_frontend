import { DoubleSidedImage } from "components/shared";
import { Upload, FormItem, Card } from "components/ui";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { AiOutlineClose } from "react-icons/ai";
import appConfig from "configs/app.config";
import React from "react";

////////UPLOAD IMAGE FROM API/////////

const ImageField = ({ id, touched, errors, values, setFieldValue, name }) => {
  const handlerUploadImages = (imgs) => {
    const payload = new FormData();
    for (let i = 0; i < imgs?.length; i++) {
      payload.append("image", imgs[i]);
    }

    postApi(APIS.UPLOAD_IMAGE, payload).then((res) => {
      let files = [];

      if (res?.data?.length) {
        files = [...files, ...res?.data];
      } else {
        files = [...files, res?.data];
      }
        setFieldValue(`image`, files)
    });
  };

  //////REMOVE IMAGE FROM API////////

  const handlerRemoveImages = (img, index, i) => {
    postApi(APIS.DELETE_IMAGE, {
      original: img?.original,
      thumbnail: img?.thumbnail,
    }).then(() => {
      const newArray = values?.images?.filter(
        (item) => item?.original !== img?.original
      );
      setFieldValue(`image`, newArray);
    });
  };

  //////////// RETURN /////////
  return (
    <>
      <div className="grid grid-cols-2 mb-5 gap-x-4">
        <FormItem
          label="Upload Image"
          invalid={errors?.image}
          errorMessage={errors?.image}
        >
          <Upload
            uploadLimit={1}
            draggable
            name="image"
            showList={false}
            onChange={(image) => handlerUploadImages(image)}
          >
            <DoubleSidedImage
              className="mx-auto"
              src="/img/others/upload.png"
              darkModeSrc="/img/others/upload-dark.png"
            />
          </Upload>
        </FormItem>

        {values?.image?.length > 0 && (
          <div className="flex justify-center">
            <Card className="mt-6 mb-5 " style={{ height: "112px" }}>
              <div className="flex flex-wrap">
                {values?.image?.map((image, imageIndex, array) => (
                  <div
                    className="flex items-center justify-between  p-2 border-2 rounded-xl  "
                    key={imageIndex}
                  >
                    <div className="flex items-center ">
                      <img
                        className="w-14 h-12 rounded-xl mr-2"
                        alt={
                          image?.imageUrlOriginal
                            ? image?.imageUrlOriginal
                            : image?.original
                        }
                        src={`${appConfig.apiBaseUrl}bucket/${
                          image?.imageUrlOriginal
                            ? image?.imageUrlOriginal
                            : image?.original
                        }`}
                      />
                    </div>
                    <AiOutlineClose
                      className="text-sm cursor-pointer"
                      onClick={() => handlerRemoveImages(image, imageIndex)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageField;
