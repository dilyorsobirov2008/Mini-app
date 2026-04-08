'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  Check,
  X,
  Package,
  Layers,
  DollarSign,
  TrendingUp,
  Box
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);
      if (catData.length > 0) setCategoryId(catData[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, base64: reader.result }),
        });
        const data = await res.json();
        setImage(data.url);
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, categoryId, image }),
      });

      if (res.ok) {
        setShowAddModal(false);
        // Clear form
        setName('');
        setDescription('');
        setPrice('');
        setImage('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const formatPrice = (p: number) => new Intl.NumberFormat('uz-UZ').format(p);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* ── Header Area ── */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-up">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">
            Inventory <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">Vault</span>
          </h1>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-glow" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{products.length} Items Total</p>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-glow-indigo" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{categories.length} Categories</p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Search & Filter */}
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Mahsulotlarni qidirish..."
                className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-blue-500/30 transition-all outline-none min-w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-blue-500 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
           >
            <Plus size={18} strokeWidth={3} /> Create New
           </button>
        </div>
      </header>

      {/* ── Category Toggles ── */}
      <div className="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
              selectedCat === 'all' 
                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                : 'bg-[#0c0c14] border-white/5 text-gray-500 hover:border-white/10'
            }`}
          >
            All Stock
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                selectedCat === cat.id 
                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                  : 'bg-[#0c0c14] border-white/5 text-gray-500 hover:border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
      </div>

      {/* ── Products Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {[1,2,3,4,5,6,7,8].map(i => (
             <div key={i} className="h-[450px] rounded-[40px] bg-white/5 animate-pulse" />
           ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 glass rounded-[60px] border-dashed border-2 border-white/5">
           <Package className="text-white/5 mb-8" size={120} strokeWidth={0.5} />
           <p className="text-[12px] font-black text-gray-600 uppercase tracking-[0.4em]">Vault is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 stagger-children">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="group relative h-[480px] rounded-[40px] overflow-hidden glass-elevated media-card-hover border-white/5 flex flex-col"
            >
              {/* Image Preview */}
              <div className="h-64 relative overflow-hidden bg-[#14141f]">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5">
                    <ImageIcon size={64} />
                  </div>
                )}
                {/* Overlay Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <span className="px-3 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">
                     {prod.category?.name || 'Uncategorized'}
                   </span>
                </div>
                
                {/* Floating Actions */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                   <button className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-2xl hover:bg-blue-400 hover:text-white transition-colors">
                      <Edit3 size={18} />
                   </button>
                   <button className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 border border-red-500/20 backdrop-blur-xl flex items-center justify-center shadow-2xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                   </button>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0c0c14] to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-black text-white tracking-tight mb-2 uppercase line-clamp-1">{prod.name}</h3>
                  <p className="text-gray-500 text-[11px] font-bold leading-relaxed line-clamp-2 uppercase tracking-wide">
                    {prod.description || 'N/A Descriptive meta tag'}
                  </p>
                </div>
                
                <div className="mt-auto flex items-end justify-between">
                   <div>
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Market Price</p>
                      <p className="text-2xl font-black text-white tracking-tighter">
                        {formatPrice(prod.price)} <span className="text-sm font-medium text-gray-600">so'm</span>
                      </p>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-green-400 text-[9px] font-black uppercase mb-1">
                        <TrendingUp size={12} /> Demand +
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">In Stock</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Product Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 z-[100] animate-fade-in">
          <div className="bg-[#0c0c14] rounded-[60px] p-12 max-w-5xl w-full border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8">
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <header className="mb-12">
               <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Vault <span className="text-blue-500">Registry</span></h2>
               <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Initialize a new asset in the ecosystem</p>
            </header>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left Column: Media */}
              <div className="space-y-8">
                 <div className="relative group">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="product-image"
                      accept="image/*"
                    />
                    <label
                      htmlFor="product-image"
                      className="cursor-pointer block aspect-video rounded-[32px] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 transition-all hover:border-blue-500/50 hover:bg-blue-500/5 group"
                    >
                      {uploading ? (
                        <div className="text-center">
                           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                           <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Uploading Media...</p>
                        </div>
                      ) : image ? (
                        <div className="relative w-full h-full p-2">
                           <img src={image} alt="Preview" className="w-full h-full object-cover rounded-[24px]" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-[24px]">
                              <p className="text-[10px] font-black text-white uppercase tracking-widest">Change Media Asset</p>
                           </div>
                        </div>
                      ) : (
                        <>
                           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-400 group-hover:scale-110 transition-all">
                              <Plus size={32} />
                           </div>
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors text-center">
                             Drop product visual here<br/><span className="text-gray-700 font-bold">Standard Media Format (4:3 / 16:9)</span>
                           </p>
                        </>
                      )}
                    </label>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Classification Details</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex flex-col gap-2">
                          <Layers className="text-indigo-400/50" size={20} />
                          <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Category Link</span>
                          <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="bg-transparent text-xs font-black text-white uppercase tracking-wider outline-none cursor-pointer"
                            required
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id} className="bg-[#0c0c14]">{cat.name}</option>
                            ))}
                          </select>
                       </div>
                       <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex flex-col gap-2">
                          <DollarSign className="text-green-400/50" size={20} />
                          <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Asset Valuation</span>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="bg-transparent text-xs font-black text-white uppercase tracking-wider outline-none"
                            placeholder="Price (UZS)"
                            required
                          />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Metadata */}
              <div className="flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Designation name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-white/5 py-4 text-3xl font-black text-white uppercase tracking-tighter outline-none focus:border-blue-500 transition-all placeholder:text-white/5"
                      placeholder="PRODUCT_X_MARK_I"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Descriptive Metadata</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-sm font-bold text-gray-300 outline-none focus:border-blue-500/30 transition-all min-h-[160px] resize-none"
                      placeholder="Detail the attributes of this asset in the ecosystem..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-12">
                   <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-5 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all"
                   >
                     Cancel Initiation
                   </button>
                   <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-[2] bg-white text-black font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-30"
                   >
                    {submitting ? 'Registering...' : 'Complete Registry'}
                   </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
