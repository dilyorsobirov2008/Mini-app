'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

/* ───── Icons ───── */
const Icons = {
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  cart: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  minus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14"/>
    </svg>
  ),
  x: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  ),
  grid: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  send: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7Z"/>
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  mapPin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  bag: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.15">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  package: (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.12">
      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/>
    </svg>
  ),
};

/* ───── Types ───── */
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image: string | null;
  stock: number;
  categoryId: string;
  category?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface CartItem extends Product {
  quantity: number;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price);

export default function MiniApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Pagination
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  // Checkout form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderSending, setOrderSending] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prev => prev + LIMIT);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore]);

  // Initial Fetch
  useEffect(() => {
    fetchCategories();
    // Telegram Web App
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.expand();
      tg.setHeaderColor('#0a0a0f');
      tg.setBackgroundColor('#0a0a0f');
    }
  }, []);

  // Fetch products when category, search, or offset changes
  useEffect(() => {
    fetchProducts(offset === 0);
  }, [selectedCategory, searchTerm, offset]);

  // Reset when filter changes
  useEffect(() => {
    setOffset(0);
    setProducts([]);
    setHasMore(true);
  }, [selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Fetch categories error:', e);
    }
  };

  const fetchProducts = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        limit: LIMIT.toString(),
        offset: isInitial ? '0' : offset.toString(),
        categoryId: selectedCategory === 'all' ? '' : selectedCategory,
        search: searchTerm,
      });

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (data.products) {
        setProducts(prev => isInitial ? data.products : [...prev, ...data.products]);
        setHasMore(data.hasMore);
      }
    } catch (e) {
      console.error('Fetch products error:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing)
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { ...product, quantity: 1 }];
    });
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 800);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const submitOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) return;
    setOrderSending(true);

    try {
      // 1. Send to server for database and Telegram Notification
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName,
          phone: customerPhone,
          address,
          items: cart.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
          total: cartTotal,
        }),
      });

      if (!res.ok) throw new Error('Order creation failed');

      // 2. Send to Telegram (Optional service message)
      const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;
      if (tg) {
        tg.sendData(JSON.stringify({
          type: 'order',
          name: customerName,
          phone: customerPhone,
          address,
          items: cart.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
          total: cartTotal,
        }));
      }

      setOrderSent(true);
      setTimeout(() => {
        setCart([]);
        setShowCheckout(false);
        setOrderSent(false);
        setCustomerName('');
        setCustomerPhone('');
        setAddress('');
        if (tg) tg.close();
      }, 2500);
    } catch (e) {
      console.error('Order error:', e);
      alert('Buyurtmani yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setOrderSending(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 bg-indigo-600" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-10 bg-purple-600" />
      </div>

      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>PREMIUM STORE</h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">The Future of Shopping</p>
            </div>
          </div>
          <button 
            onClick={() => setShowCart(true)}
            className="p-2.5 rounded-2xl glass active:scale-95 transition-all relative border border-white/10"
          >
            {Icons.cart}
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-indigo-500 ring-2 ring-[#0a0a0f]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-32">
        {/* Search */}
        <div className="mt-6 animate-fade-up">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
              {Icons.search}
            </div>
            <input
              type="text"
              placeholder="Eksklyuziv mahsulotlarni qidirish..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-white/5 focus:border-indigo-500/50 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto py-6 no-scrollbar stagger-children">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === 'all' 
              ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30' 
              : 'glass text-gray-400 border-white/5'
            }`}
          >
            Barchasi
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id 
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30' 
                : 'glass text-gray-400 border-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 stagger-children">
          {products.map((prod, idx) => (
            <div 
              key={prod.id} 
              ref={idx === products.length - 1 ? lastProductElementRef : null}
              className="group relative rounded-3xl overflow-hidden glass border border-white/5 hover:border-indigo-500/30 transition-all duration-300"
              onClick={() => setSelectedProduct(prod)}
            >
              <div className="aspect-square overflow-hidden bg-[#1a1a28]">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-30">{Icons.package}</div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#12121a] to-transparent" />
              </div>
              
              <div className="p-3 relative">
                <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{prod.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-indigo-400">{formatPrice(prod.price)}</span>
                    <span className="text-[10px] text-gray-500 ml-0.5 font-bold uppercase">UZS</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      addedProductId === prod.id ? 'bg-green-500' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {addedProductId === prod.id ? Icons.check : Icons.plus}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(loading || loadingMore) && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <p className="text-center py-10 text-xs font-bold text-gray-600 uppercase tracking-widest">Siz hamma narsani ko'rdingiz ✨</p>
        )}
      </main>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40 max-w-lg mx-auto">
          <button 
            onClick={() => setShowCart(true)}
            className="w-full py-4 px-6 rounded-3xl bg-indigo-500 text-white flex items-center justify-between shadow-2xl shadow-indigo-500/40 border border-indigo-400/50 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black">
                {cartCount}
              </div>
              <span className="font-black text-sm uppercase tracking-wider">Xaridlar Savatchasi</span>
            </div>
            <span className="font-black text-lg">{formatPrice(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-lg glass rounded-[40px] border border-white/10 overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
            <button className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center" onClick={() => setSelectedProduct(null)}>
              {Icons.x}
            </button>
            <div className="overflow-y-auto no-scrollbar">
              <div className="aspect-square w-full bg-[#1a1a28]">
                {selectedProduct.image && <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                    {selectedProduct.category?.name || 'Exclusive'}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white mb-4 leading-tight">{selectedProduct.name}</h2>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-4xl font-black text-white">{formatPrice(selectedProduct.price)}</span>
                  <span className="text-xs font-bold text-indigo-400 mb-2 uppercase">so'm</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">{selectedProduct.description || "Ushbu mahsulot haqida ma'lumot kam."}</p>
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full py-5 rounded-3xl bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-500/30 active:scale-95 transition-all"
                >
                  Savatga Qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer & Checkout (Simplified for brevity but with UI polish) */}
      {showCart && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowCart(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] flex flex-col glass rounded-t-[40px] border-t border-white/10 animate-slide-up">
            <div className="flex justify-center py-4"><div className="w-12 h-1.5 rounded-full bg-white/10" /></div>
            <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
              <h2 className="text-2xl font-black mb-6">SAVATCHA</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-3xl glass border border-white/5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#1a1a28] flex-shrink-0">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-400 font-bold">{formatPrice(item.price)}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg glass flex items-center justify-center font-bold">{Icons.minus}</button>
                          <span className="font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg glass flex items-center justify-center font-bold">{Icons.plus}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 border-t border-white/10">
              <div className="flex justify-between mb-6">
                <span className="text-gray-500 font-bold">JAMI SUMMA:</span>
                <span className="text-2xl font-black">{formatPrice(cartTotal)}</span>
              </div>
              <button 
                onClick={() => { setShowCart(false); setShowCheckout(true); }}
                className="w-full py-5 rounded-3xl bg-indigo-500 text-white font-black text-lg"
              >
                RASMIYLASHTIRISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => !orderSending && setShowCheckout(false)} />
          <div className="relative w-full max-w-sm glass rounded-[40px] border border-white/10 p-8 animate-slide-up">
            {orderSent ? (
               <div className="text-center py-10">
                 <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-float">{Icons.check}</div>
                 <h2 className="text-2xl font-black mb-2">Qabul Qilindi!</h2>
                 <p className="text-gray-400 text-sm">Buyurtmangiz muvaffaqiyatli yuborildi. Tez orada bog'lanamiz.</p>
               </div>
            ) : (
              <>
                <h2 className="text-2xl font-black mb-6">BUYURTMA BERISH</h2>
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{Icons.user}</div>
                    <input type="text" placeholder="Ismingiz" className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-white/5 text-sm font-bold" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{Icons.phone}</div>
                    <input type="tel" placeholder="+998 90..." className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-white/5 text-sm font-bold" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500">{Icons.mapPin}</div>
                    <textarea placeholder="Yetkazib berish manzili" className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-white/5 text-sm font-bold min-h-[100px]" value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                </div>
                <button 
                  onClick={submitOrder}
                  disabled={orderSending || !customerName || !customerPhone || !address}
                  className="w-full py-5 rounded-3xl bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-500/30 disabled:opacity-30"
                >
                  {orderSending ? 'YUBORILMOQDA...' : 'TASDIQLASH'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
