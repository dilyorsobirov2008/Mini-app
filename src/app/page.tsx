'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, ChevronRight, Package, Grid } from 'lucide-react';

export default function MiniApp() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/categories')
    ]);
    setProducts(await prodRes.json());
    setCategories(await catRes.json());
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-black/40 border-b border-white/5 px-6 py-6 transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            BOZORCHA
          </h1>
          <button 
            onClick={() => setShowCart(true)}
            className="relative p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-90"
          >
            <ShoppingCart size={24} className="text-blue-400" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        {/* Hero Search */}
        <div className="mb-10 group">
          <div className="relative overflow-hidden p-[1px] rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 transition-all group-hover:from-blue-500/50">
            <div className="bg-black/80 backdrop-blur-xl rounded-[23px] flex items-center p-2">
              <Search className="ml-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Mahsulotlarni qidiring..."
                className="w-full bg-transparent border-none text-lg px-4 py-3 focus:outline-none placeholder:text-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-2xl border transition-all whitespace-nowrap font-bold flex items-center gap-2 ${
              selectedCategory === 'all' 
              ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]' 
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Grid size={18} /> Hammasi
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-2xl border transition-all whitespace-nowrap font-bold ${
                selectedCategory === cat.id 
                ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="group relative bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden hover:border-blue-500/40 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.2)]"
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={prod.image || '/placeholder.png'} 
                  alt={prod.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                  {prod.category?.name}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{prod.name}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{prod.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Narxi</span>
                    <span className="text-2xl font-black text-white">{prod.price.toLocaleString()}<span className="text-sm ml-1 opacity-40">UZS</span></span>
                  </div>
                  <button 
                    onClick={() => addToCart(prod)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-4 rounded-[20px] transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                  >
                    QO'SHISH
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <Package className="mx-auto text-gray-800 mb-6" size={80} />
              <p className="text-gray-500 text-xl font-medium">Mahsulotlar topilmadi</p>
            </div>
          )}
        </div>
      </main>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 max-w-md w-full bg-[#0a0a0a] border-l border-white/10 shadow-3xl flex flex-col transform transition-transform animate-in slide-in-from-right">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                SAVATCHA <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full uppercase italic">{cart.length}</span>
              </h2>
              <button 
                onClick={() => setShowCart(false)}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold uppercase text-sm mb-1">{item.name}</h4>
                    <p className="text-blue-400 font-bold mb-2">{item.price.toLocaleString()} UZS</p>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setCart(cart.map(c => c.id === item.id ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c))}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-mono">{item.quantity}</span>
                      <button 
                         onClick={() => setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))}
                         className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                        className="ml-auto text-red-500"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-20 text-gray-600 italic">Savatchangiz bo'sh</div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-black/40">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Jami summa</p>
                  <p className="text-3xl font-black text-white">{cartTotal.toLocaleString()} <span className="text-sm font-normal text-gray-500">UZS</span></p>
                </div>
              </div>
              <button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black py-5 rounded-2xl text-lg transition-transform active:scale-[0.98] shadow-2xl shadow-blue-500/20 disabled:opacity-30 flex items-center justify-center gap-3"
                disabled={cart.length === 0}
                onClick={() => {
                  alert('Buyurtma berish uchun Telegram botga yuborilmoqda...');
                  // In a real app, send data to API and then notify admin
                }}
              >
                BUYURTMANI TASDIQLASH <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
