import React, { useState } from 'react';
import { useCreateMessageMutation } from '../../redux/api/messageApiSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Contact = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    email: userInfo?.email || '',
    subject: '',
    message: '',
  });

  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMessage(form).unwrap();
      toast.success('Message sent successfully!');
      setForm({
        name: '',
        email: userInfo?.email || '',
        subject: '',
        message: '',
      });
    } catch (err) {
      toast.error('Failed to send message. Try again.');
      console.error(err);
    }
  };

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white relative overflow-hidden '>
      <div className='absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 animate-pulse'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 animate-bounce'></div>

      <div className='max-w-6xl mx-auto z-10 relative my-10'>
        <h2 className='text-center text-4xl font-bold mb-8 animate-fade-in-up'>
          Get in Touch
        </h2>

        <div
          className={`grid ${
            userInfo?.isVarify ? 'md:grid-cols-2' : 'md:grid-cols-1'
          } gap-10`}
        >
          {/* Contact Form */}
          {userInfo?.isVarify && (
            <div>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label htmlFor='name' className='block font-medium mb-1'>
                    Your Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    value={form.name}
                    onChange={handleChange}
                    placeholder='Enter your name'
                    required
                    className='w-full px-4 py-2 text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label htmlFor='subject' className='block font-medium mb-1'>
                    Subject
                  </label>
                  <input
                    type='text'
                    name='subject'
                    id='subject'
                    value={form.subject}
                    onChange={handleChange}
                    placeholder='Subject'
                    required
                    className='w-full px-4 py-2 text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label htmlFor='message' className='block font-medium mb-1'>
                    Message
                  </label>
                  <textarea
                    name='message'
                    id='message'
                    rows='5'
                    value={form.message}
                    onChange={handleChange}
                    placeholder='Write your message'
                    required
                    className='w-full px-4 py-2 text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  ></textarea>
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition duration-300 disabled:opacity-50'
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <div className='bg-white/10 p-6 rounded-lg shadow-md'>
              <h5 className='text-xl font-semibold mb-4'>
                Contact Information
              </h5>
              <p className='mb-2'>
                <strong>Address:</strong> 123 Main Street, Dhaka, Bangladesh
              </p>
              <p className='mb-2'>
                <strong>Phone:</strong> +880 1234 567 890
              </p>
              <p className='mb-4'>
                <strong>Email:</strong> info@aimnavigator.com
              </p>
              <hr className='mb-4 border-blue-200' />
              <p>
                Feel free to reach out to us anytime. We usually respond within
                24 hours!
              </p>
            </div>
          </div>
        </div>
      </div>

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
    </section>
  );
};

export default Contact;
