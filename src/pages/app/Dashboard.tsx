import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentCoursesSection } from "@/components/dashboard/RecentCoursesSection";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
        Dashboard
      </h1>
      <DashboardStats />
      <RecentCoursesSection />
    </div>
  );
};

export default Dashboard;