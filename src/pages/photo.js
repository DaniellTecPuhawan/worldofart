import React, { useEffect, useState } from 'react';

const Paint = () => {
    // Estado para almacenar los datos obtenidos de MongoDB
    const [wofDatas, setwofDatas] = useState(null);

    // Estado para almacenar el formulario de entrada
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        story: '',
        type: '',
        range: '',
        movementSpeed: '',
        Enchantment: ''
    });

    // Estado para almacenar el elemento que se está editando
    const [editingItem, setEditingItem] = useState(null);

    // Función para manejar cambios en el formulario de entrada
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Función para enviar el formulario al backend y crear o actualizar un elemento
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                // Si hay un elemento en edición, realizamos una solicitud PUT para actualizarlo
                await fetch(`/wofdata/${editingItem._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                // Actualizar el estado para reflejar los cambios
                setwofDatas(wofDatas.map(item => (item._id === editingItem._id ? formData : item)));
                // Limpiar el formulario y el estado de edición
                setFormData({
                    name: '',
                    title: '',
                    story: '',
                    type: '',
                    range: '',
                    movementSpeed: '',
                    Enchantment: ''
                });
                setEditingItem(null);
            } else {
                // Si no hay un elemento en edición, realizamos una solicitud POST para crear uno nuevo
                const response = await fetch('/wofdata', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                // Actualizar el estado con el nuevo elemento
                setwofDatas([...wofDatas, data]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para manejar la eliminación de un elemento
    const handleDelete = async (id) => {
        try {
            await fetch(`/wofdata/${id}`, {
                method: 'DELETE'
            });
            // Filtrar los datos para eliminar el elemento eliminado
            setwofDatas(wofDatas.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para manejar la edición de un elemento
    const handleEdit = (item) => {
        // Rellenar el formulario con los detalles del elemento que se está editando
        setFormData({
            name: item.name,
            title: item.title,
            story: item.story,
            type: item.type,
            range: item.range,
            movementSpeed: item.movementSpeed,
            Enchantment: item.Enchantment
        });
        // Actualizar el estado de edición con el elemento seleccionado
        setEditingItem(item);
    };

    // Función para obtener todos los elementos de MongoDB al cargar la página
    useEffect(() => {
        const fetchwofDatas = async () => {
            const response = await fetch('/wofdata');
            const json = await response.json();

            if(response.ok){
                setwofDatas(json);
            }  
        }
        fetchwofDatas(); 
    }, []);

    return( 

        <div> 
            <h1>Data from MongoDB</h1> 
            {/* Formulario para crear o editar un elemento */}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
                <input type="text" name="story" placeholder="Story" value={formData.story} onChange={handleChange} />
                <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} />
                <input type="text" name="range" placeholder="Range" value={formData.range} onChange={handleChange} />
                <input type="text" name="movementSpeed" placeholder="Movement Speed" value={formData.movementSpeed} onChange={handleChange} />
                <input type="text" name="Enchantment" placeholder="Enchantment" value={formData.Enchantment} onChange={handleChange} />
                <button type="submit">{editingItem ? 'Update' : 'Create'}</button>
            </form>
            
            <div className="container">
            <div className="row">
                {wofDatas &&
                    wofDatas.map((wofData) => (
                        <div className="col-sm-6 col-md-4 col-lg-3" key={wofData._id}>
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">{wofData.name}</h5>
                                    <p className="card-text">{wofData.title}</p>
                                    <p className="card-text">{wofData.story}</p>
                                    <p className="card-text">{wofData.type}</p>
                                    <p className="card-text">{wofData.range}</p>
                                    <p className="card-text">{wofData.movementSpeed}</p>
                                    <p className="card-text">{wofData.Enchantment}</p>
                                    {/* Botones para editar y borrar elementos */}
                                    <button className="btn btn-primary" onClick={() => handleEdit(wofData)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(wofData._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>

        </div> 
    );
};

export default Paint;
