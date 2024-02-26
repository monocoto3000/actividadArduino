// server.js
import express from "express";
import http from "http";
import { Server as socketIo } from "socket.io";
import mqtt from "mqtt";
import chalk from "chalk";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
    optionsSuccessStatus: 204,
  },
});
const consumer = mqtt.connect(
  "mqtt://broker.hivemq.com"
);

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log(chalk.green("Cliente conectado"));
  consumer.subscribe("equipo/animales/gecko");
  consumer.on("message", (topic, message) => {
    const msg = `${topic}: ${message}`;

    // Transformar el mensaje en un objeto antes de enviarlo al cliente
    const parsedMessage = parseMqttMessage(message);

    console.log(
      chalk.cyan(
        "--------------------------------------------------------------"
      )
    );
    console.log(
      chalk.blue("Mensaje recibido en el topic: ") + chalk.rgb(0, 164, 223)(msg)
    );

    // Enviar el objeto al cliente React
    socket.emit("mqttMessage", parsedMessage);
  });
  socket.on("disconnect", () => {
    console.log(chalk.red("Cliente desconectado"));
  });
});

server.listen(3001, () => {
  console.log(chalk.yellow("Servidor Express escuchando en el puerto 3001"));
});

consumer.on("connect", () => {
  console.log(chalk.green("Consumidor MQTT conectado"));
});

consumer.on("close", () => {
  console.log(chalk.red("Consumidor MQTT desconectado"));
});

// Función para transformar el mensaje MQTT en un objeto
function parseMqttMessage(message) {
  try {
    // Supongamos que el mensaje es una cadena JSON válida
    return JSON.parse(message);
  } catch (error) {
    console.error("Error al analizar el mensaje MQTT:", error);
    return {}; // Devuelve un objeto vacío en caso de error
  }
}
