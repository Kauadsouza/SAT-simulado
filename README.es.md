# Idiomas

[English](README.md) · [Português](README.pt-BR.md) · **Español**

Un espacio de estudio de idiomas hecho para el uso real, no como una colección de ejercicios. Cubre **inglés** y **español**, y cada idioma se divide en dos frentes: el **estudio diario** y la **preparación para exámenes**.

[Abrir la aplicación](https://sat-simulado.vercel.app)

![Panel de estudio](english-desktop.png)

---

## Por qué existe

Las aplicaciones de idiomas suelen fallar de dos maneras: se convierten en una lista infinita de ejercicios sin rumbo, o en un simulacro que mide pero no enseña. Aquí ambas cosas conviven sin estorbarse — el plan diario está separado de las pistas de examen, y el progreso siempre es del estudiante, guardado primero en su propio dispositivo.

## Inglés

**Estudio** — plan diario ajustable (nivel, minutos por sesión, días por semana), cursos gratuitos con seguimiento, práctica de lectura y vocabulario, conversación con un contexto listo para un tutor de IA, y repetición espaciada para repasar en el intervalo adecuado.

**Exámenes** — pistas dedicadas de **SAT**, **ACT** y **TOEFL**, además de un simulacro con el formato del SAT digital: Reading & Writing y Math, con el segundo módulo adaptándose al rendimiento del primero, cronómetro, navegación entre preguntas, eliminación de opciones, marcado para revisión y hoja de fórmulas.

El inglés además elige entre variedad **británica** y **estadounidense**, y eso cambia vocabulario, pronunciación y ejemplos — no es solo una etiqueta.

## Español

**Estudio** — el mismo formato de plan diario, ocho recursos gratuitos seleccionados y verificados uno a uno (Language Transfer, Dreaming Spanish, tres del Instituto Cervantes, UT Austin, SpanishDict y Conjuguemos), frases por nivel con audio, y conversación con un contexto que indica al tutor corregir el *portuñol* de forma específica.

**Exámenes** — simulacro propio con preguntas de comprensión lectora, vocabulario en contexto, gramática en uso y **falsos amigos**, que es donde más se equivoca quien habla portugués. Cada pregunta explica su respuesta, y el historial de intentos queda guardado.

La variedad puede ser **España** o **América Latina**, lo que cambia pronunciación y vocabulario.

## Decisiones técnicas que merecen mención

- **Local primero.** Todo el progreso vive en el IndexedDB del dispositivo y funciona sin cuenta. La sincronización en la nube es opcional y usa la misma sesión autenticada de ARTX Hub: no hay una segunda contraseña.
- **Sincronización con detección de conflictos.** La escritura compara revisiones, así que dos pestañas o dos dispositivos nunca se sobrescriben en silencio.
- **Un registro, dos idiomas.** Inglés y español comparten el mismo registro sincronizado, con pruebas que garantizan que guardar uno nunca borre el otro.
- **La credencial de IA nunca llega al navegador.** La generación de contenido pasa por un endpoint del servidor; la clave se queda allí.
- **Aislamiento por cuenta.** Cada cuenta aprobada abre su propia base local, con el identificador validado antes de convertirse en nombre de base de datos.

## Tecnologías

React 19, TypeScript, Vite, Tailwind CSS, Zustand, Dexie/IndexedDB, Supabase, Vitest, Recharts y KaTeX.

## Desarrollo local

```powershell
npm.cmd install
npm.cmd run dev
```

Configuración opcional:

| Variable | Para qué sirve |
| --- | --- |
| `LLM_BASE_URL` | Endpoint compatible con OpenAI, usado en el servidor |
| `LLM_MODEL` | Identificador del modelo |
| `LLM_API_KEY` | Credencial del proveedor — nunca expuesta al navegador |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase (opcional) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública para la sincronización autenticada |

Copia `.env.example` a `.env.local`. Nunca subas claves reales.

## Verificación

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
npm.cmd audit --omit=dev
```

## Mapa del repositorio

```text
api/              Endpoint de generación de contenido
src/components/   Interfaz compartida de estudio y examen
src/data/         Contenido y bancos de preguntas (inglés y español)
src/lib/          Almacenamiento, sincronización, corrección y motores de estudio
src/pages/        Pantallas de estudio, examen y progreso
src/store/        Estado del usuario y del examen en curso
tests/            Pruebas de almacenamiento, estudio y regresión
```

## Aviso académico

Proyecto educativo independiente, sin vínculo con College Board, ACT, ETS ni el Instituto Cervantes. La puntuación de los simulacros es una aproximación para práctica y no debe presentarse como nota oficial. El simulacro de español es de autoría propia y aún no está anclado a ningún examen oficial concreto.

## Estado

En uso activo. El modo local funciona sin cuenta; la sincronización entre dispositivos y la generación de ejercicios dependen de que sus servicios opcionales estén configurados.

Creado y mantenido por [Kauã Diniz Souza](https://github.com/Kauadsouza).
