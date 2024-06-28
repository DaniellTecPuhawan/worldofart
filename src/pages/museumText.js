import React, { useState, useEffect } from "react";

const Form = () => {
  const [museum, setMuseum] = useState({
    title: "",
    author: "",
    desc: ""
  });

  const [museumData, setMuseumData] = useState([]);

  useEffect(() => {
    // Función para obtener los datos de Firebase
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://world-of-art-app-default-rtdb.firebaseio.com/museumData.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data from Firebase");
        }
        const data = await response.json();
        // Convertir el objeto de objetos a un array de objetos
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

  const data = (e) => {
    const { name, value } = e.target;
    setMuseum((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(museum);
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
      setMuseum({ title: "", author: "", desc: "" }); // Limpiar el formulario después de enviar los datos
    } catch (error) {
      console.error("Error adding museum:", error);
      alert("Error adding museum. Please try again.");
    }
  };

  return (
    <div className="form">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={museum.title}
            onChange={data}
          />
          <input
            type="text"
            name="author"
            placeholder="author"
            value={museum.author}
            onChange={data}
          />
          <input
            type="text"
            name="desc"
            placeholder="desc"
            value={museum.desc}
            onChange={data}
          />
          <button type="submit">Create User</button>
        </form>
      </div>

      {/* Mostrar los datos recuperados de Firebase */}
      <div className="museum-list">
        <h2>Museum List</h2>
        {museumData.map((item) => (
          <div key={item.id} className="museum-item">
            <h3>Title: {item.title}</h3>
            <p>Author: {item.author}</p>
            <p>Description: {item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form;
