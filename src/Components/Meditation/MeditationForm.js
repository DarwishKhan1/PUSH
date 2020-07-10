import React, { useState, useEffect } from "react";
import firebaseDb from "../FirebaseConfig/firebaseConfig";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  base64StringtoFile,
  extractImageFileExtensionFromBase64,
} from "../../Utils/utility";

const MeditationForm = (props) => {
  const category = props.match.params.category;
  const [progress, setProgress] = useState(0);
  const [meditationForm, setMeditationForm] = useState({
    title: "",
    description: "",
  });
  const [audioUrl, setAudioUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
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
      .collection("meditation")
      .doc(category);
    documentRef.get().then((snapshopt) => {
      if (snapshopt.data()) {
        setAudioUrl(snapshopt.data().audio_url);
        setImageUrl(snapshopt.data().image_url);
        setMeditationForm({
          title: snapshopt.data().title,
          description: snapshopt.data().description,
        });
        setUploaded(true);
      }
    });
  }, [category]);

  const AudioFileHandler = (e) => {
    if (e.target.files[0]) {
      setAudioUrl(e.target.files[0]);

      const audioStorageRef = firebaseDb
        .storage()
        .ref()
        .child(`audio/meditation_${category}`);
      const uploadTask = audioStorageRef.put(e.target.files[0]);
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
          audioStorageRef.getDownloadURL().then((audUrl) => {
            const data = {
              title: meditationForm.title,
              description: meditationForm.description,
              audio_url: audUrl,
              image_url: imageUrl,
              category: category,
            };

            const documentRef = firebaseDb
              .firestore()
              .collection("meditation")
              .doc(category);
            documentRef.set(data).then((res) => {
              setAudioUrl(audUrl);
              alert("Audio is Uploaded Succesfully");
            });
          });
        }
      );
    }
  };

  const imgFileHandler = (e) => {
    if (e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      setUploaded(false);
      setIsImageSelected(true);
    }
  };

  const onchange = (e) => {
    setMeditationForm({
      ...meditationForm,
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

    const fileExtension = extractImageFileExtensionFromBase64(imageUrl);
    const myFileName = "preview." + fileExtension;
    const base64Image = canvas.toDataURL("image/" + fileExtension);
    const cropFile = base64StringtoFile(base64Image, myFileName);
    setFile(cropFile);
    alert("Image is Cropped");
  }

  const onsubmit = (e) => {
    e.preventDefault();
    const imageStorageRef = firebaseDb
      .storage()
      .ref()
      .child(`images/meditation_${category}`);

    if (isImageSelected) {
      if (file) {
        const uploadTask1 = imageStorageRef.put(file);

        uploadTask1.on(
          "state_changed",
          (snapshot) => {},
          (err) => {
            console.log(err);
          },
          () => {
            imageStorageRef.getDownloadURL().then((imgUrl) => {
              const data = {
                title: meditationForm.title,
                description: meditationForm.description,
                audio_url: audioUrl,
                image_url: imgUrl,
                category: category,
              };

              const documentRef = firebaseDb
                .firestore()
                .collection("meditation")
                .doc(category);
              documentRef.set(data).then((res) => {
                alert("Data is Uploaded Succesfully");
                setAudioUrl(audioUrl);
                setImageUrl(imageUrl);
              });
            });
          }
        );
      } else {
        alert("Please Crop Image");
      }
    } else {
      const data = {
        title: meditationForm.title,
        description: meditationForm.description,
        audio_url: audioUrl,
        image_url: imageUrl,
        category: category,
      };

      const documentRef = firebaseDb
        .firestore()
        .collection("meditation")
        .doc(category);
      documentRef.set(data).then((res) => {
        alert("Data is Uploaded Succesfully");
        setAudioUrl(audioUrl);
        setImageUrl(imageUrl);
      });
    }
  };

  return (
    <div className="mx-auto mt-2 control-width">
      <div className="text-center">
        <h1>Meditation {category}</h1>
        <progress value={progress} max="100" style={{ width: "100%" }} />
        {imageUrl &&
          (uploaded ? (
            <img src={imageUrl} height="400px" />
          ) : (
            <div>
              <ReactCrop
                src={imageUrl}
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
          ))}
      </div>

      <form
        onSubmit={(e) => {
          onsubmit(e);
        }}
      >
        <div className="form-group">
          <label htmlFor="selectvideo" className="h6">
            Select Audio
          </label>
          <input
            type="file"
            className="form-control"
            id="selectvideo"
            onChange={(e) => AudioFileHandler(e)}
            placeholder="Select  Video"
            accept="audio/*"
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
            value={meditationForm.title || ""}
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
            value={meditationForm.description || ""}
            onChange={(e) => onchange(e)}
            placeholder="Description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="selectImage" className="h6">
            Select Image
          </label>
          <input
            type="file"
            className="form-control"
            id="selectImage"
            onChange={(e) => imgFileHandler(e)}
            placeholder="Select  Video"
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-secondary btn-block">
          Submit
        </button>
      </form>
    </div>
  );
};
export default MeditationForm;
