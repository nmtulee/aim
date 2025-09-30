import React from 'react';

const Footer = () => {
  return (
    <>
      {/* Facebook Messenger Chat Plugin */}
      <div id='fb-root'></div>
      <div id='fb-customer-chat' className='fb-customerchat'></div>

      {/* Footer */}
      <footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden'>
        {/* Background pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className='relative z-10'>
          <div className='container mx-auto px-6 py-16'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12'>
              {/* Company Info */}
              <div className='md:col-span-5 space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
                    Aim Navigator
                  </h3>
                  <p className='text-gray-300 leading-relaxed text-lg'>
                    Aim Navigator is a trusted organization that helps people
                    find their path to success. With a focus on client
                    satisfaction and career excellence, we stand as your true
                    partner in shaping global careers.
                  </p>
                </div>

                {/* Social Media */}
                <div className='space-y-3'>
                  <h4 className='text-lg font-semibold text-white'>
                    Follow Us
                  </h4>
                  <div className='flex space-x-4'>
                    {[
                      { icon: '📘', label: 'Facebook', href: '#' },
                      { icon: '💼', label: 'LinkedIn', href: '#' },
                      { icon: '💬', label: 'WhatsApp', href: '#' },
                      { icon: '📺', label: 'YouTube', href: '#' },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className='w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl hover:from-blue-500 hover:to-purple-500 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl'
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className='md:col-span-3 space-y-6'>
                <h4 className='text-xl font-bold text-white relative'>
                  Quick Links
                  <div className='absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-2'></div>
                </h4>
                <nav className='space-y-3'>
                  {[
                    { name: 'About Us', path: '/about' },
                    { name: 'Blog', path: '/blogs' },
                    { name: 'Contact', path: '/contact' },
                    { name: 'Job Market', path: '/jobs' },
                    { name: 'Success Stories', path: '/testimonials' },
                  ].map((link) => (
                    <a
                      key={link.name}
                      href={link.path}
                      className='block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group'
                    >
                      <span className='flex items-center'>
                        <span className='w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                        {link.name}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Contact Info */}
              <div className='md:col-span-4 space-y-6'>
                <h4 className='text-xl font-bold text-white relative'>
                  Get In Touch
                  <div className='absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-2'></div>
                </h4>

                <div className='space-y-4'>
                  <div className='flex items-start space-x-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0'>
                      📍
                    </div>
                    <div>
                      <h5 className='font-semibold text-white'>Address</h5>
                      <p className='text-gray-300'>
                        123 Main Street
                        <br />
                        Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0'>
                      📧
                    </div>
                    <div>
                      <h5 className='font-semibold text-white'>Email</h5>
                      <p className='text-gray-300'>info@aimnavigator.com</p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0'>
                      📱
                    </div>
                    <div>
                      <h5 className='font-semibold text-white'>Phone</h5>
                      <p className='text-gray-300'>+880 123 456 789</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className='border-t border-white/10 bg-black/20 backdrop-blur-sm'>
          <div className='container mx-auto px-6 py-6'>
            <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
              <div className='text-gray-400 text-center md:text-left'>
                © {new Date().getFullYear()} Aim Navigator. All rights reserved.
              </div>
              {/* <div className='flex space-x-6 text-sm'>
                <a
                  href='/privacy'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  Privacy Policy
                </a>
                <a
                  href='/terms'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  Terms of Service
                </a>
                <a
                  href='/cookies'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  Cookie Policy
                </a>
              </div> */}
              <div className='flex space-x-2 text-sm text-gray-400'>
                <span>Made by</span>
                <a
                  href='https://github.com/arahamed'
                  className='text-purple-500 font-semibold hover:underline'
                >
                  MD Ataour Rahman
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Facebook Messenger Script */}
    </>
  );
};

export default Footer;
