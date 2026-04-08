'use client';
import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  ChevronDown,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Filter
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders'); // Assuming this endpoint exists based on layout
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (p: number) => new Intl.NumberFormat('uz-UZ').format(p);

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      {/* ── Header ── */}
      <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">
            Sales <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 italic">Hub</span>
          </h1>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-glow-green" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{orders.length} Operations Processed</p>
             </div>
             <div className="flex items-center gap-2">
                <TrendingUp className="text-green-400" size={14} />
                <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Active Stream</p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Filters */}
           <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
              {['all', 'pending', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>
      </header>

      {/* ── Orders Table/Feed ── */}
      {loading ? (
        <div className="space-y-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-[32px] bg-white/5 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 glass rounded-[60px] border-dashed border-2 border-white/5">
           <ShoppingCart className="text-white/5 mb-8" size={120} strokeWidth={0.5} />
           <p className="text-[12px] font-black text-gray-600 uppercase tracking-[0.4em]">Transaction log is empty</p>
        </div>
      ) : (
        <div className="space-y-6 stagger-children">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="group glass p-8 rounded-[40px] border border-white/5 hover:border-green-500/20 transition-all duration-500 hover:shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8"
            >
              {/* Customer Info */}
              <div className="flex items-center gap-6 min-w-[300px]">
                 <div className="w-16 h-16 rounded-[24px] bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shadow-xl group-hover:scale-110 transition-transform">
                    <User size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{order.customerName || 'Anonymous'}</h3>
                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest"><Phone size={12} /> {order.customerPhone}</span>
                       <div className="w-1 h-1 bg-gray-700 rounded-full" />
                       <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest"><Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                 </div>
              </div>

              {/* Order Content */}
              <div className="flex-1 flex flex-wrap gap-3">
                 {order.items?.map((item: any, idx: number) => (
                   <div key={idx} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 group-hover:bg-white/10 transition-all">
                      <Package size={14} className="text-gray-500" />
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">{item.name} × {item.quantity}</span>
                   </div>
                 ))}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between lg:justify-end gap-12 min-w-[250px]">
                 <div className="text-right">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Valuation</p>
                    <p className="text-2xl font-black text-white tracking-tighter">
                      {formatPrice(order.totalAmount || 0)} <span className="text-xs font-medium text-gray-600">so'm</span>
                    </p>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all">
                       <MessageCircle size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
                       <ChevronDown size={20} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
