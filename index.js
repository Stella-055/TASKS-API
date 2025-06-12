import express from 'express';

import { PrismaClient } from './prisma/generated/prisma/edge'



const app = express();
app.use(express.json());
const prisma = new PrismaClient();
app.get("/", (_req, res) => {
  res.send(` <h1> Welcome to Tasks manager APi</h1>`);
});

app.post("/create", async (req, res) => {
  try {
    const { title, description, isCompleted } = req.body;
    const task = await prisma.task.create({
      data: { title, description, isCompleted },
    });
    res.status(200);
    res.send({
      message: "Task Created Successfully",
      data: {
        title,
        description,
        isCompleted,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        isCompleted: false,
      },
    });
    res.status(200);
    res.json(tasks);
  } catch (error) {
    res.json({ message: "Something went wrong , please try again later." });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findFirst({
      where: {
        id,
      },
    });
    task ? res.json(task) : res.json({ message: "Task not found." });
  } catch (error) {
    res.json({ message: "Error occurred." });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(" Body:", req.body);

    const { title, description, isCompleted } = req.body;

    const updatedtask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        isCompleted,
      },
    });
    res.json(updatedtask);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error " });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await prisma.task.delete({
      where: {
        id,
      },
    });
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    res.json({ message: "Error deleting task." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running ");
});
