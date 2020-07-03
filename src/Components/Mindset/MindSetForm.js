import React, { useState } from "react";
import firebaseDb from "../FirebaseConfig/firebaseConfig";

const MindSetForm = (props) => {
  const [progress, setProgress] = useState(0);
  const [mindsetForm, setMindsetForm] = useState({
    title: "",
    description: "",
  });
  const [imgSrc, setImgSrc] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [point, setPoint] = useState({
    title: "",
    sub_title: "",
  });
  const [points, setPoints] = useState([]);

  const fileHandler = (e) => {
    setImgSrc(URL.createObjectURL(e.target.files[0]));
    setImageUrl(e.target.files[0]);
  };

  const onPointChange = (e) => {
    setPoint({ ...point, [e.target.name]: e.target.value });
  };

  const onPointSubmit = (e) => {
    e.preventDefault();

    points.push(point);
    alert("Succesfully Added");

    setPoint({
      title: "",
      sub_title: "",
    });
  };

  const onchange = (e) => {
    setMindsetForm({
      ...mindsetForm,
      [e.target.name]: e.target.value,
    });
  };

  const onsubmit = (e) => {
    e.preventDefault();

    if (points.length > 0) {
      const storageRef = firebaseDb.storage().ref().child(`Images/mindset`);
      const uploadTask = storageRef.put(imageUrl);
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
              title: mindsetForm.title,
              description: mindsetForm.description,
              image_url: url,
            };

            const documentRef = firebaseDb
              .firestore()
              .collection("mindset")
              .doc("mindset");
            documentRef.set(data).then((res) => {
              for (let i = 0; i < points.length; i++) {
                documentRef
                  .collection("points_data")
                  .doc(i + "")
                  .set(points[i])
                  .then((result) => {});
              }

              alert("Data is Uploaded Succesfully");
              setMindsetForm({
                title: "",
                description: "",
              });
              setImgSrc(url);
              setImageUrl(null);
            });
          });
        }
      );
    } else {
      alert("Please Add some Points");
    }
  };

  return (
    <div className="mx-auto mt-2 control-width">
      <progress value={progress} max="100" style={{ width: "100%" }} />
      <div className="text-center">
        <img src={imgSrc && imgSrc} width="100%" height="200px" />
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
            required
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
            value={mindsetForm.title || ""}
            onChange={(e) => onchange(e)}
            placeholder="Select Title"
            required
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
            value={mindsetForm.description || ""}
            onChange={(e) => onchange(e)}
            placeholder="Description"
            required
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-block"
          data-toggle="modal"
          data-target="#myModal"
        >
          Add Point
        </button>
        <button type="submit" className="btn btn-secondary btn-block">
          Submit
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
                <button type="submit" className="btn btn-secondary btn-block">
                  Save Point
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindSetForm;
