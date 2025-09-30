

const GermanyWorkPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 pt-10'>
      {/* Header and Navbar would be separate components */}

      {/* Main Section */}
      <section className='container mx-auto px-4 py-12'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Study and Work in Germany
          </h2>
          <p className='text-gray-600 text-lg'>
            Your dream of studying or working in Germany starts here. Let Aim
            Navigator guide you toward success.
          </p>
        </div>

        {/* Image + Text Row */}
        <div className='flex flex-col md:flex-row items-center gap-8 mb-12'>
          <div className='md:w-1/2'>
            <img
              src='/jobsearch.webp'
              alt='Germany Study and Work'
              className='w-full rounded-lg shadow-lg'
            />
          </div>
          <div className='md:w-1/2'>
            <h4 className='text-2xl font-semibold text-gray-800 mb-4'>
              Why Germany?
            </h4>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              Germany offers world-class education with low tuition fees and top
              job opportunities in engineering, IT, healthcare, and more.
              Whether you are a student looking for higher studies or a skilled
              worker, Germany provides excellent pathways to build your career
              and settle legally.
            </p>
            <ul className='space-y-3'>
              <li className='flex items-center text-gray-700'>
                <span className='mr-3'>🎓</span>
                High-quality universities
              </li>
              <li className='flex items-center text-gray-700'>
                <span className='mr-3'>💼</span>
                Job-oriented programs
              </li>
              <li className='flex items-center text-gray-700'>
                <span className='mr-3'>🇩🇪</span>
                PR and settlement options
              </li>
              <li className='flex items-center text-gray-700'>
                <span className='mr-3'>💶</span>
                Part-time work for students
              </li>
            </ul>
          </div>
        </div>

        {/* Two Columns */}
        <div className='grid md:grid-cols-2 gap-8 mb-12'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h5 className='text-xl font-semibold text-gray-800 mb-4'>
              Who Can Apply?
            </h5>
            <p className='text-gray-600 leading-relaxed'>
              If you have completed IELTS (minimum 6 bands) or completed
              A1/A2/B1/B2 level in German language, you are eligible. Academic
              results and a clear motivation for studying or working in Germany
              are also required.
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h5 className='text-xl font-semibold text-gray-800 mb-4'>
              How We Help You
            </h5>
            <p className='text-gray-600 leading-relaxed'>
              Aim Navigator helps with university selection, job hunting,
              document processing, SOP writing, visa application, and interview
              preparation. Our team provides end-to-end support to ensure your
              success in Germany.
            </p>
          </div>
        </div>

        {/* Highlight Section */}
        <div className='bg-gray-100 rounded-lg shadow-md p-6 mb-12'>
          <h5 className='text-xl font-semibold text-gray-800 mb-4'>
            Why Choose Aim Navigator?
          </h5>
          <ul className='space-y-3'>
            <li className='flex items-start'>
              <span className='text-green-500 mr-3 mt-1'>✅</span>
              <span className='text-gray-700'>
                Experienced consultants for Germany
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-green-500 mr-3 mt-1'>✅</span>
              <span className='text-gray-700'>
                Personalized counseling for study and work track
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-green-500 mr-3 mt-1'>✅</span>
              <span className='text-gray-700'>
                Language preparation (IELTS & German)
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-green-500 mr-3 mt-1'>✅</span>
              <span className='text-gray-700'>
                100% documentation & visa support
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-green-500 mr-3 mt-1'>✅</span>
              <span className='text-gray-700'>
                Support even after you arrive in Germany
              </span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className='text-center'>
          <button
            onClick={() => (window.location.href = '/contact')}
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl'
          >
            Apply Now for Germany
          </button>
        </div>
      </section>

      {/* Footer would be a separate component */}
    </div>
  );
};

export default GermanyWorkPage;
