import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const AsianJobsPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const countries = [
    {
      name: 'Turkey',
      code: 'tr',
      description: 'Construction, textile, and tourism industries',
    },
    {
      name: 'Armenia',
      code: 'am',
      description: 'IT and manufacturing opportunities',
    },
    {
      name: 'Kazakhstan',
      code: 'kz',
      description: 'Oil, gas, and construction sectors',
    },
    {
      name: 'Malaysia',
      code: 'my',
      description: 'Manufacturing, hospitality, and services',
    },
    {
      name: 'China',
      code: 'cn',
      description: 'Manufacturing and technology sectors',
    },
    {
      name: 'Japan',
      code: 'jp',
      description: 'Technology, manufacturing, and hospitality',
    },
    {
      name: 'Saudi Arabia',
      code: 'sa',
      description: 'Construction, healthcare, and oil industries',
    },
    {
      name: 'United Arab Emirates',
      code: 'ae',
      description: 'Construction, hospitality, and finance',
    },
  ];

  const benefits = [
    {
      icon: '📋',
      title: 'Legal Job Contracts',
      description:
        '100% legal employment with proper documentation and worker protection',
    },
    {
      icon: '💰',
      title: 'Reasonable Processing Cost',
      description:
        'Transparent pricing with no hidden fees or unexpected charges',
    },
    {
      icon: '⚡',
      title: 'Quick Visa Approval',
      description:
        'Fast-track processing for eligible candidates with complete documentation',
    },
    {
      icon: '👨‍💼',
      title: 'Expert Consultation',
      description:
        'Dedicated consultants guide you through every step of the process',
    },
  ];

  const sectors = [
    { name: 'Construction', icon: '🏗️', demand: 'High' },
    { name: 'Healthcare & Caregiving', icon: '🏥', demand: 'Very High' },
    { name: 'Hospitality', icon: '🏨', demand: 'High' },
    { name: 'Manufacturing', icon: '🏭', demand: 'Medium' },
    { name: 'Technology', icon: '💻', demand: 'High' },
    { name: 'Oil & Gas', icon: '⛽', demand: 'Medium' },
  ];

  const handleApplyNow = () => {
    navigate('/jobs');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50'>
      {/* Hero Section */}
      <section className='container mx-auto px-4 pt-20 pb-12'>
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className='inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-6 py-2 mb-6'>
            <span className='text-2xl mr-2'>🌏</span>
            <span className='text-orange-800 font-semibold'>
              Asian Opportunities
            </span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6'>
            Asian Job Opportunities
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Explore legal overseas job opportunities across Asian countries with
            growing economies and diverse career prospects.
          </p>
        </div>

        {/* Main Content Section */}
        <div className='flex flex-col lg:flex-row items-center gap-12 mb-16'>
          <div className='lg:w-1/2'>
            <div className='relative group'>
              <img
                src='/jobsearch.webp'
                alt='Asian Job Opportunities - International Career Prospects'
                className='w-full rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl'></div>
            </div>
          </div>
          <div className='lg:w-1/2'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
              Where Can You Work?
            </h2>
            <p className='text-gray-600 mb-8 text-lg leading-relaxed'>
              Asian countries offer diverse employment opportunities across
              multiple sectors including construction, caregiving, factory work,
              hospitality, technology, and oil & gas industries. These
              destinations provide legal pathways for skilled, semi-skilled, and
              entry-level workers.
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
            Popular Job Sectors
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
              <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4'>
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
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-800'>
                Who Can Apply?
              </h3>
            </div>
            <p className='text-gray-600 leading-relaxed mb-6'>
              We welcome candidates aged 20–45 with basic education, physical
              fitness, and a strong work ethic. While prior experience is
              preferred, it's not mandatory for most positions.
            </p>
            <div className='space-y-3'>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Age: 20-45 years
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Basic education required
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Physical fitness for manual jobs
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Resume building assistance provided
              </div>
            </div>
          </div>

          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20'>
            <div className='flex items-center mb-6'>
              <div className='w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4'>
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
                Why Trust AIM Navigator?
              </h3>
            </div>
            <p className='text-gray-600 leading-relaxed mb-6'>
              AIM Navigator ensures that you get safe, legal, and verified job
              placements. We have helped hundreds of candidates secure jobs in
              Asian countries with 100% visa success rate and personalized
              support at every step.
            </p>
            <div className='space-y-3'>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                100% legal job placements
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Verified employer partnerships
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                End-to-end process support
              </div>
              <div className='flex items-center text-gray-700'>
                <span className='text-green-500 mr-3 text-lg'>✓</span>
                Post-arrival assistance
              </div>
            </div>
          </div>
        </div>

        {/* Countries Section */}
        <div className='mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4'>
            Available Destinations
          </h2>
          <p className='text-center text-gray-600 mb-12 max-w-2xl mx-auto'>
            Explore job opportunities in these Asian countries with established
            employment programs
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {countries.map((country, index) => (
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
                    <h3 className='text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors'>
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
        <div className='bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              Ready to Start Your Asian Career Journey?
            </h2>
            <p className='text-xl text-orange-100 mb-8 leading-relaxed'>
              Don't let borders limit your potential. Join hundreds of
              successful candidates who have transformed their careers through
              our Asian job placement programs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={handleApplyNow}
                className='bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg'
              >
                Apply Now - Start Your Journey
              </button>
              <button
                onClick={() => navigate('/contact')}
                className='border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105'
              >
                Get Free Consultation
              </button>
            </div>
            <p className='text-orange-100 text-sm mt-6'>
              💼 Free consultation • 📋 Document assistance • ✈️ Visa support
            </p>
          </div>
        </div>

        {/* Success Statistics */}
        <div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-8'>
          <div className='text-center'>
            <div className='text-4xl font-bold text-orange-600 mb-2'>300+</div>
            <div className='text-gray-600 font-medium'>Asian Placements</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-red-600 mb-2'>100%</div>
            <div className='text-gray-600 font-medium'>Visa Success Rate</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-pink-600 mb-2'>8</div>
            <div className='text-gray-600 font-medium'>Asian Countries</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-purple-600 mb-2'>24/7</div>
            <div className='text-gray-600 font-medium'>Support Available</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AsianJobsPage;
