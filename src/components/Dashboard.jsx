import { useState } from 'react';
import MemberTable from './tables/MemberTable';
import PassTable from './tables/PassTable';
import PaymentTable from './tables/PaymentTable';
import RegistrationTable from './tables/RegistrationTable';
import SeatTable from './tables/SeatTable';
import SponsorTable from './tables/SponsorTable';
import TournamentTable from './tables/TournamentTable';

const TABLES = [
  { id: 'members', name: 'Members', icon: '👥', component: MemberTable },
  { id: 'passes', name: 'Passes', icon: '🎫', component: PassTable },
  { id: 'payments', name: 'Payments', icon: '💳', component: PaymentTable },
  { id: 'registrations', name: 'Registrations', icon: '📝', component: RegistrationTable },
  { id: 'seats', name: 'Seats', icon: '🪑', component: SeatTable },
  { id: 'sponsors', name: 'Sponsors', icon: '🤝', component: SponsorTable },
  { id: 'tournaments', name: 'Tournaments', icon: '🏆', component: TournamentTable },
];

function Dashboard({ onLogout }) {
  const [activeTable, setActiveTable] = useState('members');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const ActiveComponent = TABLES.find(t => t.id === activeTable)?.component;
  const activeTableName = TABLES.find(t => t.id === activeTable)?.name;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {isSidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {TABLES.map((table) => (
            <button
              key={table.id}
              onClick={() => setActiveTable(table.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center space-x-3 ${
                activeTable === table.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-2xl">{table.icon}</span>
              {isSidebarOpen && <span className="font-medium">{table.name}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center space-x-3 justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{activeTableName}</h2>
          <p className="text-gray-600 mt-1">Manage your {activeTableName.toLowerCase()} data</p>
        </header>

        <div className="px-6 pb-6">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
