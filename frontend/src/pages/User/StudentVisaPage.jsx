

const StudentVisaPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 pt-10'>
      {/* Header and Navbar would be separate components */}

      {/* Main Section */}
      <section className='py-12 bg-gray-100'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4'>
            Student Visa Guidance
          </h2>
          <p className='text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto'>
            Planning to study abroad? Aim Navigator provides full guidance and
            support to help you get your student visa smoothly.
          </p>

          <div className='flex flex-col md:flex-row items-center gap-8 mb-12'>
            <div className='md:w-1/2'>
              <img
                src='/jobsearch.webp'
                alt='Student Visa'
                className='w-full rounded-lg shadow-md'
              />
            </div>
            <div className='md:w-1/2'>
              <h4 className='text-2xl font-semibold text-gray-800 mb-4'>
                Our Services Include:
              </h4>
              <ul className='space-y-3 mb-6'>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  <span className='text-gray-700'>
                    University selection support
                  </span>
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  <span className='text-gray-700'>
                    Application & documentation assistance
                  </span>
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  <span className='text-gray-700'>
                    Visa interview preparation
                  </span>
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  <span className='text-gray-700'>Pre-departure briefing</span>
                </li>
              </ul>
              <p className='text-gray-600 mb-6 leading-relaxed'>
                We help students apply to countries like{' '}
                <strong>Canada, UK, Australia, Hungary</strong> and more. From
                choosing the right course to submitting your final visa
                application, we are with you at every step.
              </p>
              <button
                onClick={() => (window.location.href = '/contact')}
                className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
              >
                Get Free Consultation
              </button>
            </div>
          </div>

          <div className='text-center mb-8'>
            <h4 className='text-2xl font-semibold text-gray-800 mb-8'>
              Why Choose Aim Navigator?
            </h4>
            <div className='grid md:grid-cols-3 gap-6'>
              <div className='bg-white rounded-lg shadow-md p-6 border-0'>
                <div className='flex justify-center mb-4'>
                  <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xl font-bold'>🎓</span>
                  </div>
                </div>
                <h5 className='text-xl font-semibold text-gray-800 mb-3'>
                  Expert Advisors
                </h5>
                <p className='text-gray-600'>
                  Our team has years of experience guiding students for overseas
                  education.
                </p>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6 border-0'>
                <div className='flex justify-center mb-4'>
                  <div className='w-12 h-12 bg-green-600 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xl font-bold'>🌍</span>
                  </div>
                </div>
                <h5 className='text-xl font-semibold text-gray-800 mb-3'>
                  Global Network
                </h5>
                <p className='text-gray-600'>
                  We are connected with universities and colleges across top
                  destinations.
                </p>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6 border-0'>
                <div className='flex justify-center mb-4'>
                  <div className='w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xl font-bold'>👍</span>
                  </div>
                </div>
                <h5 className='text-xl font-semibold text-gray-800 mb-3'>
                  Proven Success
                </h5>
                <p className='text-gray-600'>
                  Hundreds of students have successfully reached their dream
                  universities with our help.
                </p>
              </div>
            </div>
          </div>

          <div className='text-center mt-12'>
            <h5 className='text-xl font-semibold text-gray-800 mb-3'>
              Need Help with Your Visa?
            </h5>
            <p className='text-gray-600 mb-6'>
              Let us handle the paperwork while you focus on your dreams.
            </p>
            <button
              onClick={() => (window.location.href = '/contact')}
              className='bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
            >
              Talk to an Advisor
            </button>
          </div>
        </div>
      </section>

      {/* Footer would be a separate component */}
    </div>
  );
};

export default StudentVisaPage;
