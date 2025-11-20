import { useState, useEffect } from 'react';
import { seatAPI } from '../../services/api';
import Table from '../common/Table';
import Modal from '../common/Modal';

const columns = [
  { header: 'Seat ID', accessor: 'seat_id' },
  { header: 'Label', accessor: 'label' },
  { header: 'Type', accessor: 'type' },
  { 
    header: 'Status', 
    accessor: 'status',
    render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${
        value === 'available' ? 'bg-green-100 text-green-800' :
        value === 'occupied' ? 'bg-red-100 text-red-800' :
        value === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value || 'N/A'}
      </span>
    )
  },
];

function SeatTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    type: '',
    status: 'available',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await seatAPI.getAll();
      setData(response.data || response);
    } catch (error) {
      console.error('Error fetching seats:', error);
      alert('Failed to fetch seats: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      label: '',
      type: '',
      status: 'available',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label || '',
      type: item.type || '',
      status: item.status || 'available',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete seat "${item.label}"?`)) {
      return;
    }

    try {
      await seatAPI.delete(item.seat_id);
      alert('Seat deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting seat:', error);
      alert('Failed to delete seat: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await seatAPI.update(editingItem.seat_id, formData);
        alert('Seat updated successfully!');
      } else {
        await seatAPI.create(formData);
        alert('Seat created successfully!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving seat:', error);
      alert('Failed to save seat: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Total Seats: {data.length}</h3>
          <div className="flex gap-4 mt-2">
            <span className="text-sm text-green-600">
              Available: {data.filter(s => s.status === 'available').length}
            </span>
            <span className="text-sm text-red-600">
              Occupied: {data.filter(s => s.status === 'occupied').length}
            </span>
            <span className="text-sm text-yellow-600">
              Maintenance: {data.filter(s => s.status === 'maintenance').length}
            </span>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Seat</span>
        </button>
      </div>

      <Table
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Seat' : 'Add New Seat'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
              placeholder="e.g., A1, B2, VIP-01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Type</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
              <option value="gaming">Gaming</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default SeatTable;
