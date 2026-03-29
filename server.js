// server.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));



// error handler 
const { notFound, errorHandler } = require('./middlewares/errors');

// ===== Routes =====
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointment.routes');
const medicalRecordRoutes = require('./routes/medicalRecord.routes');

app.use('/api/auth', authRoutes);   
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);

// error handler 
app.use(notFound);
app.use(errorHandler);

// ===== HTTP Server & Socket.IO =====
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Store connected users in memory (userId -> socketId)
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  // Join room for specific user
  socket.on('joinRoom', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
  });  

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
    // Remove from onlineUsers map
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
  });
});


// ===== Example: emit new appointment notification =====
// Call this function in your appointment controller after creating an appointment
global.emitNewAppointment = (appointment) => {
  const doctorSocketId = onlineUsers.get(appointment.doctor.toString());
  const patientSocketId = onlineUsers.get(appointment.patient.toString());

  if (doctorSocketId) {
    io.to(doctorSocketId).emit('new-appointment', appointment);
  }

  if (patientSocketId) {
    io.to(patientSocketId).emit('new-appointment', appointment);
  }
};

// ===== Default Route =====
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ===== Error Handling =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));