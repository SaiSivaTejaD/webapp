import { useState, useEffect } from 'react';
import { tournamentAPI } from '../../services/api';
import Table from '../common/Table';
import Modal from '../common/Modal';

const columns = [
  { header: 'Tournament ID', accessor: 'tourney_id' },
  { header: 'Title', accessor: 'title' },
  { header: 'Game', accessor: 'game' },
  { 
    header: 'Date', 
    accessor: 'date_ts',
    render: (value) => value ? new Date(value).toLocaleString() : '-'
  },
  { 
    header: 'Entry Fee', 
    accessor: 'entry_fee',
    render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '-'
  },
  { 
    header: 'Prize Pool', 
    accessor: 'prize_pool',
    render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '-'
  },
  { header: 'Sponsor ID', accessor: 'sponsor_id' },
];

function TournamentTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    game: '',
    date_ts: '',
    entry_fee: '',
    prize_pool: '',
    sponsor_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await tournamentAPI.getAll();
      setData(response.data || response);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      alert('Failed to fetch tournaments: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      game: '',
      date_ts: new Date().toISOString().slice(0, 16),
      entry_fee: '',
      prize_pool: '',
      sponsor_id: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      game: item.game || '',
      date_ts: item.date_ts ? new Date(item.date_ts).toISOString().slice(0, 16) : '',
      entry_fee: item.entry_fee || '',
      prize_pool: item.prize_pool || '',
      sponsor_id: item.sponsor_id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete tournament "${item.title}"?`)) {
      return;
    }

    try {
      await tournamentAPI.delete(item.tourney_id);
      alert('Tournament deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Failed to delete tournament: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await tournamentAPI.update(editingItem.tourney_id, formData);
        alert('Tournament updated successfully!');
      } else {
        await tournamentAPI.create(formData);
        alert('Tournament created successfully!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving tournament:', error);
      alert('Failed to save tournament: ' + error.message);
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
          <h3 className="text-lg font-semibold text-gray-700">Total Tournaments: {data.length}</h3>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Tournament</span>
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
        title={editingItem ? 'Edit Tournament' : 'Add New Tournament'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Game *</label>
            <input
              type="text"
              name="game"
              value={formData.game}
              onChange={handleChange}
              required
              placeholder="e.g., Chess, Poker, FIFA"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
            <input
              type="datetime-local"
              name="date_ts"
              value={formData.date_ts}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee</label>
            <input
              type="number"
              step="0.01"
              name="entry_fee"
              value={formData.entry_fee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prize Pool</label>
            <input
              type="number"
              step="0.01"
              name="prize_pool"
              value={formData.prize_pool}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor ID</label>
            <input
              type="number"
              name="sponsor_id"
              value={formData.sponsor_id}
              onChange={handleChange}
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

export default TournamentTable;
