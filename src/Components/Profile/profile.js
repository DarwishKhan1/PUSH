import React, { useState, useEffect } from "react";
import firebaseDb from "../FirebaseConfig/firebaseConfig";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  base64StringtoFile,
  extractImageFileExtensionFromBase64,
} from "../../Utils/utility";

const Profile = (props) => {
  const [progress, setProgress] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [crop, setCrop] = useState({
    aspect: 1 / 1,
    unit: "%",
    width: 25,
    height: 50,
  });

  useEffect(() => {
    const documentRef = firebaseDb
      .firestore()
      .collection("name_bg_image")
      .doc("name_bg_image");
    documentRef.get().then((snapshot) => {
      if (snapshot.data()) {
        setImgSrc(snapshot.data().image_url);
        setUploaded(true);
      }
    });
  }, []);

  const fileHandler = (e) => {
    setImgSrc(URL.createObjectURL(e.target.files[0]));
    setUploaded(false);
  };


  function getCroppedImg() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("crossorigin", "anonymous");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const fileExtension = extractImageFileExtensionFromBase64(imgSrc);
    const myFileName = "preview." + fileExtension;
    const base64Image = canvas.toDataURL("image/" + fileExtension);
    const cropFile = base64StringtoFile(base64Image, myFileName);
    setFile(cropFile);
    alert("Image is Cropped");
  }

  const onsubmit = (e) => {
    e.preventDefault();
    if (file) {
      const storageRef = firebaseDb.storage().ref().child(`Images/username_bg`);
      const uploadTask = storageRef.put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (err) => {
          console.log(err);
        },
        () => {
          storageRef.getDownloadURL().then((url) => {
            const data = {
              image_url: url,
            };

            const documentRef = firebaseDb
              .firestore()
              .collection("name_bg_image")
              .doc("name_bg_image");
            documentRef.set(data).then((res) => {
              alert("Data is Uploaded Succesfully");
              setImgSrc(url);
              setUploaded(true);
            });
          });
        }
      );
    } else {
        alert("Please Crop Image");
    }
  };
  return (
    <div className="mx-auto mt-2 control-width">
      <div className="text-center">
        <h1>Profile</h1>
        <progress value={progress} max="100" style={{ width: "100%" }} />
        {imgSrc && (
          <div>
            {uploaded ? (
              <img src={imgSrc} height="400px"/>
            ) : (
              <div>
                <ReactCrop
                  src={imgSrc}
                  onImageLoaded={setImage}
                  crop={crop}
                  onChange={setCrop}
                />
                <button
                  onClick={getCroppedImg}
                  className="btn btn-secondary btn-block my-2"
                >
                  Crop Image{" "}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          onsubmit(e);
        }}
      >
        <div className="form-group">
          <label htmlFor="selectvideo" className="h6">
            Select Image
          </label>
          <input
            type="file"
            className="form-control"
            id="selectvideo"
            onChange={(e) => fileHandler(e)}
            placeholder="Select  Image"
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn btn-secondary btn-block mb-3">
          Submit
        </button>
      </form>
    </div>
  );
};
export default Profile;
