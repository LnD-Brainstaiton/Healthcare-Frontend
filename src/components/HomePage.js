import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Star, Users, Calendar, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import dashboardBackground from "../assets/dashboardBackground.jpg";
import doctor1 from "../assets/doctor-1.jpg";
import doctor2 from "../assets/doctor-2.jpg";
import doctor3 from "../assets/doctor-3.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative px-6 py-20 text-center bg-gradient-to-r from-teal-500 to-teal-600 text-white"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Your Health, Our Priority</h1>
          <p className="text-xl mb-8 text-teal-50">
            Connect with top healthcare professionals and book appointments with
            ease
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/doctor-list")}
            className="px-8 py-4 bg-white text-teal-600 rounded-full font-semibold shadow-lg hover:bg-teal-50 transition-all flex items-center gap-2 mx-auto"
          >
            Book Appointment <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Building2, stat: "500+", label: "Partner Clinics" },
            { icon: Users, stat: "2000+", label: "Happy Patients" },
            { icon: Star, stat: "50+", label: "Specialists" },
            { icon: Calendar, stat: "100+", label: "Daily Appointments" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <item.icon className="w-12 h-12 text-teal-500 mb-4" />
              <h3 className="text-3xl font-bold text-gray-800">{item.stat}</h3>
              <p className="text-gray-600">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Doctors */}
      <div className="max-w-7xl mx-auto px-6 py-16 bg-white rounded-3xl shadow-sm mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Meet Our Top Specialists
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              name: "Dr. Michael Wilson",
              specialty: "Cardiologist",
              image:
                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
            },
            {
              name: "Dr. James Chen",
              specialty: "Neurologist",
              image:
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
            },
            {
              name: "Dr. David Parker",
              specialty: "Pediatrician",
              image:
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
            },
          ].map((doctor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {doctor.name}
                </h3>
                <p className="text-teal-600">{doctor.specialty}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          What Our Patients Say
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              text: "The doctors here are amazing! I had a great experience and felt very well cared for.",
              author: "John Doe",
              role: "Patient",
            },
            {
              text: "Scheduling an appointment was super easy. The staff is very professional and friendly!",
              author: "Jane Smith",
              role: "Patient",
            },
            {
              text: "Outstanding service and care. The doctors really take time to listen and understand.",
              author: "Michael Brown",
              role: "Patient",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.text}</p>
              <div>
                <h4 className="font-semibold text-gray-800">
                  {testimonial.author}
                </h4>
                <p className="text-teal-600 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
