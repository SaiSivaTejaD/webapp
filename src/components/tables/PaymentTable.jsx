import { useState, useEffect } from 'react';
import { paymentAPI } from '../../services/api';
import Table from '../common/Table';
import Modal from '../common/Modal';

const columns = [
  { header: 'Payment ID', accessor: 'payment_id' },
  { header: 'Member ID', accessor: 'member_id' },
  { header: 'Ref Type', accessor: 'ref_type' },
  { header: 'Ref ID', accessor: 'ref_id' },
  { 
    header: 'Amount', 
    accessor: 'amount',
    render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '-'
  },
  { header: 'Method', accessor: 'method' },
  { 
    header: 'Paid At', 
    accessor: 'paid_at',
    render: (value) => value ? new Date(value).toLocaleString() : '-'
  },
];

function PaymentTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    member_id: '',
    ref_type: '',
    ref_id: '',
    amount: '',
    method: '',
    paid_at: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await paymentAPI.getAll();
      setData(response.data || response);
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Failed to fetch payments: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      member_id: '',
      ref_type: '',
      ref_id: '',
      amount: '',
      method: 'cash',
      paid_at: new Date().toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      member_id: item.member_id || '',
      ref_type: item.ref_type || '',
      ref_id: item.ref_id || '',
      amount: item.amount || '',
      method: item.method || 'cash',
      paid_at: item.paid_at ? new Date(item.paid_at).toISOString().slice(0, 16) : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete payment #${item.payment_id}?`)) {
      return;
    }

    try {
      await paymentAPI.delete(item.payment_id);
      alert('Payment deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Failed to delete payment: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await paymentAPI.update(editingItem.payment_id, formData);
        alert('Payment updated successfully!');
      } else {
        await paymentAPI.create(formData);
        alert('Payment created successfully!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to save payment: ' + error.message);
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
          <h3 className="text-lg font-semibold text-gray-700">Total Payments: {data.length}</h3>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Payment</span>
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
        title={editingItem ? 'Edit Payment' : 'Add New Payment'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference Type *</label>
            <select
              name="ref_type"
              value={formData.ref_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Type</option>
              <option value="pass">Pass</option>
              <option value="tournament">Tournament</option>
              <option value="membership">Membership</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID *</label>
            <input
              type="number"
              name="ref_id"
              value={formData.ref_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid At *</label>
            <input
              type="datetime-local"
              name="paid_at"
              value={formData.paid_at}
              onChange={handleChange}
              required
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

export default PaymentTable;
