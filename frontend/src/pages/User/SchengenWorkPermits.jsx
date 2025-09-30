import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SchengenWorkPermitsPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const schengenCountries = [
    {
      name: 'Austria',
      code: 'at',
      description:
        'Strong economy with opportunities in tourism and manufacturing',
    },
    {
      name: 'Belgium',
      code: 'be',
      description: 'EU headquarters with diverse job opportunities',
    },
    {
      name: 'Bulgaria',
      code: 'bg',
      description: 'Growing IT and manufacturing sectors',
    },
    {
      name: 'Croatia',
      code: 'hr',
      description: 'Tourism and maritime industry opportunities',
    },
    {
      name: 'Czech Republic',
      code: 'cz',
      description: 'Automotive and engineering industries',
    },
    {
      name: 'Denmark',
      code: 'dk',
      description: 'High living standards with strong welfare system',
    },
    {
      name: 'Estonia',
      code: 'ee',
      description: 'Digital innovation hub with tech opportunities',
    },
    {
      name: 'Finland',
      code: 'fi',
      description: 'Technology and forestry industry leader',
    },
    {
      name: 'France',
      code: 'fr',
      description: 'Diverse economy with luxury and aerospace sectors',
    },
    {
      name: 'Germany',
      code: 'de',
      description: "Europe's largest economy with excellent job security",
    },
    {
      name: 'Greece',
      code: 'gr',
      description: 'Tourism and shipping industry opportunities',
    },
    {
      name: 'Hungary',
      code: 'hu',
      description: 'Automotive manufacturing and technology sectors',
    },
    {
      name: 'Italy',
      code: 'it',
      description: 'Fashion, automotive, and culinary industries',
    },
    {
      name: 'Latvia',
      code: 'lv',
      description: 'Growing logistics and manufacturing sectors',
    },
    {
      name: 'Lithuania',
      code: 'lt',
      description: 'Strong IT and financial services sector',
    },
    {
      name: 'Luxembourg',
      code: 'lu',
      description: 'Financial center with high salaries',
    },
    {
      name: 'Malta',
      code: 'mt',
      description: 'Gaming, finance, and tourism hub',
    },
    {
      name: 'Netherlands',
      code: 'nl',
      description: 'International business and agriculture leader',
    },
    {
      name: 'Poland',
      code: 'pl',
      description: 'Rapidly growing economy with diverse opportunities',
    },
    {
      name: 'Portugal',
      code: 'pt',
      description: 'Growing tech sector and tourism industry',
    },
    {
      name: 'Romania',
      code: 'ro',
      description: 'IT outsourcing and manufacturing opportunities',
    },
    {
      name: 'Slovakia',
      code: 'sk',
      description: 'Automotive industry and manufacturing hub',
    },
    {
      name: 'Slovenia',
      code: 'si',
      description: 'Green tourism and manufacturing sectors',
    },
    {
      name: 'Spain',
      code: 'es',
      description: 'Tourism, renewable energy, and agriculture',
    },
    {
      name: 'Sweden',
      code: 'se',
      description: 'Innovation leader with strong social benefits',
    },
  ];

  const benefits = [
    {
      icon: '🌍',
      title: 'Multiple Countries Access',
      description:
        'Work permit valid across all 27 Schengen countries with freedom of movement',
    },
    {
      icon: '🛡️',
      title: 'Legal Protection & Security',
      description:
        'Full worker rights protection under European Union labor laws',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family Settlement Options',
      description:
        'Bring your family and access to education and healthcare systems',
    },
    {
      icon: '🏠',
      title: 'Permanent Residency Path',
      description:
        'Clear pathway to long-term residency and eventual citizenship',
    },
  ];

  const sectors = [
    { name: 'Healthcare', icon: '🏥', demand: 'Very High' },
    { name: 'IT & Technology', icon: '💻', demand: 'Very High' },
    { name: 'Engineering', icon: '⚙️', demand: 'High' },
    { name: 'Construction', icon: '🏗️', demand: 'High' },
    { name: 'Hospitality', icon: '🏨', demand: 'Medium' },
    { name: 'Manufacturing', icon: '🏭', demand: 'Medium' },
  ];

  const handleApplyNow = () => {
    navigate('/jobs');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Hero Section */}
      <section className='container mx-auto px-4 pt-20 pb-12'>
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className='inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6'>
            <span className='text-2xl mr-2'>🇪🇺</span>
            <span className='text-blue-800 font-semibold'>European Union</span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6'>
            Schengen Work Permits
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Build your future with legal work opportunities in 27 Schengen
            countries. Access Europe's strongest economies with comprehensive
            worker protection.
          </p>
        </div>

        {/* Main Content Section */}
        <div className='flex flex-col lg:flex-row items-center gap-12 mb-16'>
          <div className='lg:w-1/2'>
            <div className='relative group'>
              <img
                src='/jobsearch.webp'
                alt='Schengen Work Permit - European Career Opportunities'
                className='w-full rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl'></div>
            </div>
          </div>
          <div className='lg:w-1/2'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
              What is a Schengen Work Permit?
            </h2>
            <p className='text-gray-600 mb-8 text-lg leading-relaxed'>
              A Schengen Work Permit is your gateway to legal employment across
              27 European countries. This powerful document provides access to
              better career opportunities, higher salaries, comprehensive social
              benefits, and a pathway to permanent European residency.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className='flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20'
                >
                  <span className='text-2xl'>{benefit.icon}</span>
                  <div>
                    <h4 className='font-semibold text-gray-800 mb-1'>
                      {benefit.title}
                    </h4>
                    <p className='text-sm text-gray-600'>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Job Sectors Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-12'>
            High-Demand Job Sectors
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
            {sectors.map((sector, index) => (
              <div
                key={index}
                className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'
              >
                <div className='text-4xl mb-4'>{sector.icon}</div>
                <h3 className='font-semibold text-gray-800 mb-2'>
                  {sector.name}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    sector.demand === 'Very High'
                      ? 'bg-red-100 text-red-700'
                      : sector.demand === 'High'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {sector.demand} Demand
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className='grid lg:grid-cols-2 gap-8 mb-16'>
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20'>
            <div className='flex items-center mb-6'>
              <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-800'>
                Document Requirements
              </h3>
            </div>
            <p className='text-gray-600 leading-relaxed mb-6'>
              We provide complete guidance for document preparation and
              verification. Our expert team ensures all your paperwork meets
              European standards.
            </p>
            <div className='space-y-3'>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Valid passport with at least 2 years validity
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Educational certificates (translated and notarized)
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Work experience certificates
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Medical fitness and police clearance
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Financial stability proof
              </div>
            </div>
            <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
              <p className='text-blue-800 text-sm font-medium'>
                📋 Don't worry! We provide complete guidance for document
                preparation and verification.
              </p>
            </div>
          </div>

          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20'>
            <div className='flex items-center mb-6'>
              <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-800'>
                Why Choose AIM Navigator?
              </h3>
            </div>
            <p className='text-gray-600 leading-relaxed mb-6'>
              With thousands of successful placements and a 95% visa success
              rate, we ensure safe, legal, and verified job opportunities with
              comprehensive support throughout your journey.
            </p>
            <div className='space-y-3'>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Verified Employer Network
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Complete Process Support
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                High Success Rate
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Post-Arrival Support
              </div>
            </div>
          </div>
        </div>

        {/* Schengen Countries Grid */}
        <div className='mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4'>
            Available Destinations
          </h2>
          <p className='text-center text-gray-600 mb-12 max-w-2xl mx-auto'>
            Your work permit opens doors to employment opportunities across all
            these European nations
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {schengenCountries.map((country, index) => (
              <div
                key={index}
                className='group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20'
              >
                <div className='flex items-center mb-4'>
                  <img
                    src={`https://flagcdn.com/48x36/${country.code}.png`}
                    alt={`${country.name} Flag`}
                    className='w-12 h-9 rounded-md shadow-md mr-4'
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div>
                    <h3 className='text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors'>
                      {country.name}
                    </h3>
                  </div>
                </div>
                <p className='text-gray-600 text-sm leading-relaxed'>
                  {country.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              Ready to Work in Europe?
            </h2>
            <p className='text-xl text-blue-100 mb-8 leading-relaxed'>
              Join thousands who have transformed their careers through Schengen
              work permits. Access Europe's strongest economies, highest
              salaries, and best worker protection.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={handleApplyNow}
                className='bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg'
              >
                Apply Now - Start Your Journey
              </button>
              <button
                onClick={() => navigate('/contact')}
                className='border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105'
              >
                Get Free Assessment
              </button>
            </div>
            <p className='text-blue-100 text-sm mt-6'>
              🎯 Free eligibility check • 📋 Document assistance • ✈️ Visa
              support
            </p>
          </div>
        </div>

        {/* Success Statistics */}
        <div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-8'>
          <div className='text-center'>
            <div className='text-4xl font-bold text-blue-600 mb-2'>1000+</div>
            <div className='text-gray-600 font-medium'>EU Placements</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-green-600 mb-2'>95%</div>
            <div className='text-gray-600 font-medium'>Visa Success Rate</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-purple-600 mb-2'>27</div>
            <div className='text-gray-600 font-medium'>Schengen Countries</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-orange-600 mb-2'>€3.5K</div>
            <div className='text-gray-600 font-medium'>Average Salary</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchengenWorkPermitsPage;
