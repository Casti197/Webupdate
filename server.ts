import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import db from "./models/index.js";
import personajesRouter from "./src/routes/personajes.js";
import usuariosRouter from "./src/routes/usuarios.js";
import habilidadesRouter from "./src/routes/habilidades.js";
import authRouter from "./src/routes/auth.js";
import { verifyToken } from "./src/middlewares/authJwt.js";
import { requireRole } from "./src/middlewares/requireRole.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(express.json());

  app.post("/api/test", (req, res) => res.json({ ok: true }));

  app.get('/authors', (req, res) => {
    res.json([
      { nombre: 'Alejo Castiblanco', codigo: '2024001' },
      { nombre: 'Compañero IA', codigo: '2024002' },
    ]);
  });

  // API Routes
  app.use("/api", authRouter);
  console.log("Auth router montado");
  console.log("Rutas registradas:", authRouter.stack.map((r: any) => r.route?.path));

  app.use("/api/personajes", verifyToken, personajesRouter);
  app.use("/api/users", verifyToken, requireRole("ADMIN"), usuariosRouter);
  app.use("/api/habilidades", verifyToken, habilidadesRouter);


  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global Error Handler (siempre al final)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  });

  try {
    // Verifica conexión
    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: false }); // crea las tablas si no existen
    
    // Crear admin por defecto si no existe
    const adminUser = await db.Usuario.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      await db.Usuario.create({
        username: 'admin',
        correo: 'admin@example.com',
        password: 'password123', // El hook del modelo lo hasheará
        role: 'ADMIN'
      });
      console.log('Usuario admin creado: (admin / password123)');
    } else if (adminUser.role !== 'ADMIN') {
      adminUser.role = 'ADMIN';
      await adminUser.save();
      console.log('Rol de usuario admin actualizado a ADMIN');
    }

    console.log('Base de datos conectada correctamente.');
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

startServer();
