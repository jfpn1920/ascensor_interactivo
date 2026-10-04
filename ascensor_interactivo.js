// ===== Ascensor Interactivo =====
// Clave con la que se guardan los datos en localStorage
const CLAVE = 'ascensorInteractivo';
// Número total de pisos del edificio
const TOTAL_PISOS = 6;
// Estado del ascensor: piso actual, texto de dirección y viajes realizados
let estado = { piso: 1, direccion: 'Detenido', viajes: 0 };
// ===== Referencias a elementos del HTML =====
const cabina = document.getElementById('cabina');            // cabina dentro del pozo
const numero = document.getElementById('numero');            // número en la pantalla
const direccion = document.getElementById('direccion');      // texto de dirección
const viajes = document.getElementById('viajes');            // texto de viajes
const botones = document.getElementById('botones');          // contenedor de botones
const pisos = document.querySelectorAll('.piso');            // los 6 botones de piso
const lugares = document.querySelectorAll('#directorio li'); // lugares del directorio
const btnReiniciar = document.getElementById('btn-reiniciar'); // botón reiniciar
// ===== Funciones de localStorage =====
// Guarda el estado actual en el navegador (como texto JSON)
function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
// Carga el estado guardado (si existe) al abrir la página
function cargar() {
    const datos = localStorage.getItem(CLAVE); // lee el texto guardado
    if (datos) {
        const lista = JSON.parse(datos); // convierte el texto a objeto
        // Solo lo usa si el piso guardado es válido (entre 1 y el total)
        if (lista.piso >= 1 && lista.piso <= TOTAL_PISOS) estado = { ...estado, ...lista };
    }
}
// ===== Funciones de la interfaz =====
// Dibuja en pantalla todo lo que está guardado en el estado
function actualizar() {
    // Muestra el piso actual y el texto de dirección
    numero.textContent = estado.piso;
    direccion.textContent = estado.direccion;
    viajes.textContent = `Viajes: ${estado.viajes}`;
    // Mueve la cabina: cada piso equivale a 1/6 de la altura del pozo
    cabina.style.bottom = `${(estado.piso - 1) * (100 / TOTAL_PISOS)}%`;
    // Ilumina solo el botón del piso actual
    pisos.forEach(boton => {
        boton.classList.toggle('activo', Number(boton.dataset.piso) === estado.piso);
    });
    // Resalta en el directorio el lugar del piso actual
    lugares.forEach(li => {
        li.classList.toggle('actual', Number(li.dataset.piso) === estado.piso);
    });
}
// Mueve el ascensor al piso indicado
function irAPiso(destino) {
    // Si ya está en ese piso, no hace nada
    if (destino === estado.piso) return;
    // Define si sube o baja comparando con el piso actual
    estado.direccion = destino > estado.piso ? '⬆️ Subiendo' : '⬇️ Bajando';
    estado.piso = destino; // cambia el piso
    estado.viajes++;       // suma un viaje
    guardar();
    actualizar();
}
// Vuelve al piso 1 y borra los datos guardados
function reiniciar() {
    estado = { piso: 1, direccion: 'Detenido', viajes: 0 };
    localStorage.removeItem(CLAVE);
    actualizar();
}
// ===== Eventos =====
// Un solo "oyente" en el contenedor detecta clic en cualquier botón de piso
botones.addEventListener('click', (evento) => {
  const boton = evento.target.closest('.piso'); // botón más cercano al clic
  if (!boton) return; // si se hizo clic fuera de un botón, no hace nada
  irAPiso(Number(boton.dataset.piso)); // usa el data-piso como destino
});
// Botón "Reiniciar"
btnReiniciar.addEventListener('click', reiniciar);
// ===== Inicio =====
// Al cargar la página: lee lo guardado y dibuja
cargar();
actualizar();