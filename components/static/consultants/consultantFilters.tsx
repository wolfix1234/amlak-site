"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiTime } from "react-icons/bi";

interface ConsultantFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  loading?: boolean;
}

export interface FilterState {
  search: string;
  workArea: string;
  minExperience: string;
  sortBy: string;
}

const ConsultantFilters: React.FC<ConsultantFiltersProps> = ({
  onFilterChange,
  loading = false,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    workArea: "",
    minExperience: "",
    sortBy: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const workAreas = [
    "افسریه",
    "مسعودیه",
    "کیانشهر",
    "مشیریه",
    "بیسیم",
    "مینابی",
    "شهید بروجردی",
    "خاورشهر",
    "اتابک",
    "ابوذر پل چهارم تا ششم",
    "هاشمآباد",
    "طیب",
    "زمزم",
    "آهنگ",
    "چهارصد دستگاه",
    "آهنگ شرقی",
    "نبیاکرم",
    "دولاب",
    "پرستار",
    "تاکسیرانی",
    "پیروزی",
    "ابوذر پل اول تا سوم",
    "شهید محلاتی",
    "پاسدار گمنام",
    "سرآسیاب",
    "تهران نو",
    "نیروی هوایی",
    "اشراقی",
    "سی متری نیروی هوایی",
    "حافظیه",
    "امامت",
    "دماوند",
    "قاسم آباد",
    "نارمک",
    "نارمک جنوبی",
    "مجیدیه جنوبی",
    "مدائن",
    "فدک",
    "دردشت",
    "هفتحوض",
    "گلبرگ",
    "لشگر",
    "ثانی",
    "تسلیحات",
    "تهرانپارس شرقی",
    "تهرانپارس غربی",
    "حکیمیه",
    "قنات کوثر",
    "شمیراننو",
    "مجیدیه شمالی",
    "لویزان",
    "هروی",
    "شیان",
    "مبارکآباد",
    "خاکسفید",
    "اوقاف",
    "فرجام",
    "نارمک شمالی",
    "علم و صنعت",
    "قلهک",
    "دروس",
    "زرگنده",
    "ونک",
    "آرارات",
    "اختیاریه",
    "دیباجی",
    "جردن",
    "داوودیه",
    "کاووسیه",
    "سیدخندان",
    "میرداماد",
    "پاسداران",
    "جلفا",
    "نظام آباد",
    "سبلان",
    "بهشتی",
    "اجاره دار",
    "ارامنه",
    "گرگان",
    "خواجه نصیر",
    "خواجه نظام",
    "سهروردی",
    "شارق شرقی",
    "مرودشت",
    "هفت تیر",
    "مفتح جنوبی",
    "دروازه دولت",
    "بازار",
    "شوش",
    "پامنار",
    "بهارستان",
    "سنگ لج",
    "دروازه شمیران",
    "خیابان ایران",
    "آبشار",
    "کوثر",
    "قیام",
    "امین حضور",
    "امام حسین",
    "صفا",
  ];

  const experienceOptions = [
    { value: "", label: "همه" },
    { value: "1", label: "حداقل ۱ سال" },
    { value: "3", label: "حداقل ۳ سال" },
    { value: "5", label: "حداقل ۵ سال" },
    { value: "10", label: "حداقل ۱۰ سال" },
  ];

  const sortOptions = [
    { value: "experience", label: "بیشترین تجربه" },
    { value: "rating", label: "بالاترین امتیاز" },
    { value: "posters", label: "بیشترین آگهی" },
    { value: "name", label: "نام (الفبایی)" },
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      workArea: "",
      minExperience: "",
      sortBy: "experience",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search || filters.workArea || filters.minExperience;

  return (
    <div className="bg-white rounded-lg max-w-2xl mx-auto p-6 mb-6" dir="rtl">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="جستجو در نام مشاور، منطقه یا تخصص..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="block w-full pr-10 placeholder:text-gray-300 text-black pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-[#01ae9b] hover:text-[#019688] font-medium"
        >
          <FaFilter />
          <span>فیلترها</span>
          {hasActiveFilters && (
            <span className="bg-[#01ae9b] text-white text-xs px-2 py-1 rounded-full">
              فعال
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
          >
            <FaTimes />
            <span>پاک کردن فیلترها</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <motion.div
        initial={false}
        animate={{
          height: showFilters ? "auto" : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Work Area Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <HiOutlineLocationMarker className="inline ml-1" />
              منطقه فعالیت
            </label>
            <select
              value={filters.workArea}
              onChange={(e) => handleFilterChange("workArea", e.target.value)}
              className="w-full p-2 border border-gray-300 text-black rounded-lg "
            >
              <option value="">همه مناطق</option>
              {workAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BiTime className="inline ml-1" />
              سابقه کار
            </label>
            <select
              value={filters.minExperience}
              onChange={(e) =>
                handleFilterChange("minExperience", e.target.value)
              }
              className="w-full p-2 border border-gray-300 text-black rounded-lg "
            >
              {experienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مرتب‌سازی بر اساس
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full p-2 border border-gray-300 text-black rounded-lg "
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#01ae9b]"></div>
          <span className="mr-2 text-gray-600">در حال جستجو...</span>
        </div>
      )}
    </div>
  );
};

export default ConsultantFilters;
