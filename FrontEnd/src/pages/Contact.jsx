import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from "react-icons/fa";

function Contact() {
  return (
    <>

      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

          <div className="grid md:grid-cols-2">

            <div className="p-10">

              <h1 className="text-4xl font-bold mb-4">
                Contact Us
              </h1>

              <p className="text-gray-600 mb-8">
                We'd love to hear from you. Fill out the form below and
                we'll get back to you as soon as possible.
              </p>

              <form className="space-y-6">

                <div>
                  <label className="block font-medium mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Message
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Write your message..."
                    className="w-full border rounded-lg p-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition">
                  <FaPaperPlane size={18} />
                  Send Message
                </button>

              </form>

            </div>

            <div className="bg-gray-50 p-10">

              <h2 className="text-3xl font-bold mb-8">
                Get In Touch
              </h2>

              <div className="space-y-8">

                <div className="flex gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaMapMarkerAlt className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Address
                    </h3>

                    <p className="text-gray-600">
                      Mogadishu, Somalia
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaPhone className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Phone
                    </h3>

                    <p className="text-gray-600">
                      +252 61 2345678
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaEnvelope className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Email
                    </h3>

                    <p className="text-gray-600">
                      support@shophub.com
                    </p>
                  </div>
                </div>

              </div>

              <div className="mt-10 rounded-xl overflow-hidden shadow">

                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps?q=Mogadishu,Somalia&output=embed"
                  className="w-full h-72"
                  loading="lazy"
                ></iframe>

              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;
