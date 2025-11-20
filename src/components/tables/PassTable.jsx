import { useState, useEffect } from 'react';
import { passAPI } from '../../services/api';
import Table from '../common/Table';
import Modal from '../common/Modal';

const columns = [
  { header: 'Pass ID', accessor: 'pass_id' },
  { header: 'Member ID', accessor: 'member_id' },
  { header: 'Seat ID', accessor: 'seat_id' },
  { 
    header: 'Start Time', 
    accessor: 'start_ts',
    render: (value) => value ? new Date(value).toLocaleString() : '-'
  },
  { 
    header: 'End Time', 
    accessor: 'end_ts',
    render: (value) => value ? new Date(value).toLocaleString() : '-'
  },
  { 
    header: 'Price', 
    accessor: 'price',
    render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '-'
  },
  { 
    header: 'Status', 
    accessor: 'status',
    render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${
        value === 'active' ? 'bg-green-100 text-green-800' :
        value === 'expired' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value || 'N/A'}
      </span>
    )
  },
];

function PassTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    member_id: '',
    seat_id: '',
    start_ts: '',
    end_ts: '',
    price: '',
    status: 'active',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await passAPI.getAll();
      setData(response.data || response);
    } catch (error) {
      console.error('Error fetching passes:', error);
      alert('Failed to fetch passes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      member_id: '',
      seat_id: '',
      start_ts: new Date().toISOString().slice(0, 16),
      end_ts: '',
      price: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      member_id: item.member_id || '',
      seat_id: item.seat_id || '',
      start_ts: item.start_ts ? new Date(item.start_ts).toISOString().slice(0, 16) : '',
      end_ts: item.end_ts ? new Date(item.end_ts).toISOString().slice(0, 16) : '',
      price: item.price || '',
      status: item.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete pass #${item.pass_id}?`)) {
      return;
    }

    try {
      await passAPI.delete(item.pass_id);
      alert('Pass deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting pass:', error);
      alert('Failed to delete pass: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await passAPI.update(editingItem.pass_id, formData);
        alert('Pass updated successfully!');
      } else {
        await passAPI.create(formData);
        alert('Pass created successfully!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving pass:', error);
      alert('Failed to save pass: ' + error.message);
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
          <h3 className="text-lg font-semibold text-gray-700">Total Passes: {data.length}</h3>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Pass</span>
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
        title={editingItem ? 'Edit Pass' : 'Add New Pass'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member ID *</label>
            <input
              type="number"
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seat ID *</label>
            <input
              type="number"
              name="seat_id"
              value={formData.seat_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
            <input
              type="datetime-local"
              name="start_ts"
              value={formData.start_ts}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
            <input
              type="datetime-local"
              name="end_ts"
              value={formData.end_ts}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
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

export default PassTable;
