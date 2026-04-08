'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Layers, 
  Search, 
  Hash, 
  ChevronRight, 
  Trash2, 
  Box,
  LayoutGrid
} from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAdding(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });

      if (res.ok) {
        setNewCategory('');
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  }, [newCategory, fetchCategories]);

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      {/* ── Header ── */}
      <header className="mb-14">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">
          Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 italic">Architecture</span>
        </h1>
        <div className="flex items-center gap-3">
           <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-full">Hierarchy Managed</span>
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{categories.length} Categories Defined</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* ── Left side: Create Category ── */}
        <div className="xl:col-span-1">
           <div className="glass-elevated rounded-[48px] p-10 border border-white/5 shadow-3xl sticky top-28">
              <h2 className="text-xl font-black uppercase tracking-tight mb-8">Initialize Node</h2>
              <form onSubmit={handleAddCategory} className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Category Designation</label>
                    <div className="relative group">
                       <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                       <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-sm font-bold placeholder:text-gray-700 focus:border-purple-500/30 transition-all outline-none"
                        placeholder="e.g. ELECTRONICS_MOD_I"
                        disabled={adding}
                       />
                    </div>
                 </div>

                 <button
                  type="submit"
                  disabled={adding || !newCategory.trim()}
                  className="w-full py-5 rounded-2xl bg-white text-black font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                 >
                   {adding ? 'Registering...' : <><Plus size={18} strokeWidth={3} /> Inject into Grid</>}
                 </button>
              </form>

              <div className="mt-12 pt-8 border-t border-white/5">
                 <p className="text-gray-500 text-[10px] font-bold leading-relaxed uppercase tracking-wider">
                   Kategoriyalar tizim ierarxiyasini belgilaydi. Har bir kategoriya noyob slugga ega bo'ladi va mahsulotlarni guruhlash uchun ishlatiladi.
                 </p>
              </div>
           </div>
        </div>

        {/* ── Right side: Category List ── */}
        <div className="xl:col-span-2">
           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-40 rounded-[32px] bg-white/5 animate-pulse" />)}
             </div>
           ) : categories.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-32 glass rounded-[48px] border-dashed border-2 border-white/5">
                <Layers className="text-white/5 mb-6" size={80} strokeWidth={0.5} />
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">No architectural nodes found</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    className="group glass p-8 rounded-[40px] border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-[24px] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-500 group-hover:bg-purple-500 group-hover:text-white shadow-xl shadow-purple-500/0 group-hover:shadow-purple-500/20">
                          <Hash size={24} strokeWidth={3} />
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{cat.name}</h3>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-bold text-gray-500 font-mono tracking-tighter">slug: {cat.slug}</span>
                             <div className="w-1 h-1 bg-gray-700 rounded-full" />
                             <span className="text-[10px] font-black text-purple-400 uppercase flex items-center gap-1">
                               <Box size={10} /> {cat._count?.products || 0} Assets
                             </span>
                          </div>
                       </div>
                    </div>
                    
                    <button className="p-3 rounded-xl bg-white/5 text-gray-600 hover:bg-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                       <Trash2 size={18} />
                    </button>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
