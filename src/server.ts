import app from "./app";
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
