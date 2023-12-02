import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

let userPosts = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("index.ejs", { userPosts });
});

app.get("/create", (req, res) => {
  res.render("create.ejs", { userPosts });
});

app.post("/create", (req, res) => {
  const blogTitle = req.body["inputTitle"];
  const blogContent = req.body["content"];
  const blogAutor = req.body["autor"];
  userPosts.push({ blogTitle, blogContent, blogAutor });

  console.log(userPosts);

  res.render("index.ejs", { blogTitle, blogContent, blogAutor, userPosts });
});

app.get("/edit/:index", (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < userPosts.length) {
    const postToEdit = { ...userPosts[index], index }; // Añade el índice al objeto
    res.render("edit.ejs", { postToEdit });
  } else {
    res.status(404).send("Post no encontrado");
  }
});

app.post("/edit/:index", (req, res) => {
  const index = req.params.index;

  if (index >= 0 && index < userPosts.length) {
    // Actualizar solo el título y el contenido del post en el índice dado
    userPosts[index].blogTitle = req.body["inputTitle"];
    userPosts[index].blogContent = req.body["content"];
    userPosts[index].blogAutor = req.body["autor"];

    res.redirect("/");
  } else {
    res.status(404).send("Post no encontrado");
  }
});

app.delete("/delete/:index", (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < userPosts.length) {
    // Eliminar el elemento del arreglo userPosts en el índice dado
    userPosts.splice(index, 1);
    res.redirect("/");
  } else {
    res.status(404).send("No se encontró el elemento para eliminar");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
