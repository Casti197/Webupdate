export interface Habilidad {
  id: number;
  nombre: string;
  descripcion: string;
  incremento_ataque: number;
  incremento_defensa: number;
  incremento_estamina: number;
}

export interface Personaje {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  ataque: number;
  defensa: number;
  estamina: number;
  habilidades: number[]; // IDs of abilities
}

export const habilidades: Habilidad[] = [
  {
    id: 1,
    nombre: 'Espadazo',
    descripcion: 'Un ataque poderoso con la espada.',
    incremento_ataque: 10,
    incremento_defensa: 0,
    incremento_estamina: -5,
  },
  {
    id: 2,
    nombre: 'Escudo de Hierro',
    descripcion: 'Aumenta la defensa del guerrero.',
    incremento_ataque: 0,
    incremento_defensa: 15,
    incremento_estamina: -3,
  },
  {
    id: 3,
    nombre: 'Flecha Certera',
    descripcion: 'Un disparo preciso que ignora parte de la armadura.',
    incremento_ataque: 12,
    incremento_defensa: 0,
    incremento_estamina: -4,
  },
  {
    id: 4,
    nombre: 'Meditación',
    descripcion: 'Recupera estamina concentrando la energía.',
    incremento_ataque: 0,
    incremento_defensa: -5,
    incremento_estamina: 20,
  },
  {
    id: 5,
    nombre: 'Tormenta Eléctrica',
    descripcion: 'Daño masivo de área a cambio de mucha energía.',
    incremento_ataque: 25,
    incremento_defensa: -10,
    incremento_estamina: -30,
  },
  {
    id: 6,
    nombre: 'Curación Rápida',
    descripcion: 'Un hechizo básico para cerrar heridas.',
    incremento_ataque: 0,
    incremento_defensa: 5,
    incremento_estamina: -10,
  }
];

export const personajes: Personaje[] = [
  {
    id: 1,
    nombre: 'Gagh-Ar',
    tipo: 'guerrero',
    descripcion: 'Un valiente luchador con gran fuerza física.',
    ataque: 80,
    defensa: 70,
    estamina: 60,
    habilidades: [1, 2],
  },
  {
    id: 2,
    nombre: 'Elyra',
    tipo: 'maga',
    descripcion: 'Hechicera con gran dominio de la energía mágica.',
    ataque: 65,
    defensa: 40,
    estamina: 90,
    habilidades: [5, 6],
  },
  {
    id: 3,
    nombre: 'Thalos',
    tipo: 'paladín',
    descripcion: 'Defensor de la luz con armadura impenetrable.',
    ataque: 70,
    defensa: 90,
    estamina: 50,
    habilidades: [2, 6],
  },
  {
    id: 4,
    nombre: 'Sylvanas',
    tipo: 'exploradora',
    descripcion: 'Maestra del arco y el sigilo en el bosque.',
    ataque: 85,
    defensa: 50,
    estamina: 75,
    habilidades: [3, 4],
  },
  {
    id: 5,
    nombre: 'Kael',
    tipo: 'monje',
    descripcion: 'Combatiente ágil que usa su propia energía vital.',
    ataque: 75,
    defensa: 60,
    estamina: 85,
    habilidades: [1, 4],
  },
  {
    id: 6,
    nombre: 'Zog',
    tipo: 'orco',
    descripcion: 'Fuerza bruta pura sin mucha estrategia.',
    ataque: 95,
    defensa: 40,
    estamina: 55,
    habilidades: [1, 2],
  }
];
