import { motion } from "framer-motion";
import {
  FiUsers,
  FiFileText,
  FiBriefcase,
  FiLayers,
  FiMail,
  FiLoader,
  FiHeart,
  FiCalendar,
} from "react-icons/fi";
import { useDashboardStats } from "@/hooks/useDashboardStats";

interface DashboardProps {
  onNavigate?: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { data, isLoading, error, refetch } = useDashboardStats();

  // Loading state
  if (isLoading) {
    return (
      <div className="h-64 bg-transparent flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600"> ... در حال بارگذاری </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">خطا در بارگذاری دادهها: {error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!data) return <div className="p-8">اطلاعاتی یافت نشد</div>;

  const { userInfo } = data;
  const isAdmin = userInfo.role === "admin" || userInfo.role === "superadmin";

  // Admin dashboard stats
  const adminStats = [
    {
      id: "properties",
      name: "آگهی های املاک",
      value: data.propertyListings?.toString() || "0",
      icon: <FiLayers className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      id: "real-estate-requests",
      name: "درخواستهای املاک",
      value: data.realEstateRequests?.toString() || "0",
      icon: <FiFileText className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      id: "legal-requests",
      name: "درخواستهای حقوقی",
      value: data.legalRequests?.toString() || "0",
      icon: <FiFileText className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      id: "employment-requests",
      name: "درخواستهای همکاری",
      value: data.employmentRequests?.toString() || "0",
      icon: <FiBriefcase className="h-6 w-6" />,
      color: "bg-yellow-500",
    },
    {
      id: "users",
      name: "همه کاربران سایت",
      value: data.users?.toString() || "0",
      icon: <FiUsers className="h-6 w-6" />,
      color: "bg-red-500",
    },
    {
      id: "newsletter",
      name: "مشترکین خبرنامه",
      value: data.newsletterSubscribers?.toString() || "0",
      icon: <FiMail className="h-6 w-6" />,
      color: "bg-indigo-500",
    },
  ];

  // User/Consultant dashboard stats
  const userStats = [
    {
      id: "Myproperties",
      name: "آگهی های من",
      value: data.myPosters?.toString() || "0",
      icon: <FiLayers className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      id: "favorite",
      name: "علاقه مندی های من",
      value: data.myFavorites?.toString() || "0",
      icon: <FiHeart className="h-6 w-6" />,
      color: "bg-red-500",
    },
  ];

  const statsToShow = isAdmin ? adminStats : userStats;

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-500 text-sm">
          خوش آمدید <strong className="text-blue-400">{userInfo.name}</strong>{" "}
          عزیز
        </p>
        {userInfo.createdAt && (
          <p className="text-xs text-yellow-500 flex items-center mt-1">
            <FiCalendar className="ml-1 h-2.5 w-2.5" />
            عضویت از: {new Date(userInfo.createdAt).toLocaleDateString("fa-IR")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsToShow.map((stat) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => onNavigate && onNavigate(stat.id)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-2 md:p-3 ${stat.color}`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="mr-5">
                  <p className="text-xs md:text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {parseInt(stat.value).toLocaleString("fa-IR")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional info section */}
      <div className="mt-8  border-b border-gray-600/70 p-4">
        <p className="text-sm text-gray-500">
          آخرین به روزرسانی: {new Date().toLocaleDateString("fa-IR")}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
