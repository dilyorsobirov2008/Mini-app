'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

/* ───── Icons (inline SVG for performance) ───── */
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
  description: string | null;
  price: number;
  image: string | null;
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

/* ───── Price formatter ───── */
const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price);

/* ═══════════════════════════════════════════ */
/*                MAIN COMPONENT               */
/* ═══════════════════════════════════════════ */
export default function MiniApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Checkout form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderSending, setOrderSending] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const catScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
    // Telegram Web App expand
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.expand();
      tg.setHeaderColor('#0a0a0f');
      tg.setBackgroundColor('#0a0a0f');
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  /* Cart actions */
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

  const getCartQuantity = (productId: string) => {
    return cart.find((i) => i.id === productId)?.quantity || 0;
  };

  /* Submit order */
  const submitOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) return;
    setOrderSending(true);

    try {
      // Send to Telegram
      const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;

      const orderText =
        `📦 YANGI BUYURTMA!\n\n` +
        `👤 Ism: ${customerName}\n` +
        `📞 Tel: ${customerPhone}\n` +
        `📍 Manzil: ${address}\n\n` +
        `🛍 Mahsulotlar:\n${cart.map((i) => `  • ${i.name} × ${i.quantity} = ${formatPrice(i.price * i.quantity)} so'm`).join('\n')}\n\n` +
        `💰 Jami: ${formatPrice(cartTotal)} so'm`;

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
        setShowCart(false);
        setOrderSent(false);
        setCustomerName('');
        setCustomerPhone('');
        setAddress('');
        if (tg) tg.close();
      }, 2500);
    } catch (e) {
      console.error('Order error:', e);
    } finally {
      setOrderSending(false);
    }
  };

  /* ═══ RENDER ═══ */
  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* ══════════ HEADER ══════════ */}
      <header className="sticky top-0 z-40 glass" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              🛍
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight leading-none"
                style={{ color: 'var(--text-primary)' }}>
                BOZORCHA
              </h1>
              <p className="text-[10px] font-medium tracking-wider uppercase"
                style={{ color: 'var(--text-muted)' }}>
                Premium Do'kon
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2.5 rounded-xl transition-all duration-200 active:scale-90"
            style={{ background: 'var(--accent-glow)', border: '1px solid var(--border)' }}
          >
            {Icons.cart}
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1"
                style={{ background: 'var(--accent)' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="max-w-lg mx-auto px-4 pb-32 relative z-10">

        {/* ── Search ── */}
        <div className="mt-4 mb-4 animate-fade-up">
          <div className="relative rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
              {Icons.search}
            </div>
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ── Categories ── */}
        <div ref={catScrollRef} className="flex gap-2 overflow-x-auto pb-4 no-scrollbar animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200"
            style={{
              background: selectedCategory === 'all' ? 'var(--accent)' : 'var(--bg-card)',
              color: selectedCategory === 'all' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${selectedCategory === 'all' ? 'var(--accent)' : 'var(--border)'}`,
              ...(selectedCategory === 'all' ? { boxShadow: '0 4px 15px -3px rgba(99,102,241,0.3)' } : {}),
            }}
          >
            {Icons.grid} Barchasi
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200"
              style={{
                background: selectedCategory === cat.id ? 'var(--accent)' : 'var(--bg-card)',
                color: selectedCategory === cat.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${selectedCategory === cat.id ? 'var(--accent)' : 'var(--border)'}`,
                ...(selectedCategory === cat.id ? { boxShadow: '0 4px 15px -3px rgba(99,102,241,0.3)' } : {}),
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── Products Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="h-40 animate-shimmer" style={{ background: 'var(--bg-elevated)' }} />
                <div className="p-3 space-y-2">
                  <div className="h-3 rounded-full animate-shimmer" style={{ background: 'var(--bg-elevated)', width: '70%' }} />
                  <div className="h-3 rounded-full animate-shimmer" style={{ background: 'var(--bg-elevated)', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
            {Icons.package}
            <p className="mt-4 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              Mahsulotlar topilmadi
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Boshqa kategoriyani tanlang yoki qidiruv so'zini o'zgartiring
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2 stagger-children">
            {filteredProducts.map((prod) => {
              const inCartQty = getCartQuantity(prod.id);
              const justAdded = addedProductId === prod.id;
              return (
                <div
                  key={prod.id}
                  className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${inCartQty > 0 ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                  }}
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {Icons.package}
                      </div>
                    )}
                    {/* Category badge */}
                    {prod.category && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'var(--accent-light)' }}>
                        {prod.category.name}
                      </div>
                    )}
                    {/* In cart badge */}
                    {inCartQty > 0 && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: 'var(--accent)' }}>
                        {inCartQty}
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-16"
                      style={{ background: 'linear-gradient(to top, var(--bg-card), transparent)' }} />
                  </div>

                  {/* Info */}
                  <div className="p-3 pt-1">
                    <h3 className="text-sm font-bold leading-tight mb-1 line-clamp-2"
                      style={{ color: 'var(--text-primary)' }}>
                      {prod.name}
                    </h3>
                    {prod.description && (
                      <p className="text-[11px] leading-relaxed mb-2 line-clamp-2"
                        style={{ color: 'var(--text-muted)' }}>
                        {prod.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                          {formatPrice(prod.price)}
                        </span>
                        <span className="text-[10px] ml-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                          so'm
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(prod)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90"
                        style={{
                          background: justAdded ? 'var(--success)' : 'var(--accent)',
                          color: '#fff',
                          boxShadow: '0 4px 12px -3px rgba(99,102,241,0.3)',
                        }}
                      >
                        {justAdded ? Icons.check : Icons.plus}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ══════════ FLOATING CART BAR ══════════ */}
      {cartCount > 0 && !showCart && (
        <div className="fixed bottom-4 left-4 right-4 z-30 max-w-lg mx-auto animate-slide-up">
          <button
            onClick={() => setShowCart(true)}
            className="w-full py-3.5 px-5 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              boxShadow: '0 8px 32px -4px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                {cartCount}
              </div>
              <span className="text-sm font-bold text-white">Savatcha</span>
            </div>
            <span className="text-sm font-extrabold text-white">
              {formatPrice(cartTotal)} so'm
            </span>
          </button>
        </div>
      )}

      {/* ══════════ CART DRAWER ══════════ */}
      {showCart && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowCart(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] flex flex-col animate-slide-up"
            style={{ background: 'var(--bg-primary)', borderRadius: '24px 24px 0 0', border: '1px solid var(--border)', borderBottom: 'none' }}>

            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-hover)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
                Savatcha
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: 'var(--accent-glow)', color: 'var(--accent-light)' }}>
                  {cartCount}
                </span>
              </h2>
              <button onClick={() => setShowCart(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                {Icons.x}
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3 no-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center py-16">
                  {Icons.bag}
                  <p className="mt-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    Savatchingiz bo'sh
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: 'var(--bg-elevated)' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {item.name}
                      </h4>
                      <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--accent-light)' }}>
                        {formatPrice(item.price)} so'm
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 rounded-lg overflow-hidden"
                          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                          <button onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center transition-colors"
                            style={{ color: 'var(--text-muted)' }}>
                            {Icons.minus}
                          </button>
                          <span className="w-8 text-center text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center transition-colors"
                            style={{ color: 'var(--accent-light)' }}>
                            {Icons.plus}
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color: 'var(--danger)' }}>
                          {Icons.trash}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Jami
                  </span>
                  <span className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    {formatPrice(cartTotal)} <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>so'm</span>
                  </span>
                </div>
                <button
                  onClick={() => { setShowCart(false); setShowCheckout(true); }}
                  className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                    boxShadow: '0 8px 24px -4px rgba(99, 102, 241, 0.35)',
                  }}
                >
                  Buyurtma berish {Icons.send}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════ CHECKOUT MODAL ══════════ */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
            onClick={() => !orderSending && setShowCheckout(false)} />
          <div className="absolute bottom-0 left-0 right-0 animate-slide-up"
            style={{ background: 'var(--bg-primary)', borderRadius: '24px 24px 0 0', border: '1px solid var(--border)', borderBottom: 'none' }}>

            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-hover)' }} />
            </div>

            {orderSent ? (
              <div className="flex flex-col items-center py-12 px-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-float"
                  style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Buyurtma qabul qilindi!
                </h3>
                <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                  Tez orada siz bilan bog'lanamiz
                </p>
              </div>
            ) : (
              <div className="px-5 py-4">
                <h2 className="text-lg font-extrabold mb-5" style={{ color: 'var(--text-primary)' }}>
                  Buyurtma ma'lumotlari
                </h2>

                <div className="space-y-3">
                  {/* Name */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                      {Icons.user}
                    </div>
                    <input
                      type="text"
                      placeholder="Ismingiz"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                      {Icons.phone}
                    </div>
                    <input
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  {/* Address */}
                  <div className="relative">
                    <div className="absolute left-3 top-3.5" style={{ color: 'var(--text-muted)' }}>
                      {Icons.mapPin}
                    </div>
                    <textarea
                      placeholder="Yetkazib berish manzili"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium resize-none"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>{cart.length} ta mahsulot</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{formatPrice(cartTotal)} so'm</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>Yetkazib berish</span>
                    <span className="font-bold" style={{ color: 'var(--success)' }}>Bepul</span>
                  </div>
                </div>

                <button
                  onClick={submitOrder}
                  disabled={orderSending || !customerName.trim() || !customerPhone.trim() || !address.trim()}
                  className="w-full mt-4 mb-4 py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                    boxShadow: '0 8px 24px -4px rgba(99, 102, 241, 0.35)',
                  }}
                >
                  {orderSending ? 'Yuborilmoqda...' : 'Buyurtmani tasdiqlash'}
                  {!orderSending && Icons.send}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
