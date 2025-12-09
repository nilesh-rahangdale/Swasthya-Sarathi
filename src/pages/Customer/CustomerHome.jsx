import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPills, FaStethoscope, FaShoppingCart, FaTruck, FaRobot } from 'react-icons/fa';
import Layout from '../../components/layouts/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const CustomerHome = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Search Medicines',
      description: 'Find medicines from nearby pharmacies with distance-based search',
      icon: FaSearch,
      color: 'bg-blue-100 text-blue-600',
      path: '/customer/search',
    },
    {
      title: 'Medicine Information',
      description: 'Get detailed AI-powered information about any medicine',
      icon: FaPills,
      color: 'bg-purple-100 text-purple-600',
      path: '/customer/medicine-info',
      badge: 'AI',
    },
    {
      title: 'Symptom Checker',
      description: 'AI-based symptom analysis and medicine suggestions',
      icon: FaStethoscope,
      color: 'bg-green-100 text-green-600',
      path: '/customer/symptom-checker',
      badge: 'AI',
    },
    {
      title: 'My Orders',
      description: 'Track your orders and view order history',
      icon: FaShoppingCart,
      color: 'bg-orange-100 text-orange-600',
      path: '/customer/orders',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Swasthya Sarathi
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your trusted medicine delivery platform with AI-powered health assistance
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate('/customer/search')}
              className="flex items-center gap-2"
            >
              <FaSearch />
              Search Medicines Now
            </Button>
            <Button
              onClick={() => navigate('/customer/symptom-checker')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FaStethoscope />
              Check Symptoms
            </Button>
          </div>
        </div>

        {/* AI Features Banner */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-100 rounded-full">
              <FaRobot className="text-4xl text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                AI-Powered Health Features
              </h2>
              <p className="text-gray-700">
                Experience our new AI-based medicine information and symptom checker tools 
                for better healthcare decisions.
              </p>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(feature.path)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-lg ${feature.color}`}>
                    <Icon className="text-3xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {feature.title}
                      </h3>
                      {feature.badge && (
                        <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(feature.path);
                      }}
                    >
                      Explore →
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <FaSearch className="text-3xl text-blue-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">1. Search</h3>
              <p className="text-gray-600 text-sm">
                Search for medicines or check symptoms
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <FaPills className="text-3xl text-green-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">2. Select</h3>
              <p className="text-gray-600 text-sm">
                Choose from nearby pharmacies
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 rounded-full">
                  <FaShoppingCart className="text-3xl text-purple-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">3. Order</h3>
              <p className="text-gray-600 text-sm">
                Place order with delivery or pickup
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-orange-100 rounded-full">
                  <FaTruck className="text-3xl text-orange-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">4. Receive</h3>
              <p className="text-gray-600 text-sm">
                Get delivery or pickup from pharmacy
              </p>
            </div>
          </div>
        </Card>

        {/* Safety Notice */}
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-2xl">⚠️</div>
            <div>
              <h3 className="font-bold text-yellow-800 mb-2">Health Disclaimer</h3>
              <p className="text-yellow-700 text-sm">
                Our AI-powered tools are designed to provide information and suggestions only. 
                They do not replace professional medical advice, diagnosis, or treatment. 
                Always consult a qualified healthcare provider for medical concerns.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerHome;
