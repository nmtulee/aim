import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllTestimonialsQuery } from '../../redux/api/testimonialApiSlice';
import { useGetMyResumeQuery } from '../../redux/api/resumeApiSlice.js';


const AIMNavigatorHomepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [stats, setStats] = useState({
    clients: 0,
    success: 0,
    countries: 0,
    years: 0,
  });
  const navigate = useNavigate()
  const {data:myResume}= useGetMyResumeQuery()

  const { data, isLoading, isError } = useGetAllTestimonialsQuery({ limit: 5 });
  const testimonials = data?.data?.testimonials || [];

  // Animated statistics
  useEffect(() => {
    const targets = { clients: 5000, success: 98, countries: 25, years: 10 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    const timer = setInterval(() => {
      setStats((prev) => {
        const newStats = { ...prev };
        Object.keys(targets).forEach((key) => {
          if (newStats[key] < targets[key]) {
            newStats[key] = Math.min(
              newStats[key] + Math.ceil(targets[key] / steps),
              targets[key]
            );
          }
        });
        return newStats;
      });
    }, increment);

    return () => clearInterval(timer);
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id^="animate-"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);



  const products = [
    {
      id: 1,
      title: 'Work Permit Solutions',
      subtitle: 'Schengen & Non-Schengen',
      description:
        'Helping you secure legal and long-term job permits in Europe.',
      icon: '🌍',
      features: [
        'Legal Documentation',
        'Fast Processing',
        'Expert Guidance',
        '24/7 Support',
      ],
    },
    {
      id: 2,
      title: 'Career Development',
      subtitle: 'Guided Training',
      description:
        'Get trained with language & skill courses designed for EU careers.',
      icon: '📚',
      features: [
        'Language Courses',
        'Skill Training',
        'Certification',
        'Job Placement',
      ],
    },
    {
      id: 3,
      title: 'Visa Consultation',
      subtitle: 'Study & Migration',
      description:
        'Personalized advice to help you study or migrate successfully.',
      icon: '✈️',
      features: [
        'Study Visa',
        'Migration Support',
        'Document Prep',
        'Interview Training',
      ],
    },
  ];

  const processSteps = [
    {
      step: 'Step 1',
      title: 'Submit Your Application',
      description:
        'Complete our comprehensive application form with your details and requirements.',
      icon: '📝',
    },
    {
      step: 'Step 2',
      title: 'Consult with Our Experts',
      description:
        'Schedule Link consultation with our experienced immigration and career specialists.',
      icon: '💬',
    },
    {
      step: 'Step 3',
      title: 'Prepare Documentation',
      description:
        "We'll guide you through gathering and preparing all necessary documents.",
      icon: '📋',
    },
    {
      step: 'Step 4',
      title: 'Get Placed or Approved',
      description:
        'Receive your work permit, visa approval, or job placement confirmation.',
      icon: '🎉',
    },
  ];

  const nextSlide = () => {
    if (testimonials.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevSlide = () => {
    if (testimonials.length > 0) {
      setCurrentSlide(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );
    }
  };
  const getUserInitials = (userName) => {
    if (!userName) return 'UN';
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

   
  const handleResume = () => {
    
    if (myResume?.data) {
      navigate('/myResume');
    }
    else {
      navigate('/createResume');
    }
  }
  

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20 px-4 overflow-hidden'>
        <div className='absolute inset-0 bg-black/20'></div>

        {/* Animated background elements */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full animate-pulse'></div>
        <div className='absolute bottom-20 right-10 w-48 h-48 bg-purple-500/20 rounded-full animate-bounce'></div>
        <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/30 rounded-full animate-ping'></div>

        <div className='relative max-w-6xl mx-auto text-center'>
          <div className='animate-fade-in-up'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6 leading-tight'>
              Your Trusted Partner in{' '}
              <span className='bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse text-4xl md:text-6xl '>
                Workforce Solutions
              </span>{' '}
              &{' '}
              <span className='bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent animate-pulse text-4xl md:text-6xl '>
                Career Success
              </span>
            </h1>
            <p className='text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto text-blue-100 mb-8'>
              Every month, thousands of professionals and companies rely on{' '}
              <span className='text-yellow-400 font-semibold text-xl md:text-2xl '>
                AIM Navigator
              </span>{' '}
              for expert guidance in recruitment, labor compliance, and career
              development.
            </p>

            {/* Stats Counter */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-4xl mx-auto'>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-bold text-yellow-400'>
                  {stats.clients.toLocaleString()}+
                </div>
                <div className='text-sm text-blue-200'>Happy Clients</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-bold text-green-400'>
                  {stats.success}%
                </div>
                <div className='text-sm text-blue-200'>Success Rate</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-bold text-purple-400'>
                  {stats.countries}+
                </div>
                <div className='text-sm text-blue-200'>Countries</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-bold text-orange-400'>
                  {stats.years}+
                </div>
                <div className='text-sm text-blue-200'>Years Experience</div>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to='/contact'
                className='bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
              >
                Get Started Today
              </Link>
              <Link
                to={'/LanguageCourses'}
                className='border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105'
              >
                Language Courses
              </Link>
              <button
                onClick={handleResume}
                className='bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
              >
                You'r Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id='animate-products' className='py-16 px-4 bg-white'>
        <div className='max-w-6xl mx-auto'>
          <div
            className={`transition-all duration-1000 transform ${
              isVisible['animate-products']
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className='text-4xl font-bold text-center mb-4 text-gray-800'>
              Our Services
            </h2>
            <p className='text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto'>
              Comprehensive solutions tailored to your career and business needs
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden ${
                    isVisible['animate-products'] ? 'animate-fade-in-up' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className='p-8 text-center'>
                    <div className='text-5xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                      {product.icon}
                    </div>
                    <h4 className='text-2xl font-bold text-gray-800 mb-2'>
                      {product.title}
                    </h4>
                    <h6 className='text-lg text-blue-600 font-semibold mb-4'>
                      {product.subtitle}
                    </h6>
                    <p className='text-gray-600 leading-relaxed mb-6'>
                      {product.description}
                    </p>

                    {/* Features list */}
                    <div className='space-y-2 mb-6'>
                      {product.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className='flex items-center justify-center text-sm text-gray-600'
                        >
                          <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105'>
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        id='animate-process'
        className='py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50'
      >
        <div className='max-w-6xl mx-auto'>
          <div
            className={`transition-all duration-1000 transform ${
              isVisible['animate-process']
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <h3 className='text-4xl font-bold text-center mb-4 text-gray-800'>
              How It Works
            </h3>
            <p className='text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto'>
              Our streamlined process ensures your success every step of the way
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {processSteps.map((step, index) => (
                <div key={index} className='relative group'>
                  <div
                    className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 ${
                      isVisible['animate-process'] ? 'animate-fade-in-up' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300'>
                      {step.icon}
                    </div>
                    <h4 className='text-xl font-bold text-gray-800 mb-2 text-center'>
                      {step.step}
                    </h4>
                    <h5 className='text-lg font-semibold text-blue-600 mb-3 text-center'>
                      {step.title}
                    </h5>
                    <p className='text-gray-600 text-center text-sm leading-relaxed'>
                      {step.description}
                    </p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className='hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300'></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id='animate-testimonials'
        className='py-20 px-6 bg-gradient-to-b from-gray-100 to-white'
      >
        <div className='max-w-5xl mx-auto text-center'>
          <h2 className='text-4xl font-bold text-gray-800 mb-8'>
            What Our Clients Say
          </h2>

          {isLoading && <p>Loading testimonials...</p>}
          {isError && (
            <p className='text-red-500'>Failed to load testimonials.</p>
          )}

          {!isLoading && testimonials.length > 0 && (
            <div className='relative bg-white p-10 rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl'>
              {/* Testimonial Message */}
              <p className='text-xl text-gray-700 italic mb-6 relative'>
                <span className='absolute -left-4 -top-2 text-5xl text-blue-300'>
                  “
                </span>
                {testimonials[currentSlide].message ||
                  'No testimonial provided.'}
                <span className='absolute -right-4 -bottom-2 text-5xl text-blue-300'>
                  ”
                </span>
              </p>

              {/* Profile & Info */}
              <div className='flex items-center justify-center gap-4'>
                {testimonials[currentSlide].photo ? (
                  <img
                    src={testimonials[currentSlide].photo}
                    alt={testimonials[currentSlide].title || 'Anonymous'}
                    className='w-20 h-20 rounded-full border-4 border-blue-500 object-cover shadow-md'
                  />
                ) : (
                  <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl'>
                    {getUserInitials(testimonials[currentSlide].user?.name)}
                  </div>
                )}

                <div className='text-left'>
                  <h4 className='font-bold text-lg text-gray-900'>
                    {testimonials[currentSlide].title || 'Anonymous'}
                  </h4>
                  <p className='text-sm text-gray-500 flex items-center gap-2'>
                    {testimonials[currentSlide].jobTitle || 'Unknown Position'}
                    <span className='flex items-center'>
                      🌍{' '}
                      {testimonials[currentSlide].country || 'Unknown Country'}
                    </span>
                  </p>
                  {/* Rating */}
                  <div className='flex mt-1'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < (testimonials[currentSlide].rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className='flex justify-between mt-8'>
                <button
                  onClick={prevSlide}
                  className='px-4 py-2 bg-gray-200 rounded-full hover:bg-blue-500 hover:text-white transition'
                >
                  ◀
                </button>
                <button
                  onClick={nextSlide}
                  className='px-4 py-2 bg-gray-200 rounded-full hover:bg-blue-500 hover:text-white transition'
                >
                  ▶
                </button>
              </div>

              {/* Indicators */}
              <div className='flex justify-center mt-4 space-x-2'>
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === currentSlide
                        ? 'bg-blue-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {!isLoading && testimonials.length === 0 && (
            <p className='text-gray-500'>
              No testimonials available at the moment.
            </p>
          )}
        </div>
        <div className='flex justify-center mt-16'>
          <Link
            to='/testimonials'
            className='inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300'
          >
            Go to Testimonials
          </Link>
        </div>
      </section>

      {/* Why Choose Section */}
      <section
        id='animate-why'
        className='py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50'
      >
        <div className='max-w-4xl mx-auto'>
          <div
            className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 transition-all duration-1000 transform ${
              isVisible['animate-why']
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <h3 className='text-4xl font-bold text-center mb-6 text-gray-800'>
              Why Choose AIM Navigator?
            </h3>
            <p className='text-xl text-center text-gray-700 leading-relaxed mb-8'>
              We are more than just Link recruitment agency. AIM Navigator is
              your career partner committed to ethical recruitment, expert visa
              guidance, and practical training.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
              <div className='text-center group'>
                <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <span className='text-white text-2xl'>✓</span>
                </div>
                <h4 className='font-semibold text-gray-800 mb-2'>
                  Ethical Recruitment
                </h4>
                <p className='text-gray-600 text-sm'>
                  Transparent processes with no hidden fees
                </p>
              </div>
              <div className='text-center group'>
                <div className='w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <span className='text-white text-2xl'>🎯</span>
                </div>
                <h4 className='font-semibold text-gray-800 mb-2'>
                  Expert Guidance
                </h4>
                <p className='text-gray-600 text-sm'>
                  Professional consultants with years of experience
                </p>
              </div>
              <div className='text-center group'>
                <div className='w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <span className='text-white text-2xl'>🚀</span>
                </div>
                <h4 className='font-semibold text-gray-800 mb-2'>
                  Proven Results
                </h4>
                <p className='text-gray-600 text-sm'>
                  Thousands of successful placements and approvals
                </p>
              </div>
            </div>

            <div className='text-center mt-8'>
              <Link
                to='/jobs'
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
              >
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className='py-16 px-4 bg-gradient-to-r from-blue-900 to-purple-900 text-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 animate-pulse'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 animate-bounce'></div>

        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <h3 className='text-4xl font-bold mb-6 animate-fade-in-up'>
            Ready to Transform Your Career?
          </h3>
          <p
            className='text-xl mb-8 text-blue-100 animate-fade-in-up'
            style={{ animationDelay: '0.2s' }}
          >
            Join thousands of professionals who have successfully navigated
            their career journey with AIM Navigator
          </p>
          <div
            className='flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up'
            style={{ animationDelay: '0.4s' }}
          >
            {/* <Link
              to='/contact'
              className='bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              Schedule Consultation
            </Link> */}
            <Link
              to='/contact'
              className='border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105'
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AIMNavigatorHomepage;
