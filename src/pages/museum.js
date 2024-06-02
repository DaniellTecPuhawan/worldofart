import React, { useState, useEffect } from 'react';
import { ImageDb } from '../firebase';
import { uploadBytes, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 } from "uuid";
import { Modal, Button } from 'react-bootstrap'; // Importa Modal y Button de React Bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import '../css/styles.css';

function ImageUpload(){

  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [modalImgUrl, setModalImgUrl] = useState(''); // Estado para almacenar la URL de la imagen seleccionada
  const [showUpdateButton, setShowUpdateButton] = useState(false); // Estado para controlar la visibilidad del botón "Update"

  const handleClickUpload = () => {
    if (img !== null) {
      const imgRef = ref(ImageDb, editingImage ? `files/${editingImage.id}` : `files/${v4()}`);
      uploadBytes(imgRef, img).then(() => {
        setImg(null);
        setEditingImage(null);
        listImages(); // Llamar a listImages para actualizar la lista después de subir una imagen
      }).catch(error => console.error('Error uploading image:', error));
    }
  };

  const listImages = () => {
    listAll(ref(ImageDb, "files")).then(imgs => {
      const promises = imgs.items.map(val =>
        getDownloadURL(val).then(url => ({ url, ref: val }))
      );
      Promise.all(promises).then(imageUrls => {
        setImgUrl(imageUrls); // Actualizar la lista de imágenes
      });
    }).catch(error => console.error('Error listing images:', error));
  };

  const handleDelete = (ref, index) => {
    deleteObject(ref).then(() => {
      listImages(); // Llamar a listImages para actualizar la lista después de eliminar una imagen
    }).catch(error => console.error('Error deleting image:', error));
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setShowUpdateButton(true); // Mostrar el botón "Update" independientemente de la edición
  };

  // Función para mostrar el modal y establecer la URL de la imagen seleccionada
  const handleShowModal = (imageUrl) => {
    setModalImgUrl(imageUrl);
    setShowModal(true);
  };

  useEffect(() => {
    listImages(); // Llamar a listImages al montar el componente para obtener las imágenes iniciales
  }, []);

  return(
    <div className="container">
      <div className="row">
        <div className="col">
          <input type="file" onChange={(e) => setImg(e.target.files[0])} />
        </div>
        <div className="col">
          <button className="btn btn-info" onClick={handleClickUpload}>{editingImage ? 'Update' : 'Upload'}</button>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {imgUrl.map((data, index) => (
          <div className="col" key={index}>
            <div className="card">
              <img src={data.url} className="card-img-top" alt={`image_${index}`} onClick={() => handleShowModal(data.url)} /> {/* Agrega onClick para mostrar el modal */}
              <div className="card-body">
                <button className="btn btn-danger" onClick={() => handleDelete(data.ref, index)}>Delete</button>
                <button className="btn btn-primary" onClick={() => handleEdit({ id: index, ref: data.ref })}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <img src={modalImgUrl} alt="modal-img" style={{ width: '100%' }} /> {/* Muestra la imagen dentro del modal */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ImageUpload;
