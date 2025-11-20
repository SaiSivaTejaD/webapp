import { useState, useEffect } from 'react';
import { registrationAPI } from '../../services/api';
import Table from '../common/Table';
import Modal from '../common/Modal';

const columns = [
  { header: 'Registration ID', accessor: 'registration_id' },
  { header: 'Tournament ID', accessor: 'tourney_id' },
  { header: 'Member ID', accessor: 'member_id' },
  { header: 'Seed No', accessor: 'seed_no' },
  { header: 'Result', accessor: 'result' },
];

function RegistrationTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    tourney_id: '',
    member_id: '',
    seed_no: '',
    result: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await registrationAPI.getAll();
      setData(response.data || response);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      alert('Failed to fetch registrations: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      tourney_id: '',
      member_id: '',
      seed_no: '',
      result: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      tourney_id: item.tourney_id || '',
      member_id: item.member_id || '',
      seed_no: item.seed_no || '',
      result: item.result || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete registration #${item.registration_id}?`)) {
      return;
    }

    try {
      await registrationAPI.delete(item.registration_id);
      alert('Registration deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert('Failed to delete registration: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await registrationAPI.update(editingItem.registration_id, formData);
        alert('Registration updated successfully!');
      } else {
        await registrationAPI.create(formData);
        alert('Registration created successfully!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Failed to save registration: ' + error.message);
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
          <h3 className="text-lg font-semibold text-gray-700">Total Registrations: {data.length}</h3>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Registration</span>
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
        title={editingItem ? 'Edit Registration' : 'Add New Registration'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tournament ID *</label>
            <input
              type="number"
              name="tourney_id"
              value={formData.tourney_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Seed Number</label>
            <input
              type="number"
              name="seed_no"
              value={formData.seed_no}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
            <input
              type="text"
              name="result"
              value={formData.result}
              onChange={handleChange}
              placeholder="e.g., Winner, Runner-up, Quarter-final"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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

export default RegistrationTable;
