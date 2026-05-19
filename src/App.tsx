/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { UserPlus, Trash2, Github, CheckCircle2, ChevronRight, BookOpen, Sword, Zap, Users, Shield, RefreshCw, BarChart2, Info, LogOut, Key } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Habilidad {
  id: number;
  nombre: string;
  descripcion: string;
  incremento_ataque: number;
  incremento_defensa: number;
  incremento_estamina: number;
}

interface Personaje {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  ataque: number;
  defensa: number;
  estamina: number;
  habilidades: number[];
}

interface Usuario {
  id: number;
  username: string;
  correo: string;
  role: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [activeTab, setActiveTab] = useState<"personajes" | "habilidades" | "usuarios">("personajes");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortSkills, setSortSkills] = useState(false);
  const [formNombre, setFormNombre] = useState("");
  const [formTipo, setFormTipo] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [loading, setLoading] = useState(true);

  // Login states
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const charQuery = searchTerm ? `?nombre=${searchTerm}` : "";
      const skillQuery = sortSkills ? "?orden=estamina" : "";
      
      const config = {
        headers: { "Authorization": `Bearer ${token}` }
      };

      const [resP, resH] = await Promise.all([
        fetch(`/api/personajes${charQuery}`, config),
        fetch(`/api/habilidades${skillQuery}`, config)
      ]);

      if (resP.status === 401 || resH.status === 401) {
        handleLogout();
        throw new Error("Sesión expirada");
      }

      if (!resP.ok || !resH.ok) {
        throw new Error("Respuesta de API no exitosa");
      }

      const dataP = await resP.json();
      const dataH = await resH.json();

      setPersonajes(Array.isArray(dataP) ? dataP : []);
      setHabilidades(Array.isArray(dataH) ? dataH : []);

      // Si es admin, traer usuarios también
      if (user?.role === "ADMIN") {
        const resU = await fetch("/api/users", config);
        if (resU.ok) {
          const dataU = await resU.json();
          setUsuarios(Array.isArray(dataU) ? dataU : []);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if ((error as any).message !== "Sesión expirada") {
        setPersonajes([]);
        setHabilidades([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // Fetch user info first to know the role
      fetch("/api/me", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()).then(data => {
        if (data.username) {
          setUser(data);
        }
      }).catch(console.error);
    }
  }, [token]);

  useEffect(() => {
    if (token && user) {
      fetchData();
    }
  }, [token, user, searchTerm, sortSkills]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("token", data.token);
        setToken(data.token);
        setLoginUsername("");
        setLoginPassword("");
        alert("Inicio de sesión exitoso");
      } else {
        setAuthError(data.error || "Error al iniciar sesión");
        alert("No fue posible iniciar sesión: " + (data.error || "Credenciales inválidas"));
      }
    } catch (error) {
      setAuthError("Error de conexión");
      alert("Error de conexión al intentar iniciar sesión");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setPersonajes([]);
    setHabilidades([]);
    setUsuarios([]);
    setActiveTab("personajes");
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim() || !token) return;

    const endpoint = activeTab === "personajes" ? "/api/personajes" : "/api/habilidades";
    const body = activeTab === "personajes" 
      ? { nombre: formNombre, tipo: formTipo, descripcion: formDesc }
      : { nombre: formNombre, descripcion: formDesc };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setFormNombre("");
        setFormTipo("");
        setFormDesc("");
        fetchData();
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    const endpoint = activeTab === "personajes" ? `/api/personajes/${id}` : `/api/habilidades/${id}`;
    try {
      await fetch(endpoint, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-10 rounded-3xl border border-zinc-200 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <span className="font-bold tracking-tight text-2xl text-black">ExpressCourse</span>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Bienvenido de nuevo</h2>
          <p className="text-zinc-500 text-center mb-8 text-sm">Ingresa tus credenciales para acceder al panel</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest ml-1">Usuario</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-zinc-50/50 text-sm font-medium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest ml-1">Contraseña</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="password123"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-zinc-50/50 text-sm font-medium"
                required
              />
            </div>
            
            {authError && (
              <p className="text-red-500 text-xs font-medium text-center">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              <Key className="w-4 h-4" />
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-400 font-medium italic">
              * Usa "admin" y "password123" para la demo
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white text-[#1A1A1A] font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-zinc-200 flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="font-bold tracking-tight text-xl text-black">ExpressCourse</span>
        </div>

        <nav className="flex-1 space-y-10">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Módulo 01</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-xs text-zinc-500 font-medium py-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Hello World API
              </li>
              <li className="flex items-center gap-3 text-xs text-zinc-500 font-medium py-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Desarrollo Guiado
              </li>
              <li className="flex items-center gap-3 text-xs text-black font-semibold py-1">
                <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[8px]">
                  3
                </div>
                Auth & Security
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Usuario</h4>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
                  {user?.username?.[0].toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-black leading-none">{user?.username || "Cargando..."}</p>
                  <p className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-widest mt-1">{user?.role || "USER"}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-zinc-200 text-[10px] font-bold hover:bg-white hover:text-red-500 hover:border-red-100 transition-all"
              >
                <LogOut className="w-3 h-3" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </nav>

        <div className="pt-8 border-t border-zinc-100">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">
            <span>Progreso</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
            <div className="bg-black h-full w-[100%]" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-16 py-12 bg-[#F8F9FA]">
        <header className="mb-12 max-w-3xl">
          <nav className="text-[10px] text-zinc-400 mb-6 uppercase tracking-widest font-bold flex items-center gap-2">
            Backend Development <ChevronRight className="w-3 h-3" /> Auth & Security
          </nav>
          <h1 className="text-5xl font-extrabold tracking-tight mb-8 text-black leading-tight">
            Paso 3 &mdash; Seguridad JWT
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">
            Tu API ahora está protegida. Solo usuarios autenticados con un token válido pueden ver o modificar
            los registros. Las contraseñas se almacenan mediante hash de 10 rondas.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 max-w-6xl">
          {/* Dashboard Control */}
          <section className="space-y-8">
            <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex p-1 bg-zinc-100 rounded-xl">
                <button
                  onClick={() => setActiveTab("personajes")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "personajes" ? "bg-white shadow-sm text-black" : "text-zinc-400 hover:text-zinc-600"}`}
                >
                  <Users className="w-4 h-4" />
                  Personajes
                </button>
                <button
                  onClick={() => setActiveTab("habilidades")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "habilidades" ? "bg-white shadow-sm text-black" : "text-zinc-400 hover:text-zinc-600"}`}
                >
                  <Zap className="w-4 h-4" />
                  Habilidades
                </button>
                {user?.role === "ADMIN" && (
                  <button
                    onClick={() => setActiveTab("usuarios")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "usuarios" ? "bg-white shadow-sm text-black" : "text-zinc-400 hover:text-zinc-600"}`}
                  >
                    <Shield className="w-4 h-4" />
                    Usuarios
                  </button>
                )}
              </div>
              
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest ml-1">Nombre</label>
                    <input
                      type="text"
                      value={formNombre}
                      onChange={(e) => setFormNombre(e.target.value)}
                      placeholder={activeTab === "personajes" ? "Nombre del personaje..." : activeTab === "habilidades" ? "Nombre de la habilidad..." : "Nombre de usuario..."}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-zinc-50/50 text-sm font-medium"
                    />
                  </div>
                  {activeTab === "personajes" && (
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest ml-1">Tipo / Clase</label>
                       <input
                         type="text"
                         value={formTipo}
                         onChange={(e) => setFormTipo(e.target.value)}
                         placeholder="Guerrero, mago, etc..."
                         className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-zinc-50/50 text-sm font-medium"
                       />
                     </div>
                  )}
                  {activeTab !== "usuarios" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest ml-1">Descripción</label>
                      <textarea
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Breve detalle..."
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-zinc-50/50 text-sm font-medium h-20 resize-none"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!formNombre.trim() || activeTab === "usuarios"}
                  className="w-full bg-black text-white py-3.5 rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all disabled:bg-zinc-200 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  {activeTab === "usuarios" ? "Gestión de Usuarios (Admin)" : `Agregar ${activeTab === "personajes" ? "Personaje" : "Habilidad"}`}
                </button>
              </form>
            </div>

            <div className="bg-[#18181B] text-zinc-300 p-8 rounded-2xl shadow-xl overflow-hidden">
               <div className="flex items-center gap-1.5 mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                  <span className="ml-2 text-[10px] text-zinc-500 font-mono">{activeTab === "usuarios" ? "users.controller.ts" : "auth.controller.ts"}</span>
               </div>
               <div className="font-mono text-[10px] md:text-xs leading-relaxed space-y-1">
                  {activeTab === "usuarios" ? (
                    <>
                      <p><span className="text-purple-400">const</span> users = <span className="text-purple-400">await</span> db.Usuario.findAll(</p>
                      <p className="pl-4">&#123; attributes: ['username', 'role'] &#125;</p>
                      <p>);</p>
                      <p className="pt-2 text-zinc-500 italic">// Filtro de seguridad (Token Bearer)</p>
                      <p className="text-zinc-300">if (!token) return res.send(401);</p>
                    </>
                  ) : (
                    <>
                      <p><span className="text-purple-400">const</span> token = jwt.sign(</p>
                      <p className="pl-4">&#123; id: user.id, role: user.role &#125;,</p>
                      <p className="pl-4">process.env.JWT_SECRET,</p>
                      <p className="pl-4">&#123; expiresIn: '1h' &#125;</p>
                      <p>);</p>
                      <p className="pt-2 text-zinc-500 italic">// Hash con salt de 10 rondas</p>
                      <p className="text-zinc-300">bcrypt.hash(password, 10);</p>
                    </>
                  )}
               </div>
            </div>
          </section>

          {/* Records List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">
                Registros Protegidos
              </h3>
              <div className="flex items-center gap-3">
                {activeTab === "personajes" ? (
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-[10px] bg-white border border-zinc-200 rounded-full px-3 py-1 focus:outline-hidden focus:ring-1 focus:ring-black/10 w-32"
                    />
                  </div>
                ) : activeTab === "habilidades" ? (
                  <button 
                    onClick={() => setSortSkills(!sortSkills)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${sortSkills ? "bg-black text-white border-black" : "bg-white text-zinc-600 border-zinc-200"}`}
                  >
                    Estamina ↑
                  </button>
                ) : null}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-xs">
                  <RefreshCw 
                    className={`w-3 h-3 text-zinc-400 cursor-pointer ${loading ? "animate-spin" : ""}`} 
                    onClick={fetchData}
                  />
                  <span className="text-[10px] font-bold text-zinc-800">
                    {activeTab === "personajes" ? personajes.length : activeTab === "habilidades" ? habilidades.length : usuarios.length} items
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {(activeTab === "personajes" ? personajes : activeTab === "habilidades" ? habilidades : usuarios).map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white p-6 rounded-2xl border border-zinc-200 flex flex-col gap-4 hover:border-zinc-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-black group-hover:bg-zinc-100 transition-all">
                          {activeTab === "personajes" ? <Shield className="w-6 h-6" /> : activeTab === "habilidades" ? <Zap className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                        </div>
                        <div>
                          <span className="text-sm font-bold tracking-tight text-zinc-800 leading-none block lowercase first-letter:uppercase">{"nombre" in item ? item.nombre : (item as Usuario).username}</span>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-500">
                              {activeTab === "personajes" ? (item as Personaje).tipo : activeTab === "habilidades" ? "Habilidad" : (item as Usuario).role}
                            </span>
                          </div>
                        </div>
                      </div>
                      {activeTab !== "usuarios" && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-zinc-200 hover:text-black hover:bg-zinc-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {activeTab !== "usuarios" && (item as any).descripcion && (
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium flex gap-2 items-start">
                          <Info className="w-3 h-3 mt-0.5 shrink-0" />
                          {(item as any).descripcion}
                        </p>
                      )}
                      
                      {activeTab === "usuarios" && (
                        <p className="text-[10px] text-zinc-400 font-mono flex gap-2 items-center">
                          <BookOpen className="w-3 h-3" />
                          {(item as Usuario).correo}
                        </p>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        {activeTab === "personajes" ? (
                          <>
                            <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                              <span className="text-[8px] uppercase tracking-tighter text-zinc-400 block font-bold mb-1">Ataque</span>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-700">{(item as Personaje).ataque}</span>
                                <BarChart2 className="w-3 h-3 text-red-300" />
                              </div>
                            </div>
                            <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                              <span className="text-[8px] uppercase tracking-tighter text-zinc-400 block font-bold mb-1">Defensa</span>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-700">{(item as Personaje).defensa}</span>
                                <BarChart2 className="w-3 h-3 text-blue-300" />
                              </div>
                            </div>
                            <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                              <span className="text-[8px] uppercase tracking-tighter text-zinc-400 block font-bold mb-1">Estamina</span>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-700">{(item as Personaje).estamina}</span>
                                <BarChart2 className="w-3 h-3 text-green-300" />
                              </div>
                            </div>
                          </>
                        ) : activeTab === "habilidades" ? (
                          <>
                            <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                              <span className="text-[8px] uppercase tracking-tighter text-zinc-400 block font-bold mb-1">Inc. Atq</span>
                              <span className="text-xs font-bold text-zinc-700">+{(item as Habilidad).incremento_ataque}</span>
                            </div>
                            <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                              <span className="text-[8px] uppercase tracking-tighter text-zinc-400 block font-bold mb-1">Inc. Def</span>
                              <span className="text-xs font-bold text-zinc-700">+{(item as Habilidad).incremento_defensa}</span>
                            </div>
                            <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                              <span className="text-[8px] uppercase tracking-tighter text-zinc-400 block font-bold mb-1">Inc. Est</span>
                              <span className="text-xs font-bold text-zinc-700">{(item as Habilidad).incremento_estamina}</span>
                            </div>
                          </>
                        ) : (
                           <div className="col-span-3 py-1 flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${(item as Usuario).role === "ADMIN" ? "bg-emerald-500 animate-pulse" : "bg-zinc-300"}`}></div>
                             <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Status: Active</span>
                           </div>
                        )}
                      </div>
                      
                      {activeTab === "personajes" && (item as Personaje).habilidades && (item as Personaje).habilidades.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                           {(item as Personaje).habilidades.map(hId => {
                             const h = habilidades.find(hab => hab.id === hId);
                             return h ? (
                               <span key={hId} className="text-[8px] font-bold text-black border border-black/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                 <Zap className="w-2 h-2" /> {h.nombre}
                               </span>
                             ) : null;
                           })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {((activeTab === "personajes" ? personajes : activeTab === "habilidades" ? habilidades : usuarios).length === 0 && !loading) && (
                <div className="py-20 text-center bg-white border border-zinc-200 border-dashed rounded-3xl">
                  <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sword className="w-5 h-5 text-zinc-200" />
                  </div>
                  <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                    Sin registros en {activeTab}
                  </p>
                </div>
              )}
            </div>
          </section>

        </div>

        <footer className="mt-20 max-w-6xl flex items-center justify-between text-[11px] text-zinc-400 font-bold uppercase tracking-[0.2em] pt-8 border-t border-zinc-100">
          <div>Páginas 24 - 32</div>
          <div className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-black transition-colors">Anterior</span>
            <span className="text-zinc-200 font-normal">|</span>
            <span className="cursor-pointer hover:text-black transition-colors">Siguiente &rarr;</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
