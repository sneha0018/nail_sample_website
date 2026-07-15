import React, { useState, useEffect } from 'react';
import { 
  authLogin, 
  authLogout, 
  authOnStateChange, 
  dbGetAppointments, 
  dbUpdateAppointmentStatus, 
  dbGetOrders, 
  dbUpdateOrderStatus, 
  dbGetSubscribers 
} from '../firebase';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Database states
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = authOnStateChange((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadDashboardData();
      } else {
        setLoading(false);
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const appts = await dbGetAppointments();
      const ords = await dbGetOrders();
      const subs = await dbGetSubscribers();
      setAppointments(appts);
      setOrders(ords);
      setSubscribers(subs);
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await authLogin(email, password);
    } catch (err) {
      setLoginError(err.message || "Invalid admin credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleUpdateAppointment = async (id, status) => {
    try {
      await dbUpdateAppointmentStatus(id, status);
      // Hot reload state
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      alert("Failed to update appointment status.");
    }
  };

  const handleUpdateOrder = async (id, status) => {
    try {
      await dbUpdateOrderStatus(id, status);
      // Hot reload state
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  // --- STATS CALCULATIONS ---
  const totalRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0) + 
                       appointments.filter(a => a.status === 'completed' || a.status === 'confirmed').length * 90; // estimated $90 average booking

  // --- LOGIN PANEL VIEW ---
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md bg-white border border-outline-variant/20 p-8 shadow-xl rounded-sm">
          <div className="text-center mb-8 space-y-2">
            <span className="font-label-caps text-[10px] text-primary tracking-widest block">STUDIO GATEWAY</span>
            <h2 className="font-display-lg text-2xl text-on-background">Admin Log In</h2>
            <p className="text-xs text-secondary">Sign in to manage appointments, care orders, and subscribers.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-error-container text-on-error-container text-xs font-semibold rounded-sm">
                {loginError}
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block font-label-caps text-[9px] tracking-widest text-secondary mb-1">ADMIN EMAIL</label>
              <input 
                type="email" 
                id="login-email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full border-outline-variant/35 focus:border-primary rounded-sm text-sm py-2 px-3 focus:ring-0" 
                placeholder="admin@velvetnails.com"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block font-label-caps text-[9px] tracking-widest text-secondary mb-1">PASSWORD</label>
              <input 
                type="password" 
                id="login-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full border-outline-variant/35 focus:border-primary rounded-sm text-sm py-2 px-3 focus:ring-0" 
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-label-caps text-xs py-3.5 tracking-widest transition-colors rounded-sm shadow-md pt-3">
              ACCESS DASHBOARD
            </button>
            <p className="text-[10px] text-outline text-center pt-2 leading-relaxed">
              Default simulated demo credentials are:<br/>
              <strong>admin@velvetnails.com</strong> / <strong>admin</strong>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD PANEL VIEW ---
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      {/* Admin Header */}
      <header className="border-b border-outline-variant/15 glass-nav shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center px-6 md:px-margin-desktop py-4 max-w-container-max mx-auto h-20">
          <div className="flex items-center gap-4">
            <span className="font-display-lg text-lg tracking-wider text-primary">VELVET NAILS</span>
            <span className="bg-primary/5 text-primary text-[10px] font-semibold tracking-wider font-label-caps px-3 py-1 rounded-full border border-primary/20">ADMIN PANEL</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="hidden md:inline text-xs text-secondary font-light">Signed in as <strong>{user.email}</strong></span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 border border-error/20 rounded-full font-label-caps text-[10px] text-error hover:bg-error hover:text-white transition-all duration-300 tracking-wider">
              SIGN OUT <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-container-max w-full mx-auto px-6 md:px-margin-desktop py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant/15 font-label-caps text-xs tracking-widest text-secondary overflow-x-auto pb-px">
          {[
            { id: "overview", label: "OVERVIEW", icon: "dashboard" },
            { id: "appointments", label: `BOOKINGS (${appointments.length})`, icon: "calendar_today" },
            { id: "orders", label: `SHOP ORDERS (${orders.length})`, icon: "shopping_bag" },
            { id: "subscribers", label: `SUBSCRIBERS (${subscribers.length})`, icon: "mail" }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4.5 border-b-2 font-semibold transition-all duration-300 whitespace-nowrap focus:outline-none ${activeTab === tab.id ? 'border-primary text-primary bg-primary/5' : 'border-transparent hover:text-primary'}`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="py-20 text-center text-secondary text-sm flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <span>Synchronizing database collections...</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. OVERVIEW VIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-sm shadow-sm space-y-2">
                    <span className="font-label-caps text-[9px] text-outline tracking-wider block">ESTIMATED REVENUE</span>
                    <h3 className="font-display-lg text-3xl text-primary font-bold">${totalRevenue.toFixed(2)}</h3>
                    <p className="text-[10px] text-secondary">Bookings & boutique sales combined.</p>
                  </div>
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-sm shadow-sm space-y-2">
                    <span className="font-label-caps text-[9px] text-outline tracking-wider block">TOTAL APPOINTMENTS</span>
                    <h3 className="font-display-lg text-3xl text-on-surface font-bold">{appointments.length}</h3>
                    <p className="text-[10px] text-secondary">{appointments.filter(a => a.status === 'pending').length} pending approval.</p>
                  </div>
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-sm shadow-sm space-y-2">
                    <span className="font-label-caps text-[9px] text-outline tracking-wider block">CARE SHOP ORDERS</span>
                    <h3 className="font-display-lg text-3xl text-on-surface font-bold">{orders.length}</h3>
                    <p className="text-[10px] text-secondary">{orders.filter(o => o.status === 'pending').length} items ready to ship.</p>
                  </div>
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-sm shadow-sm space-y-2">
                    <span className="font-label-caps text-[9px] text-outline tracking-wider block">NEWSLETTER AUDIENCE</span>
                    <h3 className="font-display-lg text-3xl text-on-surface font-bold">{subscribers.length}</h3>
                    <p className="text-[10px] text-secondary">Subscribed email leads.</p>
                  </div>
                </div>

                {/* Recent Items Panel split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Bookings */}
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-sm shadow-sm space-y-4">
                    <h4 className="font-headline-md text-lg text-on-surface border-b pb-3 border-outline-variant/10">Recent Bookings</h4>
                    <div className="space-y-3">
                      {appointments.slice(0, 3).map(appt => (
                        <div key={appt.id} className="flex justify-between items-center text-xs pb-3 border-b border-outline-variant/10 last:border-0 last:pb-0">
                          <div>
                            <span className="font-semibold text-on-surface block">{appt.name}</span>
                            <span className="text-secondary font-light">{appt.service}</span>
                          </div>
                          <div className="text-right">
                            <span className="block font-medium text-primary">{appt.date} at {appt.time}</span>
                            <span className={`inline-block text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : appt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                              {appt.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Shop Orders */}
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-sm shadow-sm space-y-4">
                    <h4 className="font-headline-md text-lg text-on-surface border-b pb-3 border-outline-variant/10">Recent Shop Orders</h4>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map(ord => (
                        <div key={ord.id} className="flex justify-between items-center text-xs pb-3 border-b border-outline-variant/10 last:border-0 last:pb-0">
                          <div>
                            <span className="font-semibold text-on-surface block">Order #{ord.id.substring(ord.id.length - 6)}</span>
                            <span className="text-secondary font-light">{ord.items.map(i => `${i.qty}x ${i.name}`).join(", ")}</span>
                          </div>
                          <div className="text-right">
                            <span className="block font-bold text-primary">${ord.subtotal.toFixed(2)}</span>
                            <span className={`inline-block text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ord.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. APPOINTMENTS COLLECTION VIEW */}
            {activeTab === "appointments" && (
              <div className="bg-white border border-outline-variant/20 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-outline uppercase font-label-caps text-[9px] border-b border-outline-variant/15">
                        <th className="p-4 pl-6">Client Info</th>
                        <th className="p-4">Requested Service</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Special Notes</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-secondary font-light">No appointment bookings found.</td>
                        </tr>
                      ) : (
                        appointments.map(appt => (
                          <tr key={appt.id} className="hover:bg-primary/5 transition-colors">
                            <td className="p-4 pl-6 space-y-0.5">
                              <span className="font-semibold text-sm block">{appt.name}</span>
                              <span className="text-[10px] text-outline block">{appt.email}</span>
                              <span className="text-[10px] text-outline block">{appt.phone}</span>
                            </td>
                            <td className="p-4 font-medium text-primary">{appt.service}</td>
                            <td className="p-4">
                              <span className="font-semibold block">{appt.date}</span>
                              <span className="text-secondary font-light">{appt.time}</span>
                            </td>
                            <td className="p-4 max-w-xs truncate font-light text-secondary" title={appt.notes}>
                              {appt.notes || "—"}
                            </td>
                            <td className="p-4">
                              <span className={`inline-block text-[9px] uppercase px-3 py-1 rounded-full font-bold ${
                                appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                appt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                appt.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {appt.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                              {appt.status === 'pending' && (
                                <button onClick={() => handleUpdateAppointment(appt.id, 'confirmed')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-sm font-semibold text-[10px] uppercase">
                                  Confirm
                                </button>
                              )}
                              {appt.status === 'confirmed' && (
                                <button onClick={() => handleUpdateAppointment(appt.id, 'completed')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-sm font-semibold text-[10px] uppercase">
                                  Complete
                                </button>
                              )}
                              {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                                <button onClick={() => handleUpdateAppointment(appt.id, 'cancelled')} className="border border-error/30 hover:bg-error hover:text-white text-error px-3 py-1 rounded-sm font-semibold text-[10px] uppercase transition-colors">
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. SHOP ORDERS VIEW */}
            {activeTab === "orders" && (
              <div className="bg-white border border-outline-variant/20 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-outline uppercase font-label-caps text-[9px] border-b border-outline-variant/15">
                        <th className="p-4 pl-6">Order ID</th>
                        <th className="p-4">Order Details (Items)</th>
                        <th className="p-4">Subtotal</th>
                        <th className="p-4">Order Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-secondary font-light">No shop orders found.</td>
                        </tr>
                      ) : (
                        orders.map(ord => (
                          <tr key={ord.id} className="hover:bg-primary/5 transition-colors">
                            <td className="p-4 pl-6 font-mono font-semibold text-sm">
                              #{ord.id.substring(ord.id.length - 8)}
                            </td>
                            <td className="p-4 space-y-1 font-light">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="text-secondary font-medium">
                                  {item.qty}x <span className="text-on-surface">{item.name}</span> (${item.price.toFixed(2)} ea)
                                </div>
                              ))}
                            </td>
                            <td className="p-4 font-bold text-sm text-primary">
                              ${ord.subtotal.toFixed(2)}
                            </td>
                            <td className="p-4 text-secondary font-light">
                              {new Date(ord.createdAt).toLocaleDateString("en-US", {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-4">
                              <span className={`inline-block text-[9px] uppercase px-3 py-1 rounded-full font-bold ${
                                ord.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                ord.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {ord.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                              {ord.status === 'pending' && (
                                <button onClick={() => handleUpdateOrder(ord.id, 'shipped')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-sm font-semibold text-[10px] uppercase">
                                  Mark Shipped
                                </button>
                              )}
                              {ord.status === 'shipped' && (
                                <button onClick={() => handleUpdateOrder(ord.id, 'delivered')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-sm font-semibold text-[10px] uppercase">
                                  Mark Delivered
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. NEWSLETTER SUBSCRIBERS VIEW */}
            {activeTab === "subscribers" && (
              <div className="bg-white border border-outline-variant/20 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-outline uppercase font-label-caps text-[9px] border-b border-outline-variant/15">
                        <th className="p-4 pl-6">Subscriber Email</th>
                        <th className="p-4">Subscription Date</th>
                        <th className="p-4 pr-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                      {subscribers.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="p-8 text-center text-secondary font-light">No newsletter subscribers found.</td>
                        </tr>
                      ) : (
                        subscribers.map((sub, idx) => (
                          <tr key={idx} className="hover:bg-primary/5 transition-colors">
                            <td className="p-4 pl-6 font-semibold text-sm text-primary">
                              {sub.email}
                            </td>
                            <td className="p-4 text-secondary font-light">
                              {new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-4 pr-6 text-right text-[10px] font-bold text-green-700 uppercase">
                              Active
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
          </div>
        )}
      </main>
    </div>
  );
}
