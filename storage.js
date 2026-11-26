// Datenspeicher der App.
// Mit ausgefüllter firebase-config.js: Firestore, live auf allen Geräten.
// Ohne: Testmodus mit localStorage (nur dieses Gerät).
// Alle Daten einer Feier liegen unter events/<Feier-Schlüssel>/… –
// wer den Link mit ?k=<Schlüssel> hat, kann lesen und schreiben.
import { firebaseConfig } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

export function eventKey() {
  const k = new URLSearchParams(location.search).get("k") || "";
  return /^[A-Za-z0-9]{24,64}$/.test(k) ? k : "";
}
export function newKey() {
  const a = new Uint8Array(24), abc = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  crypto.getRandomValues(a);
  return [...a].map(x => abc[x % abc.length]).join("");
}
export const isConfigured = () => !String(firebaseConfig.apiKey || "").includes("HIER_EINTRAGEN");

export async function openDb() {
  const key = eventKey();
  if (!key) return null;
  return isConfigured() ? openFirestore(key) : openLocal(key);
}

async function openFirestore(key) {
  const app = await import(SDK + "firebase-app.js");
  const fs = await import(SDK + "firebase-firestore.js");
  const db = fs.getFirestore(app.initializeApp(firebaseConfig));
  const col = name => fs.collection(db, "events", key, name);
  const wrapDoc = ref => ({
    id: ref.id,
    set: data => fs.setDoc(ref, data),
    update: data => fs.updateDoc(ref, data),
    delete: () => fs.deleteDoc(ref)
  });
  return {
    collection(name) {
      const c = col(name);
      return {
        doc: id => wrapDoc(id ? fs.doc(c, id) : fs.doc(c)),
        add: async data => wrapDoc(await fs.addDoc(c, data)),
        onSnapshot: (next, error) => fs.onSnapshot(c, { includeMetadataChanges: true }, next, error)
      };
    }
  };
}

// Testmodus: alles in localStorage, Änderungen auch zwischen Tabs desselben Browsers
function openLocal(key) {
  const store = "einstand:" + key;
  const load = () => { try { return JSON.parse(localStorage.getItem(store)) || {}; } catch { return {}; } };
  let data = load();
  const subs = new Set();
  const notify = () => subs.forEach(f => f());
  const save = () => { try { localStorage.setItem(store, JSON.stringify(data)); } catch {} notify(); };
  addEventListener("storage", e => { if (e.key === store) { data = load(); notify(); } });
  const rid = () => newKey().slice(0, 20);
  const snap = name => {
    const docs = Object.entries(data[name] || {}).map(([id, v]) => ({ id, data: () => v }));
    return { docs, size: docs.length, empty: !docs.length, metadata: { fromCache: false } };
  };
  const wrapDoc = (name, id) => ({
    id,
    set: async v => { (data[name] ||= {})[id] = JSON.parse(JSON.stringify(v)); save(); },
    update: async v => { const c = data[name] || {}; if (!c[id]) throw { code: "not-found" }; Object.assign(c[id], v); save(); },
    delete: async () => { if (data[name]) delete data[name][id]; save(); }
  });
  setTimeout(() => {
    const b = document.getElementById("banner");
    if (b) { b.textContent = "Testmodus: Firebase ist noch nicht eingerichtet. Die Daten bleiben nur auf diesem Gerät."; b.classList.add("on"); }
  }, 0);
  return {
    collection(name) {
      return {
        doc: id => wrapDoc(name, id || rid()),
        add: async v => { const r = wrapDoc(name, rid()); await r.set(v); return r; },
        onSnapshot: next => { const f = () => next(snap(name)); subs.add(f); setTimeout(f, 0); return () => subs.delete(f); }
      };
    }
  };
}
