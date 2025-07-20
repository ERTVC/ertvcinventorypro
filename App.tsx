import React, { useState, useMemo } from 'react';
import { Item, IssueRecord, Recipient, RecipientType, Page, UnitType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import IssueLog from './components/IssueLog';
import LoginPage from './components/LoginPage';
import RecipientsPage from './components/RecipientsPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Laptop Pro', quantity: 25, category: 'Electronics', dateAdded: '2023-10-01', unit: UnitType.PCS, isAsset: true, department: 'ICT Department' },
    { id: '2', name: 'Wireless Mouse', quantity: 50, category: 'Accessories', dateAdded: '2023-10-05', unit: UnitType.PCS, isAsset: true, department: 'ICT Department' },
    { id: '3', name: 'Projector', quantity: 10, category: 'Electronics', dateAdded: '2023-09-15', unit: UnitType.PCS, isAsset: true, department: 'Training Department' },
    { id: '4', name: 'Whiteboard Markers (Pack)', quantity: 100, category: 'Stationery', dateAdded: '2023-10-10', unit: UnitType.PCS, isAsset: false, department: 'Procurement' },
    { id: '5', name: 'Office Chair', quantity: 5, category: 'Furniture', dateAdded: '2023-08-20', unit: UnitType.PCS, isAsset: true, department: 'Administration' },
    { id: '6', name: 'Notebooks (Pack of 10)', quantity: 200, category: 'Stationery', dateAdded: '2023-10-12', unit: UnitType.PCS, isAsset: false, department: 'Procurement' },
    { id: '7', name: 'Cooking Oil', quantity: 30, category: 'Consumables', dateAdded: '2023-10-20', unit: UnitType.KGS, isAsset: false, department: 'Kitchen' },
    { id: '8', name: 'Rice', quantity: 150, category: 'Consumables', dateAdded: '2023-10-20', unit: UnitType.KGS, isAsset: false, department: 'Kitchen' },
    { id: '9', name: 'Chef Knife Set', quantity: 3, category: 'Equipment', dateAdded: '2023-09-01', unit: UnitType.PCS, isAsset: true, department: 'Kitchen' },
  ]);

  const [issueRecords, setIssueRecords] = useState<IssueRecord[]>([
    { id: 'rec1', itemId: '1', itemName: 'Laptop Pro', quantityIssued: 1, recipientName: 'John Doe (TRN001)', recipientType: RecipientType.TRAINER, dateIssued: '2023-10-15', unit: UnitType.PCS, returnDate: '2023-11-15' },
    { id: 'rec2', itemId: '4', itemName: 'Whiteboard Markers (Pack)', quantityIssued: 5, recipientName: 'Jane Smith (ADM015)', recipientType: RecipientType.TRAINEE, dateIssued: '2023-10-16', unit: UnitType.PCS },
    { id: 'rec3', itemId: '2', itemName: 'Wireless Mouse', quantityIssued: 1, recipientName: 'Peter Jones (NTS005)', recipientType: RecipientType.NON_TEACHING_STAFF, dateIssued: '2023-10-17', unit: UnitType.PCS, returnDate: '2023-11-01' },
    { id: 'rec4', itemId: '3', itemName: 'Projector', quantityIssued: 1, recipientName: 'Alice Johnson (ADM1001)', recipientType: RecipientType.TRAINEE, dateIssued: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], unit: UnitType.PCS, returnDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  ]);

  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: 'trainee1', name: 'Alice Johnson', identifier: 'ADM1001', type: RecipientType.TRAINEE },
    { id: 'trainee2', name: 'Bob Williams', identifier: 'ADM1002', type: RecipientType.TRAINEE },
    { id: 'trainer1', name: 'Charles Brown', identifier: 'TRN2001', type: RecipientType.TRAINER },
    { id: 'staff1', name: 'Diana Miller', identifier: 'NTS3001', type: RecipientType.NON_TEACHING_STAFF },
  ]);

  const handleAddItem = (item: Omit<Item, 'id' | 'dateAdded'>) => {
    const newItem: Item = {
      ...item,
      id: new Date().toISOString(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleIssueItem = (issueDetails: Omit<IssueRecord, 'id' | 'dateIssued' | 'itemName' | 'unit'>) => {
    const itemToUpdate = items.find(item => item.id === issueDetails.itemId);
    if (itemToUpdate && itemToUpdate.quantity >= issueDetails.quantityIssued) {
      const newIssueRecord: IssueRecord = {
        ...issueDetails,
        id: new Date().toISOString(),
        itemName: itemToUpdate.name,
        unit: itemToUpdate.unit,
        dateIssued: new Date().toISOString().split('T')[0],
      };

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === issueDetails.itemId
            ? { ...item, quantity: item.quantity - issueDetails.quantityIssued }
            : item
        )
      );

      setIssueRecords(prevRecords => [newIssueRecord, ...prevRecords]);
      return true;
    }
    alert('Not enough stock to issue the requested quantity.');
    return false;
  };

  const handleAddRecipient = (recipient: Omit<Recipient, 'id'>) => {
    const newRecipient: Recipient = {
      ...recipient,
      id: new Date().toISOString(),
    };
    setRecipients(prev => [newRecipient, ...prev]);
  };

  const handleImportRecipients = (importedRecipients: Omit<Recipient, 'id'>[]) => {
    const existingIdentifiers = new Set(recipients.map(r => r.identifier.toLowerCase()));
    const newUniqueRecipients = importedRecipients
      .filter(r => !existingIdentifiers.has(r.identifier.toLowerCase()))
      .map(r => ({ ...r, id: `imported-${Date.now()}-${Math.random()}` }));
    
    setRecipients(prev => [...newUniqueRecipients, ...prev]);
    alert(`${newUniqueRecipients.length} new recipients imported successfully. ${importedRecipients.length - newUniqueRecipients.length} duplicates were ignored.`);
  };


  const dashboardStats = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockItems = items.filter(item => item.quantity <= 10).length;
    const totalIssued = issueRecords.reduce((sum, record) => sum + record.quantityIssued, 0);
    const categories = [...new Set(items.map(item => item.category))].length;
    return { totalItems, lowStockItems, totalIssued, categories };
  }, [items, issueRecords]);

  const handleLogin = (user: string, pass: string) => {
    if (user === 'admin' && pass === 'password') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard stats={dashboardStats} items={items} issueRecords={issueRecords} />;
      case Page.INVENTORY:
        return <Inventory items={items} recipients={recipients} onAddItem={handleAddItem} onIssueItem={handleIssueItem} />;
      case Page.ISSUE_LOG:
        return <IssueLog records={issueRecords} />;
      case Page.RECIPIENTS:
        return <RecipientsPage recipients={recipients} onAddRecipient={handleAddRecipient} onImportRecipients={handleImportRecipients} />;
      default:
        return <Dashboard stats={dashboardStats} items={items} issueRecords={issueRecords}/>;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-secondary text-text-primary">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;