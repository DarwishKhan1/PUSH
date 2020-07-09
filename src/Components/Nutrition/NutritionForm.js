import React, { useState, useEffect } from "react";
import firebaseDb from "../FirebaseConfig/firebaseConfig";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  base64StringtoFile,
  extractImageFileExtensionFromBase64,
} from "../../Utils/utility";
import PointForm from "./PointForm";

const NutritionForm = (props) => {
  const [progress, setProgress] = useState(0);
  const [nutritionForm, setNutritionForm] = useState({
    title: "",
    description: "",
  });
  const [imgSrc, setImgSrc] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [point, setPoint] = useState({
    title: "",
    sub_title: "",
  });
  const [points, setPoints] = useState([]);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({
    aspect: 1 / 2,
    unit: "%",
    width: 25,
    height: 50,
  });

  useEffect(() => {
    const documentRef = firebaseDb
      .firestore()
      .collection("nutrition")
      .doc("nutrition");
    documentRef.get().then((snapshopt) => {
      if (snapshopt.data()) {
        setImgSrc(snapshopt.data().image_url);
        setNutritionForm({
          title: snapshopt.data().title,
          description: snapshopt.data().description,
        });
        setUploaded(true);
      }
    });
  }, []);

  const fileHandler = (e) => {
    if (e.target.files[0]) {
      setImgSrc(URL.createObjectURL(e.target.files[0]));
      setUploaded(false);
      setIsFileSelected(true);
    }
  };

  const onPointChange = (e) => {
    setPoint({ ...point, [e.target.name]: e.target.value });
  };

  const onPointSubmit = (e) => {
    e.preventDefault();

    const documentRef = firebaseDb
      .firestore()
      .collection("nutrition")
      .doc("nutrition")
      .collection("points_data");

    documentRef
      .doc()
      .set(point)
      .then((res) => {
        alert("Point is Uploaded Succesfully");
      });
  };

  const onchange = (e) => {
    setNutritionForm({
      ...nutritionForm,
      [e.target.name]: e.target.value,
    });
  };

  function getCroppedImg() {
    const canvas = document.createElement("canvas");
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

    if (isFileSelected) {
      if (file) {
        const storageRef = firebaseDb.storage().ref().child(`Images/nutrition`);
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
                title: nutritionForm.title,
                description: nutritionForm.description,
                image_url: url,
              };

              const documentRef = firebaseDb
                .firestore()
                .collection("nutrition")
                .doc("nutrition");
              documentRef.set(data).then((res) => {
                alert("Data is Uploaded Succesfully");
                setIsFileSelected(false);
                setImgSrc(url);
              });
            });
          }
        );
      } else {
        alert("Please Click on Crop Image Button");
      }
    } else {
      const data = {
        title: nutritionForm.title,
        description: nutritionForm.description,
        image_url: imgSrc,
      };

      const documentRef = firebaseDb
        .firestore()
        .collection("nutrition")
        .doc("nutrition");
      documentRef.set(data).then((res) => {
        alert("Data is Uploaded Succesfully");
        setImgSrc(imgSrc);
      });
    }
  };

  return (
    <div className="mx-auto mt-2 control-width">
      <div className="text-center">
        <h1>Nutrition</h1>
        <progress value={progress} max="100" style={{ width: "100%" }} />
        {imgSrc && (
          <div>
            {uploaded ? (
              <img src={imgSrc}  height="400px"/>
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
            placeholder="Select  Video"
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <label htmlFor="title" className="h6">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={nutritionForm.title || ""}
            onChange={(e) => onchange(e)}
            placeholder="Select Title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="title" className="h6">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="description"
            value={nutritionForm.description || ""}
            onChange={(e) => onchange(e)}
            placeholder="Description"
          />
        </div>

        <button type="submit" className="btn btn-secondary btn-block">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-block"
          data-toggle="modal"
          data-target="#myModal"
        >
          Add Point
        </button>
      </form>

      <div className="modal" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Point</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={(e) => onPointSubmit(e)}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={point.title || ""}
                    onChange={(e) => onPointChange(e)}
                    placeholder="Select Title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="sub_title"
                    value={point.sub_title || ""}
                    onChange={(e) => onPointChange(e)}
                    placeholder="Description"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-secondary btn-block my-3"
                >
                  Save Point
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-center my-3">Points</h2>
      <PointForm />
    </div>
  );
};

export default NutritionForm;
