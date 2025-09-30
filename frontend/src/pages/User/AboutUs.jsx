import React from 'react';


import {
  FaUsers,
  FaBullseye,
  FaEye,
  FaAward,
  FaGlobe,
  FaShieldAlt,
} from 'react-icons/fa';
import { useGetAllTeamMembersQuery } from '../../redux/api/teamApiSlice.js';

const AboutUs = () => {

  const { data: teams } = useGetAllTeamMembersQuery()
  
  
  const teamMembers = teams?.teamMembers || [
    {
      name: 'Md. Noor Mohammad',
      role: 'Founder & CEO',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      description:
        'Leading AIM Navigator with 15+ years in international recruitment',
    },
    {
      name: 'Sarah Jahan',
      role: 'Operations Manager',
      image:
        'https://images.unsplash.com/photo-1494790108755-2616b332905c?w=300&h=300&fit=crop&crop=face',
      description: 'Expert in streamlining global employment processes',
    },
    {
      name: 'Dr. Mizanur Rahman',
      role: 'Legal Advisor',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description:
        'Specialized in international employment law and regulations',
    },
  ];

  const values = [
    {
      icon: <FaShieldAlt className='w-8 h-8 text-blue-600' />,
      title: 'Ethical Practices',
      description:
        'We maintain the highest standards of integrity in all our services',
    },
    {
      icon: <FaGlobe className='w-8 h-8 text-green-600' />,
      title: 'Global Reach',
      description:
        'Connecting professionals with opportunities across Europe and beyond',
    },
    {
      icon: <FaAward className='w-8 h-8 text-purple-600' />,
      title: 'Expert Guidance',
      description: 'Professional support from industry experts at every step',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'>
              About AIM Navigator
            </h1>
            <p className='text-xl text-blue-100 leading-relaxed'>
              Your trusted partner in building successful international careers
              through ethical practices and expert guidance
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='flex items-center mb-8'>
              <FaUsers className='w-10 h-10 text-blue-600 mr-4' />
              <h2 className='text-4xl font-bold text-gray-800'>Who We Are</h2>
            </div>
            <p className='text-lg text-gray-600 leading-relaxed mb-12'>
              AIM Navigator is your trusted partner in overseas employment, work
              permits, and career development. Since our inception, we have
              helped thousands of professionals and students build successful
              paths in Europe and beyond. Our services are rooted in ethical
              practices, transparency, and real-time support.
            </p>

            <div className='grid md:grid-cols-2 gap-12'>
              <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg'>
                <div className='flex items-center mb-6'>
                  <FaBullseye className='w-8 h-8 text-blue-600 mr-3' />
                  <h3 className='text-2xl font-semibold text-gray-800'>
                    Our Mission
                  </h3>
                </div>
                <p className='text-gray-700 leading-relaxed'>
                  To simplify the journey to global employment by offering
                  expert guidance, skill development, and legal support every
                  step of the way.
                </p>
              </div>

              <div className='bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg'>
                <div className='flex items-center mb-6'>
                  <FaEye className='w-8 h-8 text-purple-600 mr-3' />
                  <h3 className='text-2xl font-semibold text-gray-800'>
                    Our Vision
                  </h3>
                </div>
                <p className='text-gray-700 leading-relaxed'>
                  To become a leading global navigator for ethical migration and
                  sustainable international careers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-4xl font-bold text-center text-gray-800 mb-12'>
              Our Core Values
            </h2>
            <div className='grid md:grid-cols-3 gap-8'>
              {values.map((value, index) => (
                <div
                  key={index}
                  className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'
                >
                  <div className='flex flex-col items-center text-center'>
                    <div className='bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-full mb-6'>
                      {value.icon}
                    </div>
                    <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                      {value.title}
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-4xl font-bold text-center text-gray-800 mb-12'>
              Meet Our Team
            </h2>
            <div className='grid md:grid-cols-3 gap-8'>
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className='bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'
                >
                  <div className='text-center'>
                    <div className='relative mb-6'>
                      <img
                        src={member.image}
                        alt={member.name}
                        className='w-32 h-32 rounded-full mx-auto object-cover shadow-lg ring-4 ring-blue-100'
                      />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                      {member.name}
                    </h3>
                    <p className='text-blue-600 font-medium mb-4'>
                      {member.role}
                    </p>
                    <p className='text-gray-600 text-sm leading-relaxed'>
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-6'>
              Ready to Start Your Global Career Journey?
            </h2>
            <p className='text-xl text-blue-100 mb-8'>
              Join thousands of professionals who have successfully built their
              international careers with AIM Navigator
            </p>
            <button className='bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105 shadow-lg'>
              Get Started Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
