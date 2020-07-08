import React, { useState, useEffect } from "react";
import firebaseDb from "../FirebaseConfig/firebaseConfig";
import PointForm from './PointForm'

const VideosForm = (props) => {
  const category = props.match.params.category;
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [point, setPoint] = useState({
    title: "",
    sub_title: "",
  });
  const [points, setPoints] = useState([]);

  const fileHandler = (e) => {
    setVideoSrc(URL.createObjectURL(e.target.files[0]));
    setVideoUrl(e.target.files[0]);
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
    setTitle(e.target.value);
  };

  const onSubmitVideo = (e) => {
    e.preventDefault();

    if (points.length > 0) {
      const storageRef = firebaseDb.storage().ref().child(`videos/${category}`);
      const uploadTask = storageRef.put(videoUrl);
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
              title: title,
              video_url: url,
            };

            const documentRef = firebaseDb
              .firestore()
              .collection("videos")
              .doc(category);
            documentRef.set(data).then((res) => {
              for (let i = 0; i < points.length; i++) {
                documentRef
                  .collection("points_data")
                  .doc(i + "")
                  .set(points[i])
                  .then((result) => {});
              }

              alert("Data is Uploaded Succesfully");
              setTitle("");
              setVideoSrc(null);
              setVideoUrl(null);
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
      <div className="text-center">
        <h1>{category}</h1>
        <progress value={progress} max="100" style={{ width: "100%" }} />
      </div>
      <video width="100%" height="80%" autoPlay controls>
        {videoSrc && <source src={videoSrc} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>
      <form
        onSubmit={(e) => {
          onSubmitVideo(e);
        }}
      >
        <div className="form-group">
          <label htmlFor="selectvideo">Select Video</label>
          <input
            type="file"
            className="form-control"
            id="selectvideo"
            onChange={(e) => fileHandler(e)}
            placeholder="Select Video"
            accept="video/*"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={title || ""}
            onChange={(e) => onchange(e)}
            placeholder="Select Title"
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
      <h2 className="text-center my-3">Points</h2>
     
      <PointForm  category={category}/>

    </div>
  );
};

export default VideosForm;
