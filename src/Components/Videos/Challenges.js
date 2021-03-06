import React, { useState, useEffect } from "react";
import firebaseDb from "../FirebaseConfig/firebaseConfig";
import PointForm from "./PointForm";
import VideoThumbnail from "react-video-thumbnail";
import { base64StringtoFile } from "../../Utils/utility";

const Challenges = (props) => {
  const [progress, setProgress] = useState(0);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [title, setTitle] = useState("");
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [Uploaded, setUploaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [videoSelectedSrc, setVideoSelectedSrc] = useState(null);
  const [point, setPoint] = useState({
    title: "",
    sub_title: "",
  });

  useEffect(() => {
    const documentRef = firebaseDb
      .firestore()
      .collection("videos")
      .doc("challenges");
    documentRef.get().then((snapshopt) => {
      if (snapshopt.data()) {
        setVideoSrc(snapshopt.data().video_url);
        setTitle(snapshopt.data().title);
        setImageUrl(snapshopt.data().thumbnailUrl);
        setUploaded(true)
      }
    });
  }, []);

  const fileHandler = (e) => {
    if (e.target.files[0]) {
      setVideoSelectedSrc(URL.createObjectURL(e.target.files[0]));
      setVideoSrc(URL.createObjectURL(e.target.files[0]));
      setVideoUrl(e.target.files[0]);
      setIsFileSelected(true);
      setUploaded(false)
    }
  };
  const getVideoThumnail = (thumbnail) => {
    const myFileName = "preview.jpg";
    const thumbnailFile = base64StringtoFile(thumbnail, myFileName);
    setImageSrc(thumbnailFile);
  };


  const onPointChange = (e) => {
    setPoint({ ...point, [e.target.name]: e.target.value });
  };

  const onPointSubmit = (e) => {
    e.preventDefault();

    const documentRef = firebaseDb
      .firestore()
      .collection("videos")
      .doc("challenges")
      .collection("points_data");

    documentRef
      .doc()
      .set(point)
      .then((res) => {
        alert("Point is Uploaded Succesfully");
      });
  };

  const onchange = (e) => {
    setTitle(e.target.value);
  };

  const onSubmitVideo = (e) => {
    e.preventDefault();
    if (isFileSelected) {
      const storageRef = firebaseDb.storage().ref().child(`videos/challenges`);
      const thumbnailStorageRef = firebaseDb.storage().ref().child(`thumbnail/challenges`);
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

            const thumbnailUploadTask=thumbnailStorageRef.put(imageSrc);
 
            thumbnailUploadTask.on(
             "state_changed",
             (snapshot) => {
             },
             (err) => {
               console.log(err);
             },
             () => {
               thumbnailStorageRef.getDownloadURL().then(thumbUrl => {
                 const data = {
                   title: title,
                   video_url: url,
                   thumbnailUrl: thumbUrl
                 };
     
                 const documentRef = firebaseDb
                   .firestore()
                   .collection("videos")
                   .doc("challenges");
                 documentRef.set(data).then((res) => {
                   alert("Data is Uploaded Succesfully");
                 });
               })
             }
            )
           });
        }
      );
    } else {
      const data = {
        title: title,
        video_url: videoSrc,
        thumbnailUrl: imageUrl
      };

      const documentRef = firebaseDb
        .firestore()
        .collection("videos")
        .doc("challenges");
      documentRef.set(data).then((res) => {
        alert("Data is Uploaded Succesfully");
      });
    }
  };

  return (
    <div className="mx-auto mt-2 control-width">
      <div className="text-center">
        <h1>Challenges</h1>
        <progress value={progress} max="100" style={{ width: "100%" }} />
      </div>
      {Uploaded && (
        <video width="100%" height="400px" autoPlay controls>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
       {!Uploaded ? (
        <video width="100%" height="400px" autoPlay controls>
          <source src={videoSelectedSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) :""}
       {isFileSelected && (
        <VideoThumbnail
          videoUrl={videoSelectedSrc}
          thumbnailHandler={(thumbnail) => getVideoThumnail(thumbnail)}
          renderThumbnail={false}
          snapshotAtTime={1}
        />
      )}
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

      <PointForm category={'challenges'} />
    </div>
  );
};

export default Challenges;
