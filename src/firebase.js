// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// PLACEHOLDER CONFIGURATION
// Replace these with your actual Firebase project config when deploying to production!
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_PLACEHOLDER",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if credentials are placeholder
const isMockMode = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("PLACEHOLDER") || firebaseConfig.apiKey === "";

let app, db, auth;

if (!isMockMode) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("VELVET NAILS: Connected to Firebase services successfully.");
  } catch (error) {
    console.error("VELVET NAILS: Failed to initialize Firebase. Falling back to local Mock Mode.", error);
  }
} else {
  console.log("VELVET NAILS: Running in local Mock Mode. Data will be saved in localStorage.");
}

// --- SEED LOCAL STORAGE DEFAULT DATA ---
const initLocalStorage = () => {
  if (!localStorage.getItem("vn_appointments")) {
    localStorage.setItem("vn_appointments", JSON.stringify([
      {
        id: "appt-1",
        name: "Eleanor Vance",
        email: "eleanor@vance.com",
        phone: "(555) 019-2834",
        service: "Signature Bridal Artistry",
        date: "Jul 16",
        time: "10:00 AM",
        notes: "Almond shape, white gold lace flakes requested.",
        status: "pending",
        createdAt: new Date().toISOString()
      },
      {
        id: "appt-2",
        name: "Aria Thorne",
        email: "aria@thorne.co",
        phone: "(555) 902-8834",
        service: "Mirror Chrome & Metallic Design",
        date: "Jul 17",
        time: "1:00 PM",
        notes: "Copper chrome with custom charms.",
        status: "confirmed",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]));
  }

  if (!localStorage.getItem("vn_orders")) {
    localStorage.setItem("vn_orders", JSON.stringify([
      {
        id: "order-1",
        items: [
          { id: 3, name: "Velvet Chrome Press-On Set", price: 65.00, qty: 1 },
          { id: 2, name: "Organic Revitalizing Oil", price: 28.00, qty: 2 }
        ],
        subtotal: 121.00,
        status: "pending",
        createdAt: new Date().toISOString()
      }
    ]));
  }

  if (!localStorage.getItem("vn_subscribers")) {
    localStorage.setItem("vn_subscribers", JSON.stringify([
      { email: "newsletter@user.com", subscribedAt: new Date().toISOString() },
      { email: "editorial@design.com", subscribedAt: new Date(Date.now() - 86400000).toISOString() }
    ]));
  }

  if (!localStorage.getItem("vn_admin_user")) {
    localStorage.setItem("vn_admin_user", JSON.stringify({
      email: "admin@velvetnails.com",
      password: "admin" // Mock admin credentials
    }));
  }
};

if (isMockMode) {
  initLocalStorage();
}

// --- DATABASE OPERATIONS ---

// 1. Appointments
export const dbAddAppointment = async (appointment) => {
  const data = {
    ...appointment,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  if (!isMockMode && db) {
    const docRef = await addDoc(collection(db, "appointments"), data);
    return docRef.id;
  } else {
    const appts = JSON.parse(localStorage.getItem("vn_appointments") || "[]");
    const id = "appt-" + Math.floor(Math.random() * 1000000);
    data.id = id;
    appts.unshift(data);
    localStorage.setItem("vn_appointments", JSON.stringify(appts));
    return id;
  }
};

export const dbGetAppointments = async () => {
  if (!isMockMode && db) {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else {
    return JSON.parse(localStorage.getItem("vn_appointments") || "[]");
  }
};

export const dbUpdateAppointmentStatus = async (id, status) => {
  if (!isMockMode && db) {
    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, { status });
  } else {
    const appts = JSON.parse(localStorage.getItem("vn_appointments") || "[]");
    const index = appts.findIndex(a => a.id === id);
    if (index !== -1) {
      appts[index].status = status;
      localStorage.setItem("vn_appointments", JSON.stringify(appts));
    }
  }
};

// 2. Orders
export const dbAddOrder = async (orderItems, subtotal) => {
  const data = {
    items: orderItems,
    subtotal: subtotal,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  if (!isMockMode && db) {
    const docRef = await addDoc(collection(db, "orders"), data);
    return docRef.id;
  } else {
    const orders = JSON.parse(localStorage.getItem("vn_orders") || "[]");
    const id = "order-" + Math.floor(Math.random() * 1000000);
    data.id = id;
    orders.unshift(data);
    localStorage.setItem("vn_orders", JSON.stringify(orders));
    return id;
  }
};

export const dbGetOrders = async () => {
  if (!isMockMode && db) {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else {
    return JSON.parse(localStorage.getItem("vn_orders") || "[]");
  }
};

export const dbUpdateOrderStatus = async (id, status) => {
  if (!isMockMode && db) {
    const docRef = doc(db, "orders", id);
    await updateDoc(docRef, { status });
  } else {
    const orders = JSON.parse(localStorage.getItem("vn_orders") || "[]");
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem("vn_orders", JSON.stringify(orders));
    }
  }
};

// 3. Newsletter Subscribers
export const dbAddSubscriber = async (email) => {
  const data = {
    email,
    subscribedAt: new Date().toISOString()
  };

  if (!isMockMode && db) {
    await addDoc(collection(db, "subscribers"), data);
  } else {
    const subs = JSON.parse(localStorage.getItem("vn_subscribers") || "[]");
    if (!subs.some(s => s.email === email)) {
      subs.unshift(data);
      localStorage.setItem("vn_subscribers", JSON.stringify(subs));
    }
  }
};

export const dbGetSubscribers = async () => {
  if (!isMockMode && db) {
    const querySnapshot = await getDocs(collection(db, "subscribers"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return list.sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt));
  } else {
    return JSON.parse(localStorage.getItem("vn_subscribers") || "[]");
  }
};

// --- AUTHENTICATION OPERATIONS ---
export const authLogin = async (email, password) => {
  if (!isMockMode && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } else {
    const admin = JSON.parse(localStorage.getItem("vn_admin_user"));
    if (admin.email === email && admin.password === password) {
      const mockUser = { email: admin.email, uid: "mock-admin-uid" };
      localStorage.setItem("vn_mock_auth_token", JSON.stringify(mockUser));
      return mockUser;
    } else {
      throw new Error("Invalid admin credentials.");
    }
  }
};

export const authLogout = async () => {
  if (!isMockMode && auth) {
    await signOut(auth);
  } else {
    localStorage.removeItem("vn_mock_auth_token");
  }
};

export const authOnStateChange = (callback) => {
  if (!isMockMode && auth) {
    return onAuthStateChanged(auth, callback);
  } else {
    // Poll localstorage auth token state change
    const checkToken = () => {
      const token = localStorage.getItem("vn_mock_auth_token");
      callback(token ? JSON.parse(token) : null);
    };
    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }
};
