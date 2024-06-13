db.runCommand({
    collMod: 'posts', // Modifica la colección llamada 'posts'
    validator: {
      $jsonSchema: {
        bsonType: 'object', // El documento debe ser un objeto
        required: ['title', 'text', 'creator', 'comments'], // Estos campos son obligatorios
        properties: {
          title: {
            bsonType: 'string', // El campo 'title' debe ser una cadena de texto
            description: 'must be a string and is required' // Descripción del campo 'title'
          },
          text: {
            bsonType: 'string', // El campo 'text' debe ser una cadena de texto
            description: 'must be a string and is required' // Descripción del campo 'text'
          },
          creator: {
            bsonType: 'objectId', // El campo 'creator' debe ser un ObjectId
            description: 'must be an objectid and is required' // Descripción del campo 'creator'
          },
          comments: {
            bsonType: 'array', // El campo 'comments' debe ser un array
            description: 'must be an array and is required', // Descripción del campo 'comments'
            items: {
              bsonType: 'object', // Los elementos del array 'comments' deben ser objetos
              required: ['text', 'author'], // Estos campos son obligatorios dentro de cada comentario
              properties: {
                text: {
                  bsonType: 'string', // El campo 'text' dentro de 'comments' debe ser una cadena de texto
                  description: 'must be a string and is required' // Descripción del campo 'text' dentro de 'comments'
                },
                author: {
                  bsonType: 'objectId', // El campo 'author' dentro de 'comments' debe ser un ObjectId
                  description: 'must be an objectid and is required' // Descripción del campo 'author' dentro de 'comments'
                }
              }
            }
          }
        }
      }
    },
    validationAction: 'warn' // La acción de validación será 'warn' (advertir en lugar de rechazar)
  });
  