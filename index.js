const express = require('express');
const admin = require('firebase-admin');
require('dotenv').config();

// Inicializar Firebase con las credenciales de la cuenta de servicio
const serviceAccount = require('./alpura-59b03-firebase-adminsdk-lka6k-b0068ff0bc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://alpura-59b03-default-rtdb.firebaseio.com/"
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta para comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor ejecutándose correctamente');
});

/// --- Manejo de Productos --- ///

// Ruta para mostrar todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productosSnapshot = await db.collection('productos').get();
    const productos = productosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).send('Error al obtener los productos: ' + error.message);
  }
});

// Ruta para agregar un nuevo producto
app.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = req.body;
    const productoRef = await db.collection('productos').add(nuevoProducto);
    res.status(201).send(`Producto agregado con ID: ${productoRef.id}`);
  } catch (error) {
    res.status(500).send('Error al agregar el producto: ' + error.message);
  }
});

// Ruta para buscar un producto por ID
app.get('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const productoDoc = await db.collection('productos').doc(id).get();
    if (!productoDoc.exists) {
      return res.status(404).send('Producto no encontrado');
    }
    res.status(200).json({ id: productoDoc.id, ...productoDoc.data() });
  } catch (error) {
    res.status(500).send('Error al buscar el producto: ' + error.message);
  }
});

// Ruta para borrar un producto por ID
app.delete('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('productos').doc(id).delete();
    res.status(200).send(`Producto con ID ${id} eliminado`);
  } catch (error) {
    res.status(500).send('Error al borrar el producto: ' + error.message);
  }
});

/// --- Manejo de Usuarios --- ///

// Ruta para mostrar todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuariosSnapshot = await db.collection('ejemploBD').get();
    const usuarios = usuariosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).send('Error al obtener los usuarios: ' + error.message);
  }
});

// Ruta para agregar un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const nuevoUsuario = req.body;
    const usuarioRef = await db.collection('ejemploBD').add(nuevoUsuario);
    res.status(201).send(`Usuario agregado con ID: ${usuarioRef.id}`);
  } catch (error) {
    res.status(500).send('Error al agregar el usuario: ' + error.message);
  }
});

// Ruta para buscar un usuario por ID
app.get('/usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const usuarioDoc = await db.collection('ejemploBD').doc(id).get();
    if (!usuarioDoc.exists) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.status(200).json({ id: usuarioDoc.id, ...usuarioDoc.data() });
  } catch (error) {
    res.status(500).send('Error al buscar el usuario: ' + error.message);
  }
});

// Ruta para borrar un usuario por ID
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('ejemploBD').doc(id).delete();
    res.status(200).send(`Usuario con ID ${id} eliminado`);
  } catch (error) {
    res.status(500).send('Error al borrar el usuario: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
