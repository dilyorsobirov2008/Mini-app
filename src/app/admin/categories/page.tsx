'use client';
import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setLoading(true);

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
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📂 Kategoriyalar</h1>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-300">Yangi kategoriya qo'shish</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masalan: Elektronika"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-lg transition-colors disabled:opacity-50"
          >
            Qo'shish
          </button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700/50 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-300 uppercase text-sm tracking-wider">Nomi</th>
              <th className="px-6 py-4 font-semibold text-gray-300 uppercase text-sm tracking-wider">Slug</th>
              <th className="px-6 py-4 font-semibold text-gray-300 uppercase text-sm tracking-wider text-right">Mahsulotlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4 font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-gray-400 font-mono text-sm">{cat.slug}</td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {cat._count?.products || 0}
                  </span>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                  Kategoriyalar mavjud emas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
