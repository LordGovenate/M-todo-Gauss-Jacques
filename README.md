
# Calculadora de Inversa Modular ✨  
> App web para invertir matrices módulo **m** usando el método Gauss‑Jacques y mostrar **cada** paso con estilo minimalista‑dashboard.

---

## 🚀 Funcionalidades

| Característica | Descripción |
| -------------- | ----------- |
| Generación de matriz | Introduce **N** (1‑100) o pulsa **Generar matriz aleatoria** para llenarla con valores 1‑99 |
| Cálculo paso a paso | Se destaca el pivote, la fila objetivo y se explican swaps, inversos y coeficientes Bézout |
| Resultado claro | Si la matriz es invertible muestra **K⁻¹ mod m**, si no, explica la razón |
| 100 % Frontend | Solo **HTML + CSS + JS** (sin build, sin backend) — abre el `index.html` y listo |

---

## 🗂 Estructura

```
📁 raiz/
├─ index.html   # Maquetado + carga de fuentes Google (Inter)
├─ styles.css   # Tema claro tipo dashboard: tarjetas, sombras suaves y resaltado de pasos
├─ script.js    # Lógica Gauss‑Jacques (con Euclides Extendido) 🇪🇸
└─ README.md    # Este documento 📖
```

---

## 📐 Algoritmo Gauss‑Jacques (resumen exprés)

1. Construir la aumentada **[K | I]**  
2. Por columna *i*:
   * Elegir pivote con `gcd(pivote, m) = 1` (swap filas si hace falta)  
   * Hallar `pivote⁻¹ mod m` vía Euclides Extendido  
   * Escalar fila pivote → deja un `1`  
   * Eliminar resto de la columna con operaciones fila *mod m*  
3. Cuando la izquierda es `I`, la derecha es **K⁻¹ mod m** 🎉

Detalles pedagógicos (series `q` y `x`) se imprimen en pantalla.

---

## ▶️ Uso rápido

1. Abre `index.html` en tu navegador moderno (Chrome, Firefox, Edge, Safari…).  
2. Ajusta **N** y **m**, llena la matriz o pulsa aleatorio, luego **Calcular inversa**.  
3. Observa la coreografía matemática y copia la matriz resultante.

> 💡 Consejo: si vas a integrar esto en una lección, proyecta la página; las filas y celdas resaltadas ayudan a seguir el proceso en vivo.

---

## 🎨 Personalización

* Cambia la paleta en `styles.css`  
* Ajusta el rango de **N** en el listener de `sizeInput` en `script.js`  
* Edita textos/mensajes directamente en `script.js` (idioma o tono)

---

## 📝 Licencia

MIT.  Govenate!

---

## ✨ Autoría

Hecho con ☕ y <3 por **[Govenate]** — inspirado en tardes de álgebra abstracta.
