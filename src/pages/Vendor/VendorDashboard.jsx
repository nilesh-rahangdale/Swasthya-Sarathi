import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaBoxOpen, FaClipboardList, FaPlus, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import Layout from '../../components/layouts/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/common/Loader';
import { getVendorPharmacies } from '../../redux/slices/vendorSlice';
import { APPROVAL_STATUS } from '../../utils/constants';

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pharmacies, loading } = useSelector(state => state.vendor);

  const { error } = useSelector(state => state.vendor);

  useEffect(() => {
    dispatch(getVendorPharmacies());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case APPROVAL_STATUS.APPROVED:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <FaCheckCircle /> Approved
          </span>
        );
      case APPROVAL_STATUS.REJECTED:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <FaTimesCircle /> Rejected
          </span>
        );
      case APPROVAL_STATUS.PENDING:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <FaClock /> Pending Approval
          </span>
        );
      default:
        return null;
    }
  };

  const approvedPharmacies = Array.isArray(pharmacies) ? pharmacies.filter(p => p.approvalStatus === APPROVAL_STATUS.APPROVED) : [];
  const pendingPharmacies = Array.isArray(pharmacies) ? pharmacies.filter(p => p.approvalStatus === APPROVAL_STATUS.PENDING) : [];
  const rejectedPharmacies = Array.isArray(pharmacies) ? pharmacies.filter(p => p.approvalStatus === APPROVAL_STATUS.REJECTED) : [];

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card>
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
          <Button onClick={() => navigate('/vendor/register-pharmacy')} className="flex items-center gap-2">
            <FaPlus />
            Register New Pharmacy
          </Button>
        </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
          <Button onClick={() => navigate('/vendor/register-pharmacy')} className="flex items-center gap-2">
            <FaPlus />
            Register New Pharmacy
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaStore className="text-2xl text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Total Pharmacies</h3>
            <p className="text-3xl font-bold text-gray-800">{pharmacies.length}</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{approvedPharmacies.length}</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingPharmacies.length}</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaTimesCircle className="text-2xl text-red-600" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">{rejectedPharmacies.length}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/vendor/register-pharmacy')}
              variant="outline"
              className="flex items-center justify-center gap-2 py-4"
            >
              <FaPlus />
              Register Pharmacy
            </Button>
            <Button
              onClick={() => navigate('/vendor/manage-inventory')}
              variant="outline"
              className="flex items-center justify-center gap-2 py-4"
              disabled={approvedPharmacies.length === 0}
            >
              <FaBoxOpen />
              Manage Inventory
            </Button>
            <Button
              onClick={() => navigate('/vendor/orders')}
              variant="outline"
              className="flex items-center justify-center gap-2 py-4"
              disabled={approvedPharmacies.length === 0}
            >
              <FaClipboardList />
              View Orders
            </Button>
          </div>
        </Card>

        {/* Pharmacies List */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Pharmacies</h2>
        
        {pharmacies.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FaStore className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-4">No pharmacies registered yet</p>
              <Button onClick={() => navigate('/vendor/register-pharmacy')}>
                Register Your First Pharmacy
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {pharmacies.map((pharmacy) => (
              <Card key={pharmacy._id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{pharmacy.name}</h3>
                    <p className="text-gray-600 text-sm">{pharmacy.address}</p>
                  </div>
                  {getStatusBadge(pharmacy.approvalStatus)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">License Number</p>
                    <p className="font-medium text-gray-800">{pharmacy.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium text-gray-800">{pharmacy.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Inventory Items</p>
                    <p className="font-medium text-gray-800">{pharmacy.inventory?.length || 0}</p>
                  </div>
                </div>

                {pharmacy.approvalStatus === APPROVAL_STATUS.PENDING && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <p className="text-sm text-yellow-800">
                      ⏳ Your pharmacy is awaiting admin approval. You'll be notified once it's reviewed.
                    </p>
                  </div>
                )}

                {pharmacy.approvalStatus === APPROVAL_STATUS.REJECTED && pharmacy.rejectionReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{pharmacy.rejectionReason}</p>
                    <p className="text-xs text-red-600 mt-2">
                      Please address the issue and register a new pharmacy or contact support.
                    </p>
                  </div>
                )}

                {pharmacy.approvalStatus === APPROVAL_STATUS.APPROVED && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate('/vendor/manage-inventory')}
                      className="flex items-center gap-2"
                    >
                      <FaBoxOpen />
                      Manage Inventory
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/vendor/orders')}
                      className="flex items-center gap-2"
                    >
                      <FaClipboardList />
                      View Orders
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VendorDashboard;
