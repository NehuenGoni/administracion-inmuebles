const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

const getUserData = async (req, res) => {
    console.log('test')
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');

    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos del usuario' });
  }
};

module.exports = {
  register,
  login,
  getUserData
};