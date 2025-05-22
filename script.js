// script.js: Lógica de la calculadora de inversa modular usando el método Gauss-Jacques
(function() {
  'use strict';

  // Selección de elementos del DOM para interacción
  const sizeInput = document.getElementById('sizeInput');
  const modInput = document.getElementById('modInput');
  const randBtn = document.getElementById('randBtn');
  const calcBtn = document.getElementById('calcBtn');
  const matrixTable = document.getElementById('matrixInput');
  const stepsDiv = document.getElementById('steps');
  
  /**
   * Crea dinámicamente una tabla de inputs NxN para la matriz de entrada.
   * Borra la tabla existente y genera filas/columnas según el valor N.
   */
  function createMatrixInputs(N) {
    matrixTable.innerHTML = ''; // Limpiar contenido anterior de la tabla
    for (let i = 0; i < N; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < N; j++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.value = '0';  // valor inicial por defecto
        input.style.width = '50px';
        input.style.textAlign = 'center';
        // Evitar que la rueda del ratón cambie el valor por accidente
        input.addEventListener('wheel', e => e.preventDefault());
        cell.appendChild(input);
        row.appendChild(cell);
      }
      matrixTable.appendChild(row);
    }
  }

  // Inicializar la matriz de entrada con el tamaño por defecto (N=3)
  createMatrixInputs(parseInt(sizeInput.value, 10));

  /**
   * Evento: al cambiar el valor de N (sizeInput), regenerar la tabla NxN.
   * Aseguramos N en el rango [1,100].
   */
  sizeInput.addEventListener('change', () => {
    let N = parseInt(sizeInput.value, 10);
    if (isNaN(N) || N < 1) {
      N = 1;
      sizeInput.value = 1;
    } else if (N > 100) {
      N = 100;
      sizeInput.value = 100;
    }
    createMatrixInputs(N);
  });

  /**
   * Rellena la matriz con números aleatorios entre 1 y 99, y luego ejecuta el cálculo.
   */
  function fillRandomAndCalculate() {
    const N = parseInt(sizeInput.value, 10);
    // Llenar cada celda con un número aleatorio de 1 a 99
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const cellInput = matrixTable.rows[i].cells[j].querySelector('input');
        cellInput.value = Math.floor(Math.random() * 99) + 1;
      }
    }
    // Después de generar la matriz aleatoria, calcular la inversa automáticamente
    calculateInverse();
  }

  // Evento: botón para generar matriz aleatoria
  randBtn.addEventListener('click', fillRandomAndCalculate);

  /**
   * Algoritmo extendido.
   * Dado a y m, calcula el MCD y los coeficientes x, y tales que: a*x + m*y = gcd.
   * Además devuelve las series de cocientes (qSeries) y de coeficientes x (xSeries).
   */
  function extendedEuclid(a, m) {
    let old_r = a, r = m;
    let old_s = 1, s = 0;
    let old_t = 0, t = 1;
    const qSeries = [];
    const xSeries = [1]; // Serie de coeficientes x (inicialmente 1 para 'a')
    while (r !== 0) {
      const q = Math.floor(old_r / r);
      qSeries.push(q);
      // Actualizar restos
      let temp = r;
      r = old_r - q * r;
      old_r = temp;
      // Actualizar coeficientes s (para 'a')
      temp = s;
      s = old_s - q * s;
      old_s = temp;
      // Actualizar coeficientes t (para 'm')
      temp = t;
      t = old_t - q * t;
      old_t = temp;
      if (r !== 0) {
        xSeries.push(old_s);  // Guardar coeficiente x (para 'a') antes de siguiente iteración
      }
    }
    // old_r es el gcd(a, m), old_s es x, old_t es y
    return { gcd: old_r, x: old_s, y: old_t, qSeries: qSeries, xSeries: xSeries };
  }

  /**
   * Función principal: calcula la inversa modular de la matriz de entrada usando el método Gauss-Jacques.
   * Muestra paso a paso el proceso de eliminación en el elemento 'stepsDiv'.
   */
  function calculateInverse() {
    stepsDiv.innerHTML = '';  // Limpiar pasos anteriores
    const N = parseInt(sizeInput.value, 10);
    const m = parseInt(modInput.value, 10);
    // Validar entradas
    if (isNaN(N) || N < 1 || isNaN(m) || m === 0) {
      return;
    }

    // Leer matriz de inputs y aplicar módulo m a cada valor
    const K = [];
    for (let i = 0; i < N; i++) {
      K[i] = [];
      for (let j = 0; j < N; j++) {
        let val = parseInt(matrixTable.rows[i].cells[j].querySelector('input').value, 10);
        if (isNaN(val)) val = 0;
        // Asegurar valor positivo en [0, m-1]
        val = ((val % m) + m) % m;
        K[i][j] = val;
      }
    }

    // Construir la matriz aumentada [K | I]
    let aug = [];
    for (let i = 0; i < N; i++) {
      aug[i] = [];
      for (let j = 0; j < N; j++) {
        aug[i][j] = K[i][j];            // parte izquierda K
        aug[i][j + N] = (i === j ? 1 : 0); // parte derecha I (identidad)
      }
    }

    /**
     * Genera el HTML de una matriz aumentada para mostrar en pantalla.
     * Parámetros opcionales para resaltar fila pivote y fila objetivo.
     * - pivotIndex: columna del pivote actual
     * - pivotRowIndex: fila del pivote
     * - targetRowIndex: fila que se está eliminando
     */
    function matrixToHTML(augMatrix, pivotIndex = -1, pivotRowIndex = -1, targetRowIndex = -1) {
      let html = '<table class="matrix">';
      const size = augMatrix.length;
      for (let i = 0; i < size; i++) {
        // Determinar clases CSS para la fila
        let rowClass = '';
        if (i === pivotRowIndex && pivotRowIndex === targetRowIndex) {
          // Si la fila pivote es también la fila objetivo (caso especial)
          rowClass = 'pivot-row target-row';
        } else if (i === pivotRowIndex) {
          rowClass = 'pivot-row';
        } else if (i === targetRowIndex) {
          rowClass = 'target-row';
        }
        html += `<tr ${rowClass ? `class="${rowClass}"` : ''}>`;
        const totalCols = augMatrix[i].length;
        for (let j = 0; j < totalCols; j++) {
          // Clase separadora al inicio de la identidad
          const sepClass = (j === N) ? 'separator' : '';
          // Clase de celda pivote si corresponde
          const pivotCellClass = (i === pivotRowIndex && j === pivotIndex) ? 'pivot-cell' : '';
          const cellClass = [sepClass, pivotCellClass].filter(c => c).join(' ');
          // Valor de la celda (ya modificado); asegurar rango [0,m-1]
          let val = augMatrix[i][j] % m;
          if (val < 0) val += m;
          html += `<td ${cellClass ? `class="${cellClass}"` : ''}>${val}</td>`;
        }
        html += '</tr>';
      }
      html += '</table>';
      return html;
    }

    // Mostrar la matriz aumentada inicial [K|I]
    stepsDiv.innerHTML += `<p><strong>Matriz aumentada inicial [K | I]:</strong></p>`;
    stepsDiv.innerHTML += matrixToHTML(aug);

    // --- Aplicar método Gauss-Jacques ---
    for (let i = 0; i < N; i++) {
      // Paso 1: Selección del pivote en columna i ---------------------------------
      let pivotRow = i;
      let pivotVal = aug[pivotRow][i] % m;
      if (pivotVal < 0) pivotVal += m;
      // Si el pivote es 0 o no es invertible (gcd != 1), buscar fila para intercambiar
      if (pivotVal === 0 || gcd(pivotVal, m) !== 1) {
        let found = false;
        for (let k = i+1; k < N; k++) {
          let candidate = aug[k][i] % m;
          if (candidate < 0) candidate += m;
          if (candidate !== 0 && gcd(candidate, m) === 1) {
            // Intercambiar filas i y k
            [aug[i], aug[k]] = [aug[k], aug[i]];
            pivotVal = aug[i][i] % m;
            if (pivotVal < 0) pivotVal += m;
            found = true;
            stepsDiv.innerHTML += `<p>Intercambiando fila ${i+1} con fila ${k+1} para obtener pivote no nulo e invertible.</p>`;
            stepsDiv.innerHTML += matrixToHTML(aug); // Mostrar matriz tras el swap
            break;
          }
        }
        if (!found) {
          stepsDiv.innerHTML += `<p><strong>No se encontró pivote invertible en la columna ${i+1}. La matriz NO es invertible módulo ${m}.</strong></p>`;
          return; // Terminar: no es invertible
        }
      }
      // Actualizar pivotVal (por si hubo swap)
      pivotRow = i;
      pivotVal = aug[pivotRow][i] % m;
      if (pivotVal < 0) pivotVal += m;

      // Paso 2: Calcular inverso modular del pivote ---------------------------------------------
      stepsDiv.innerHTML += `<p><strong>Pivote (elemento a<sub>${i+1},${i+1}</sub>) = ${pivotVal}. Calculando su inverso mod ${m}:</strong></p>`;
      const euclidRes = extendedEuclid(pivotVal, m);
      // Si gcd != 1, no existe inverso -> no invertible
      if (euclidRes.gcd !== 1) {
        stepsDiv.innerHTML += `<p>No existe inverso de ${pivotVal} mod ${m} (mcd ≠ 1). La matriz NO es invertible.</p>`;
        return;
      }
      // Obtener inverso (coeficiente x de Bézout) y asegurarlo en [0,m-1]
      let inv = euclidRes.x;
      inv = ((inv % m) + m) % m;
      // Preparar series de soluciones (para ilustración)
      const x0 = inv;
      const q0 = -euclidRes.y; // tal que pivotVal*x0 = 1 + q0*m
      const xSeries = [x0, x0 + m, x0 + 2*m, x0 + 3*m];
      const qSeriesVals = [q0, q0 + 1 * pivotVal, q0 + 2 * pivotVal, q0 + 3 * pivotVal];
      stepsDiv.innerHTML += `<p>Hemos: ${pivotVal}·${x0} ≡ 1 (mod ${m}). Inverso de ${pivotVal} es <code>${inv}</code>. ` +
        `Series de soluciones: x = ${xSeries.join(', ')}...; q = ${qSeriesVals.join(', ')}... (otros) </p>`;

      // Paso 3: Escalar la fila pivote por el inverso (para que el pivote quede 1) -----------------
      stepsDiv.innerHTML += `<p>Escalando la fila ${i+1} por ${inv} (inverso de ${pivotVal}) para hacer pivote = 1:</p>`;
      for (let col = 0; col < 2 * N; col++) {
        aug[pivotRow][col] = (aug[pivotRow][col] * inv) % m;
        if (aug[pivotRow][col] < 0) aug[pivotRow][col] += m;
      }
      // Mostrar matriz con fila pivote escalada (destacada)
      stepsDiv.innerHTML += matrixToHTML(aug, i, pivotRow, pivotRow);

      // Paso 4: Eliminación por filas para hacer cero el resto de la columna i -----------------
      for (let j = 0; j < N; j++) {
        if (j !== pivotRow) {
          const factor = aug[j][i] % m;
          // Mostrar la operación si es diferente de cero
          if (factor !== 0) {
            stepsDiv.innerHTML += `<p>Eliminando elemento en fila ${j+1}, col ${i+1} con factor ${factor}: F${j+1} := F${j+1} - ${factor}·F${pivotRow+1} (mod ${m})</p>`;
          }
          // Restar factor * fila pivote a la fila j
          for (let col = 0; col < 2 * N; col++) {
            aug[j][col] = aug[j][col] - factor * aug[pivotRow][col];
            aug[j][col] %= m;
            if (aug[j][col] < 0) aug[j][col] += m;
          }
          // Mostrar matriz tras eliminar fila j (resaltando pivote y fila modificada)
          if (factor !== 0) {
            stepsDiv.innerHTML += matrixToHTML(aug, i, pivotRow, j);
          }
        }
      }
    }

    // --- Fin de Gauss-Jacques: extraer e mostrar la inversa resultante ---
    stepsDiv.innerHTML += `<p><strong>Matriz inversa modular resultante (${N}×${N}):</strong></p>`;
    let invMatrixHtml = '<table class="matrix">';
    for (let i = 0; i < N; i++) {
      invMatrixHtml += '<tr>';
      for (let j = 0; j < N; j++) {
        let val = aug[i][j + N] % m;
        if (val < 0) val += m;
        invMatrixHtml += `<td>${val}</td>`;
      }
      invMatrixHtml += '</tr>';
    }
    invMatrixHtml += '</table>';
    stepsDiv.innerHTML += invMatrixHtml;
  }

  /**
   * Función auxiliar: calcula el máximo común divisor (MCD) de a y b.
   */
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  // Evento: botón para calcular la inversa
  calcBtn.addEventListener('click', calculateInverse);
})();
