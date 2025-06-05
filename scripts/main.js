import { db, auth } from '../firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  updateDoc,
  doc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Elementos del DOM
const form = document.getElementById('publicar-form');
const publicacionesDiv = document.getElementById('publicaciones');
const filtro = document.getElementById('filtro');

// Publicar nueva propuesta
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const contenido = document.getElementById('contenido').value;

  if (!contenido.trim()) {
    alert("Escribe algo antes de publicar.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para publicar.");
    return;
  }

  await addDoc(collection(db, "publicaciones"), {
    contenido,
    votos: 0,
    fecha: new Date(),
    autor: user.uid,
    autorEmail: user.email,  // Guardamos también el correo del autor
    votantes: []  // Importante: inicializamos lista de votantes
  });

  document.getElementById('contenido').value = '';
  cargarPublicaciones();
});

// Cambio de filtro (más votadas o más recientes)
filtro.addEventListener('change', cargarPublicaciones);

// Cargar publicaciones con filtro aplicado
async function cargarPublicaciones() {
  publicacionesDiv.innerHTML = "";
  const orden = filtro.value === 'votadas' ? 'votos' : 'fecha';
  const q = query(collection(db, "publicaciones"), orderBy(orden, 'desc'));

  const snapshot = await getDocs(q);

  const user = auth.currentUser;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const yaVoto = user && data.votantes?.includes(user.uid);
    const div = document.createElement('div');
    div.innerHTML = `
      <p><small>Publicado por: ${data.autorEmail || 'Anónimo'} | ${data.fecha.toDate().toLocaleString()}</small></p>
      <p>${data.contenido}</p>
      <p>Votos: ${data.votos}</p>
      <button onclick="votar('${docSnap.id}')" ${yaVoto ? "disabled" : ""}>
        ${yaVoto ? "Ya votaste" : "Votar"}
      </button>
      <hr>
    `;
    publicacionesDiv.appendChild(div);
  });
}

// Función para votar
window.votar = async (id) => {
  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para votar.");
    return;
  }

  const ref = doc(db, "publicaciones", id);
  const snap = await getDoc(ref);
  const data = snap.data();

  if (data.votantes && data.votantes.includes(user.uid)) {
    alert("Ya votaste por esta publicación.");
    return;
  }

  await updateDoc(ref, {
    votos: data.votos + 1,
    votantes: arrayUnion(user.uid)
  });

  cargarPublicaciones();
};

cargarPublicaciones();

import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("usuario-info").innerText = `Sesión iniciada: ${user.email}`;
  } else {
    location.href = "index.html"; // Si no hay sesión, redirige al login
  }
});

document.getElementById('btn-logout').addEventListener('click', () => {
  signOut(auth).then(() => {
    alert('Has cerrado sesión.');
    location.href = 'index.html';
  }).catch((error) => {
    alert('Error al cerrar sesión: ' + error.message);
  });
});
