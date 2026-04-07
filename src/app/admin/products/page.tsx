'use client';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/categories')
    ]);
    const prodData = await prodRes.json();
    const catData = await catRes.json();
    setProducts(prodData);
    setCategories(catData);
    if (catData.length > 0) setCategoryId(catData[0].id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, base64: reader.result }),
      });
      const data = await res.json();
      setImage(data.url);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, categoryId, image }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setName('');
        setDescription('');
        setPrice('');
        setImage('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📦 Mahsulotlar</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
        >
          + Yangi mahsulot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div key={prod.id} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-xl hover:scale-[1.02] transition-transform duration-300">
            {prod.image ? (
              <img src={prod.image} alt={prod.name} className="w-full h-48 object-cover border-b border-gray-700" />
            ) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-500 italic">Rasm yo'q</div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{prod.name}</h3>
                <span className="text-blue-400 font-mono text-sm">{prod.category?.name}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{prod.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-400">{prod.price.toLocaleString()} so'm</span>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 italic text-xl">
            Sizda hali mahsulotlar yo'q
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Yangi mahsulot qo'shish</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nomi</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mahsulot nomi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Narxi (so'm)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Kategoriya</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tavsif</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Mahsulot haqida batafsil..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Rasm (Yuklash)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image"
                    accept="image/*"
                  />
                  <label
                    htmlFor="product-image"
                    className="cursor-pointer bg-gray-700 hover:bg-gray-600 border border-gray-600 border-dashed rounded-lg px-6 py-8 flex-1 text-center transition-all"
                  >
                    {uploading ? 'Yuklanmoqda...' : image ? 'Rasm yuklandi ✅' : 'Rasm tanlash uchun bosing'}
                  </label>
                  {image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-600 relative group">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Saqlanmoqda...' : 'Saves Mahsulot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
