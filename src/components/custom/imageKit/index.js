import IKMediaLibraryWidget from "imagekit-media-library-widget";
import React, { useEffect } from "react";
import { useState } from "react";

const Imagekit = ({values,setFieldValue}) => {
  const [library, setLibrary] = useState();

  const config = {
    container: "#img-kit", // the element in which the widget will be rendered
    className: "media-library-widget",
    dimensions: {
      height: "100%",
      width: "100%",
    },
    view: "modal", // modal | inline
    renderOpenButton: true, // false | true (default)
  };

  // define callback handler
  function callback(payload) {
    // this is the callback handler
    // … consume json payload …
    console.log("Image data:", payload.data);
    setFieldValue("bannerImage",payload.data)
  }

  // instantiate the plugin
  useEffect(() => {
    const container = document.getElementById("img-kit");

    if (container && !container.firstChild) {
      const mediaLibraryWidget = new IKMediaLibraryWidget(config, callback);
      setLibrary(mediaLibraryWidget);
    }
  }, []);

  return (
    <div className="flex justify-between w-full h-full my-5 ">
      <div
        className="bg-green-50 text-green-700 text-base p-2 text-semibold rounded-xl hover:bg-green-100"
        id="img-kit"
        style={{ position: "relative", zIndex: "99", border: "1" }}
      />
      <div />
    </div>
  );
};

export default Imagekit;
