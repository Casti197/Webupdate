import { Router } from "express";

const userRouter = Router();

// In-memory data store
interface User {
  id: number;
  name: string;
}

let users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

userRouter.get("/", (req, res) => {
  res.json(users);
});

userRouter.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  const newUser = { id: Date.now(), name };
  users.push(newUser);
  res.status(201).json(newUser);
});

userRouter.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter((u) => u.id !== id);
  res.status(204).send();
});

export default userRouter;
