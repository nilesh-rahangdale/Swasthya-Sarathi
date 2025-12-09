import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa';
import Layout from '../../components/layouts/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Loader from '../../components/common/Loader';
import { searchMedicines, setUserLocation } from '../../redux/slices/customerSlice';
import { getCurrentLocation } from '../../utils/location';
import { formatCurrency } from '../../utils/formatters';

const SearchMedicine = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, searchMetadata, userLocation, loading } = useSelector(state => state.customer);

  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState(3); // 3km default
  const [cart, setCart] = useState({});

  useEffect(() => {
    // Get user location on mount
    if (!userLocation) {
      handleGetLocation();
    }
  }, []);

  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      dispatch(setUserLocation(location));
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }

    if (!userLocation) {
      alert('Please enable location access to search for medicines');
      return;
    }

    dispatch(searchMedicines({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius,
      medicineName: searchQuery.trim(),
    }));
  };

  const handleAddToCart = (pharmacy) => {
    const key = `${pharmacy.pharmacyId}-${pharmacy.medicineName}`;
    const currentQty = cart[key]?.quantity || 0;
    
    setCart({
      ...cart,
      [key]: {
        pharmacy,
        quantity: currentQty + 1,
      },
    });
  };

  const handleRemoveFromCart = (pharmacy) => {
    const key = `${pharmacy.pharmacyId}-${pharmacy.medicineName}`;
    const currentQty = cart[key]?.quantity || 0;
    
    if (currentQty > 1) {
      setCart({
        ...cart,
        [key]: {
          pharmacy,
          quantity: currentQty - 1,
        },
      });
    } else {
      const newCart = { ...cart };
      delete newCart[key];
      setCart(newCart);
    }
  };

  const getCartQuantity = (pharmacy) => {
    const key = `${pharmacy.pharmacyId}-${pharmacy.medicineName}`;
    return cart[key]?.quantity || 0;
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    // Group cart items by pharmacy
    const ordersByPharmacy = {};
    Object.values(cart).forEach(item => {
      const pharmacyId = item.pharmacy.pharmacyId;
      if (!ordersByPharmacy[pharmacyId]) {
        ordersByPharmacy[pharmacyId] = {
          pharmacy: {
            _id: item.pharmacy.pharmacyId,
            name: item.pharmacy.pharmacyName,
            address: item.pharmacy.address,
            contactNumber: item.pharmacy.ownerContact,
          },
          medicines: [],
        };
      }
      ordersByPharmacy[pharmacyId].medicines.push({
        medicineName: item.pharmacy.medicineName,
        quantity: item.quantity,
        price: item.pharmacy.price,
        total: item.pharmacy.price * item.quantity,
      });
    });

    navigate('/customer/checkout', { state: { ordersByPharmacy } });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Search Medicine</h1>
          {getTotalItems() > 0 && (
            <Button onClick={handleProceedToCheckout} className="flex items-center gap-2">
              <FaShoppingCart />
              Proceed to Checkout ({getTotalItems()} items)
            </Button>
          )}
        </div>

        {/* Location Info */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" />
              <span className="text-gray-700">
                {userLocation
                  ? `Searching within ${radius }km of your location`
                  : 'Location not detected'}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleGetLocation}>
              {userLocation ? 'Update Location' : 'Get Location'}
            </Button>
          </div>
        </Card>

        {/* Search Form */}
        <Card className="mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Medicine Name"
                  placeholder="Enter medicine name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Radius
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2}>2 km</option>
                  <option value={3}>3 km</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={20}>20 km</option>
                </select>
              </div>
            </div>
            <Button type="submit" disabled={loading || !userLocation} className="flex items-center gap-2">
              <FaSearch />
              Search
            </Button>
          </form>
        </Card>

        {/* Results */}
        {loading ? (
          <Loader />
        ) : searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchMetadata && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  {searchMetadata.message}
                </p>
              </div>
            )}
            {searchResults.map((pharmacy, idx) => {
              const cartQty = getCartQuantity(pharmacy);
              return (
                <Card key={`${pharmacy.pharmacyId}-${idx}`}>
                  <div className="mb-4 border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-800">{pharmacy.pharmacyName}</h3>
                    <p className="text-gray-600 text-sm">{pharmacy.address}</p>
                    <p className="text-gray-500 text-sm">
                      📍 {pharmacy.distance}
                    </p>
                    <p className="text-gray-600 text-sm">👤 {pharmacy.ownerName}</p>
                    <p className="text-gray-600 text-sm">📞 {pharmacy.ownerContact}</p>
                  </div>

                  {/* Medicine Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-4">
                      {/* Medicine Image */}
                      {pharmacy.medicineImage && (
                        <img
                          src={pharmacy.medicineImage}
                          alt={pharmacy.medicineName}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      
                      {/* Medicine Info */}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{pharmacy.medicineName}</p>
                        <p className="text-sm text-gray-600">
                          Price: {formatCurrency(pharmacy.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Stock: {pharmacy.stock} units
                        </p>
                        <p className={`text-sm font-medium ${pharmacy.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {pharmacy.isAvailable ? '✓ In Stock' : '✗ Out of Stock'}
                        </p>
                      </div>
                      
                      {/* Cart Actions */}
                      <div className="flex items-center gap-2">
                        {cartQty > 0 ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveFromCart(pharmacy)}
                            >
                              -
                            </Button>
                            <span className="font-medium w-8 text-center">{cartQty}</span>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(pharmacy)}
                              disabled={!pharmacy.isAvailable}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(pharmacy)}
                            disabled={!pharmacy.isAvailable}
                          >
                            <FaShoppingCart className="mr-1" />
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <p className="text-gray-500 text-center py-8">
              {searchQuery
                ? 'No medicines found. Try adjusting your search or radius.'
                : 'Enter a medicine name to search nearby pharmacies.'}
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SearchMedicine;
