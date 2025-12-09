import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorPharmacies, addInventory, getPharmacyInventory, updateInventory } from '../../redux/slices/vendorSlice';
import Layout from '../../components/layouts/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { FiPlus, FiPackage, FiEdit2, FiMinus } from 'react-icons/fi';

const ManageInventory = () => {
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    sellingPrice: '',
    purchasePrice: '',
    stock: '',
  });

  const dispatch = useDispatch();
  const { pharmacies, inventory, loading } = useSelector((state) => state.vendor);

  useEffect(() => {
    dispatch(getVendorPharmacies());
  }, [dispatch]);

  useEffect(() => {
    if (selectedPharmacy) {
      dispatch(getPharmacyInventory(selectedPharmacy));
    }
  }, [selectedPharmacy, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const inventoryData = {
      medicineName: formData.medicineName,
      sellingPrice: parseFloat(formData.sellingPrice),
      purchasePrice: parseFloat(formData.purchasePrice),
      stock: parseInt(formData.stock),
    };

    const result = await dispatch(addInventory({ 
      pharmacyId: selectedPharmacy, 
      inventoryData 
    }));
    
    if (!result.error) {
      setFormData({
        medicineName: '',
        sellingPrice: '',
        purchasePrice: '',
        stock: '',
      });
      setShowAddForm(false);
      setEditingItem(null);
      dispatch(getPharmacyInventory(selectedPharmacy));
    }
  };

  const handleStockAdjustment = async (item, adjustment) => {
    
    const inventoryData = {
      medicineName: item.medicineName,
      sellingPrice: item.sellingPrice,
      purchasePrice: item.purchasePrice,
      stock: adjustment+ item.stock,
    };

    const result = await dispatch(updateInventory({ 
      pharmacyId: selectedPharmacy, 
      inventoryData 
    }));
    
    if (!result.error) {
      dispatch(getPharmacyInventory(selectedPharmacy));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      medicineName: item.medicineName,
      sellingPrice: item.sellingPrice.toString(),
      purchasePrice: item.purchasePrice?.toString() || '',
      stock: '',
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      medicineName: '',
      sellingPrice: '',
      purchasePrice: '',
      stock: '',
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Inventory</h1>
            <p className="text-gray-600 mt-2">Add and manage medicines in your pharmacy</p>
          </div>
          {selectedPharmacy && (
            <Button
              variant="primary"
              icon={<FiPlus />}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              Add Medicine
            </Button>
          )}
        </div>

        {/* Pharmacy Selection */}
        <Card className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Pharmacy
          </label>
          <select
            value={selectedPharmacy}
            onChange={(e) => setSelectedPharmacy(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Select a Pharmacy --</option>
            {pharmacies?.filter(p => p.approvalStatus === 'approved').map((pharmacy) => (
              <option key={pharmacy._id} value={pharmacy._id}>
                {pharmacy.name} - {pharmacy.address}
              </option>
            ))}
          </select>
          {pharmacies?.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No approved pharmacies found. Please register a pharmacy first.
            </p>
          )}
        </Card>

        {/* Add/Edit Medicine Form */}
        {showAddForm && selectedPharmacy && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? `Update Stock - ${editingItem.medicineName}` : 'Add New Medicine'}
            </h2>
            {editingItem && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Current Stock: <strong>{editingItem.stock}</strong> units
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Enter positive number to add stock or negative to reduce (e.g., 10 or -5)
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Medicine Name"
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                placeholder="Enter medicine name"
                required
                disabled={editingItem !== null}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Purchase Price (₹)"
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />

                <Input
                  label="Selling Price (₹)"
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />

                <Input
                  label={editingItem ? 'Stock Adjustment (+/-)' : 'Initial Stock Quantity'}
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder={editingItem ? 'e.g., 10 or -5' : '0'}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary" loading={loading}>
                  {editingItem ? 'Update Stock' : 'Add to Inventory'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Inventory List */}
        {selectedPharmacy && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <FiPackage className="text-2xl text-primary-600" />
              <h2 className="text-xl font-semibold">Current Inventory</h2>
            </div>

            {inventory && inventory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Medicine Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Purchase Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Selling Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inventory.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.medicineName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">₹{item.purchasePrice?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">₹{item.sellingPrice?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.stock}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.stock > 10 
                              ? 'bg-green-100 text-green-800' 
                              : item.stock > 0 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStockAdjustment(item, 10)}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                              title="Add 10"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => handleStockAdjustment(item, -10)}
                              className="px-3 py-1 text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 rounded transition-colors"
                              title="Reduce 10"
                              disabled={item.stock < 10}
                            >
                              -10
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Adjust Stock"
                            >
                              <FiEdit2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiPackage className="mx-auto text-5xl mb-4 text-gray-300" />
                <p>No medicines in inventory yet</p>
                <p className="text-sm mt-2">Click "Add Medicine" to get started</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ManageInventory;
