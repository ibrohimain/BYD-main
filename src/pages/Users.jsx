// src/pages/Users.jsx (yangi – admin boshqaruvi)
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { users as initialUsers } from '../data/users';
import { Plus, Edit, Trash2, User, Mail, Lock, Shield } from 'lucide-react';

export default function Users() {
  const { user: currentUser, hasRole } = useAuth();
  const [usersList, setUsersList] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', role: 'operator', name: '' });

  if (!hasRole('admin')) {
    return <div className="text-center py-12 text-red-600">Ruxsat yo'q – faqat admin uchun!</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      // Tahrirlash
      setUsersList(prev => prev.map(u => u.id === editingUser.id ? { ...form, id: editingUser.id } : u));
      setEditingUser(null);
    } else {
      // Qo'shish
      const newUser = { ...form, id: Date.now() };
      setUsersList(prev => [...prev, newUser]);
    }
    setShowForm(false);
    setForm({ email: '', password: '', role: 'operator', name: '' });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ email: user.email, password: '', role: user.role, name: user.name });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('O\'chirishni tasdiqlang?')) {
      setUsersList(prev => prev.filter(u => u.id !== id));
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-red-600" />;
      case 'manager': return <User className="w-4 h-4 text-yellow-600" />;
      case 'operator': return <User className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Foydalanuvchilar Boshqaruvi</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Yangi User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-left">Ism</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rol</th>
              <th className="py-3 px-4 text-center">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4 flex items-center space-x-1">
                  {getRoleIcon(user.role)}
                  <span>{user.role}</span>
                </td>
                <td className="py-3 px-4 text-center space-x-2">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal forma */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingUser ? 'Tahrirlash' : 'Yangi User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Ism"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Parol"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required={!editingUser}
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="operator">Operator</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingUser(null); setForm({ email: '', password: '', role: 'operator', name: '' }); }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Bekor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}