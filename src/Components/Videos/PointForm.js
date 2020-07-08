import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import firebaseDb from "../FirebaseConfig/firebaseConfig";

const PointForm = ({ category }) => {
  const [points, setPoints] = useState(null);
  const [pointid, setPointId] = useState(null);
  const [point, setPoint] = useState({
    title: "",
    sub_title: "",
    id: ""
  });

  const onPointChange = (e) => {
    setPoint({ ...point, [e.target.name]: e.target.value });
  };

  const onPointSubmit = (e) => {
    e.preventDefault();

    const documentRef = firebaseDb
    .firestore()
    .collection("videos")
    .doc(category)
    .collection("points_data")
    .doc(pointid);

    documentRef.set(point).then(res => {
        getPoints();
        alert("Edited Successfully")
    })
    .catch(err => {
        alert(err)
    })

    setPoint({
      title: "",
      sub_title: "",
      id:""
    });
  };

  const getPoints = () => {
    const documentRef = firebaseDb
      .firestore()
      .collection("videos")
      .doc(category)
      .collection("points_data");

    documentRef.get().then((snapshot) => {
      const pointsList = [];
      snapshot.forEach((doc) => {
        pointsList.push({ ...doc.data(), id: doc.id });
      });
      setPoints(pointsList);
    });
  };
  useEffect(() => {
    getPoints();
  }, [category]);

  const deletePoint = (id) => {
    const documentRef = firebaseDb
      .firestore()
      .collection("videos")
      .doc(category)
      .collection("points_data")
      .doc(id);
    documentRef
      .delete()
      .then((res) => {
        getPoints();
        alert("Point is Deleted!");
      })
      .catch((err) => {
        alert(err);
      });
  };

  const pointEdit = (id) => {
    const documentRef = firebaseDb
      .firestore()
      .collection("videos")
      .doc(category)
      .collection("points_data")
      .doc(id);
    documentRef
      .get()
      .then((snapshot) => {
        setPoint({
            title: snapshot.data().title,
            sub_title: snapshot.data().sub_title,
        });
        setPointId(id)
      })
      .catch((err) => {
        alert(err);
      });
  };

  return !points ? (
    <h6>Wait</h6>
  ) : points.length > 0 ? (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {points.map((pnt) => {
            return (
              <tr key={pnt.id}>
                <td>{pnt.title}</td>
                <td>{pnt.sub_title}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => pointEdit(pnt.id)}
                    data-toggle="modal"
                    data-target="#myModalEdit"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => deletePoint(pnt.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="modal" id="myModalEdit">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Point</h4>
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
                    value={point.title}
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
                    value={point.sub_title}
                    onChange={(e) => onPointChange(e)}
                    placeholder="Description"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-secondary btn-block">
                  Edit Point
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <h6>There is no points</h6>
  );
};

PointForm.propTypes = {};

export default PointForm;
