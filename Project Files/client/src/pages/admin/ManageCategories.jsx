import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editMap, setEditMap] = useState({});

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:6001/fetch-categories');
    setCategories([...new Set(res.data)]); // Remove duplicates if any
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRename = async (oldCat) => {
    const newCat = editMap[oldCat]?.trim();
    if (!newCat || newCat === oldCat) return;

    await axios.put('http://localhost:6001/update-category', {
      oldCategory: oldCat,
      newCategory: newCat
    });

    setEditMap({});
    fetchCategories(); // Refresh list
  };

  return (
    <div className="container mt-4">
      <h3>Manage Categories</h3>
      {categories.map((cat, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <strong>{cat}</strong>
          <input
            type="text"
            placeholder="Rename category"
            value={editMap[cat] || ''}
            onChange={(e) => setEditMap({ ...editMap, [cat]: e.target.value })}
          />
          <button onClick={() => handleRename(cat)}>Update</button>
        </div>
      ))}
    </div>
  );
};

export default ManageCategories;
