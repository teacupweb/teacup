import { useAuth } from "@/AuthProvider";
import { useNavigate } from "react-router";
import websiteData from "@/assets/websiteData.json";
import Swal from "sweetalert2";

function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Logged out!",
          text: "You have been successfully logged out.",
          icon: "success",
        }).then(() => {
          navigate("/login");
        });
      }
    });
  };
  // console.log(websiteData.sharing);
  websiteData.sharing.map((sharing) => {
    console.log(sharing.email);
  });

  return (
    <div className="flex flex-col w-full h-full p-6">
      <div className="mb-8">
        <h2 className="font-bold ubuntu-font text-3xl text-slate-800 mb-2">
          Settings
        </h2>
        <p className="text-slate-500">
          Manage your account preferences and system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-xl text-slate-800 mb-4 pb-2 border-b border-slate-50">
              Account Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div>
                  <h4 className="font-medium text-slate-700">
                    Email Notifications
                  </h4>
                  <p className="text-sm text-slate-500">
                    Receive daily summaries
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div>
                  <h4 className="font-medium text-slate-700">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm text-slate-500">
                    Add an extra layer of security
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-xl text-slate-800 mb-4 pb-2 border-b border-slate-50">
              Team Management
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Invite Team Member
                </label>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="flex gap-2"
                >
                  <input
                  required
                    type="email"
                    placeholder="colleague@example.com"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                  <button className="bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition-colors font-medium">
                    Invite
                  </button>
                </form>
              </div>
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-3">
                  Members
                </h4>
                {websiteData.sharing.map((data) => (
                  <div className="space-y-3" key={data.email}>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                          {data.name.split(" ").map((word) => word.charAt(0).toUpperCase()).join("")}
                        </div>
                        <span className="text-sm text-slate-600">
                          {data.email}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${data.status === "Member" ? "bg-rose-100 text-rose-500" : "bg-orange-100 text-orange-500"}`}
                      >
                        {data.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-xl text-slate-800 mb-4 pb-2 border-b border-slate-50">
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div>
                  <h4 className="font-medium text-slate-700">Dark Mode</h4>
                  <p className="text-sm text-slate-500">
                    Switch between light and dark themes
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Danger Zone */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-xl text-slate-800 mb-4">Profile</h3>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-2xl mb-3">
                JD
              </div>
              <h4 className="font-bold text-lg text-slate-800">John Doe</h4>
              <p className="text-slate-500 text-sm mb-4">Administrator</p>
              <button className="w-full py-2 px-4 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h3 className="font-bold text-xl text-red-800 mb-2">Danger Zone</h3>
            <p className="text-red-600/80 text-sm mb-4">
              Once you logout, you will need to enter your credentials to access
              the dashboard again.
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
