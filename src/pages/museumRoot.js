import React, { useState, useEffect } from 'react';
import { ImageDb } from '../firebase'; // Assuming ImageDb is your Firebase storage instance
import { uploadBytes, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 } from "uuid";
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import '../css/styles.css';

function ImageUpload() {
  // State for text data
  const [museum, setMuseum] = useState({
    title: "",
    author: "",
    desc: ""
  });

  // State to store fetched museum data
  const [museumData, setMuseumData] = useState([]);

  // Fetch museum data from Firebase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://world-of-art-app-default-rtdb.firebaseio.com/museumData.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data from Firebase");
        }
        const data = await response.json();
        // Convert Firebase object to array of objects
        const dataArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setMuseumData(dataArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle input changes for text data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMuseum((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission to add museum data to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: museum.title,
          author: museum.author,
          desc: museum.desc
        })
      };
      const response = await fetch(
        "https://world-of-art-app-default-rtdb.firebaseio.com/museumData.json",
        options
      );
      if (!response.ok) {
        throw new Error("Failed to add museum data");
      }
      alert("Museum added successfully!");
      setMuseum({ title: "", author: "", desc: "" }); // Clear form after successful submission
    } catch (error) {
      console.error("Error adding museum:", error);
      alert("Error adding museum. Please try again.");
    }
  };

  // State for image upload
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editImg, setEditImg] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [previewImgUrl, setPreviewImgUrl] = useState(null); // State to store preview image URL

  // Handle file change for image upload and set preview image URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file); // Store selected file in state
    setPreviewImgUrl(URL.createObjectURL(file)); // Create and store preview image URL
  };

  // Upload image to Firebase Storage
  const handleClickUpload = () => {
    if (img !== null || editImg !== null) {
      if (editingImage) {
        const imgRef = ref(ImageDb, `museums/${editingImage.id}`);
        uploadBytes(imgRef, editImg || img).then(() => {
          setImg(null);
          setEditingImage(null);
          setEditImg(null);
          listImages(); // Refresh the list of images after update
          setShowModal(false);
          setShowEditModal(false);
          setShowFileModal(false);
          setPreviewImgUrl(null); // Clear preview image URL after upload
        }).catch(error => console.error('Error uploading image:', error));
      } else {
        const imgRef = ref(ImageDb, `museums/${v4()}`);
        uploadBytes(imgRef, img).then(() => {
          setImg(null);
          listImages(); // Refresh the list of images after upload
          setShowModal(false);
          setShowEditModal(false);
          setShowFileModal(false);
          setPreviewImgUrl(null); // Clear preview image URL after upload
        }).catch(error => console.error('Error uploading image:', error));
      }
    }
  };

  // Fetch list of images from Firebase Storage
  const listImages = () => {
    listAll(ref(ImageDb, "museums")).then(imgs => {
      const promises = imgs.items.map(val =>
        getDownloadURL(val).then(url => ({ url, ref: val }))
      );
      Promise.all(promises).then(imageUrls => {
        setImgUrl(imageUrls); // Store image URLs in state
      });
    }).catch(error => console.error('Error listing images:', error));
  };

  // Handle deletion of an image from Firebase Storage
  const handleDelete = () => {
    const index = deletingIndex;
    const refToDelete = imgUrl[index].ref;
    deleteObject(refToDelete).then(() => {
      listImages(); // Refresh the list of images after deletion
      setShowDeleteModal(false);
    }).catch(error => console.error('Error deleting image:', error));
  };

  // Handle edit of an image
  const handleEdit = (image) => {
    setEditingImage(image);
    setShowEditModal(true);
  };

  // Show modal with image details
  const handleShowModal = (imageUrl, index) => {
    setModalImgUrl(imageUrl);
    setShowModal(true);
    setDeletingIndex(index);
  };

  // useEffect to list images on component mount
  useEffect(() => {
    listImages();
  }, []);

  // Show file selection modal
  const handleShowFileModal = () => {
    setPreviewImgUrl(null); // Clear preview image URL when opening file selection modal
    setShowFileModal(true);
  };

  return (
    <div className="container">
      {/* Button to trigger file selection modal */}
      <div className="row bottomright">
        <div className="col bottom-right-icon">
          <Button onClick={handleShowFileModal}>
            <FontAwesomeIcon icon={faFileUpload} />
          </Button>
        </div>
      </div>
      <br/>
      {/* Display images with delete and edit options */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 ">
        <br/>
        {imgUrl.map((data, index) => (
          <div className="col" key={index}>
            <div className="card">
              <img src={data.url} className="card-img-top img-fluid img-lazy" alt={`image_${index}`} onClick={() => handleShowModal(data.url, index)} style={{height: '350px'}} />
              <div className="card-body d-flex justify-content-center align-items-center">
                <div>
                  <button className="btn btn-danger me-2" onClick={() => {setDeletingIndex(index); setShowDeleteModal(true);}}>Delete</button>
                  <button className="btn btn-primary" onClick={() => handleEdit({ id: index, ref: data.ref })}>Edit</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <br/>
      {/* Modal for image zoom */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <img src={modalImgUrl} className="card-img-top modal-img img-fluid" alt="modal-img" />
          {/* Display museum data */}
          {museumData.map((item) => (
            <div key={item.id} className="museum-item">
              <h3>Title: {item.title}</h3>
              <p>Author: {item.author}</p>
              <p>Description: {item.desc}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for editing image */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Body>
          {/* Display preview of selected image for editing */}
          {previewImgUrl && <img src={previewImgUrl} alt="Preview" className="img-fluid" />}
          {/* File input to select image for editing */}
          <input type="file" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          {/* Button to upload or update image */}
          <button className="btn btn-info" onClick={handleClickUpload}>{editingImage ? 'Update' : 'Upload'}</button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for file selection */}
      <Modal show={showFileModal} onHide={() => setShowFileModal(false)} centered>
        <Modal.Body>
          {/* Form to submit text data */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={museum.title}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={museum.author}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="desc"
              placeholder="Description"
              value={museum.desc}
              onChange={handleInputChange}
            />
            <button type="submit">Add Museum</button>
          </form>
          {/* Display preview of selected image */}
          {previewImgUrl && <img src={previewImgUrl} alt="Preview" className="img-fluid" />}
          {/* File input to select image */}
          <input type="file" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFileModal(false)}>Close</Button>
          {/* Button to upload or update image */}
          <button className="btn btn-info" onClick={handleClickUpload}>{editingImage ? 'Update' : 'Upload'}</button>
        </Modal.Footer>
      </Modal>
      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body>
          <p>Are you sure you want to delete this image?</p>
        </Modal.Body>
        <Modal.Footer>
          {/* Button to confirm deletion */}
          <button className="btn btn-danger" onClick={handleDelete}>Confirm</button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ImageUpload;
