import React from 'react';
import {
  Dumbbell,
  Calendar,
  User,
  Home,
  LayoutGrid,
  TrendingUp,
  Users,
  Clock,
  Trophy,
  ArrowRight,
  Apple,
  Beef,
  Cherry,
  Soup
} from 'lucide-react';
import WaterTracker from './components/WaterTracker';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Container simulating a mobile device */}
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-gray-900 border-opacity-10">

        {/* Header Section */}
        <div className="bg-[#121212] text-white p-8 pb-32 rounded-b-[2.5rem]">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1 mb-6">
                <span className="text-2xl font-bold italic tracking-tighter text-orange-500">V-10</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Welcome to</p>
              <h1 className="text-3xl font-bold mb-1">V-10 Gym</h1>
              <p className="text-gray-400 mb-6">Jordan Eagle</p>
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Active & Total Members count removed as per request */}
        </div>

        {/* Progress Card (Overlapping) */}
        <div className="px-6 -mt-24">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col gap-4 relative overflow-hidden">
            {/* Background pattern/circles subtle decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-10 -mt-10 opacity-50"></div>

            <div className="flex justify-between items-center relative">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">Progress</span>
              </div>
              <div className="p-2 bg-gray-100 rounded-xl">
                <LayoutGrid size={18} className="text-gray-500" />
              </div>
            </div>

            <div className="flex justify-between items-center relative">
              <div className="flex flex-col gap-2">
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full w-fit">
                  Cardio
                </span>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Lower Body</h2>

                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={16} />
                    <span className="text-sm font-medium">3 hours</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Trophy size={16} />
                    <span className="text-sm font-medium">Beginner</span>
                  </div>
                </div>
              </div>

              {/* Circular Progress */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#F3F4F6"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#4ADE80"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 0.72)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-bold text-gray-800">72%</span>
                </div>
                {/* Decorative background for the chart similar to image */}
                <div className="absolute -z-10 bg-green-500/10 w-20 h-20 rounded-2xl"></div>
              </div>
            </div>

            <button className="bg-[#121212] text-white py-4 px-6 rounded-full flex items-center justify-between mt-2 hover:bg-gray-800 transition-colors">
              <span className="font-semibold text-sm">Continue the workout</span>
              <div className="bg-white text-black p-1 rounded-full">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>

          <WaterTracker />
        </div>

        {/* Diet Plan Section */}
        <div className="px-6 py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Diet Plan</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Breakfast */}
            <div className="bg-[#E8F5E9] p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 border border-green-100/50">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Apple className="text-green-600" size={28} />
              </div>
              <span className="text-green-800 font-semibold">Breakfast</span>
            </div>

            {/* Lunch */}
            <div className="bg-[#FFF3E0] p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 border border-orange-100/50">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Beef className="text-orange-600" size={28} />
              </div>
              <span className="text-orange-800 font-semibold">Lunch</span>
            </div>

            {/* Snack */}
            <div className="bg-[#E0F2F1] p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 border border-teal-100/50">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Cherry className="text-teal-600" size={28} />
              </div>
              <span className="text-teal-800 font-semibold">Lunch</span>
            </div>

            {/* Dinner */}
            <div className="bg-[#FFF9C4] p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 border border-yellow-100/50">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Soup className="text-yellow-600" size={28} />
              </div>
              <span className="text-yellow-800 font-semibold">Dinner</span>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
          <div className="bg-[#121212] text-white/50 py-4 px-8 rounded-full flex justify-between items-center shadow-2xl">
            <button className="text-white">
              <Home size={24} />
              <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
            </button>
            <button className="hover:text-white transition-colors">
              <Calendar size={24} />
            </button>
            <button className="hover:text-white transition-colors">
              <Dumbbell size={24} />
            </button>
            <button className="hover:text-white transition-colors">
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Fill bottom space due to fixed nav padding */}
        <div className="h-24"></div>
      </div>
    </div>
  );
};

export default UserDashboard;
