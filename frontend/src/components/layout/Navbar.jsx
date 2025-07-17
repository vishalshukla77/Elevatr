import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users, Brain } from "lucide-react";

const Navbar = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: async () => axiosInstance.get("/connections/requests"),
		enabled: !!authUser,
	});

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length;

	return (
		<nav className='bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center h-16'>
					<div className='flex items-center space-x-4'>
						<Link to='/' className='flex items-center space-x-2 group'>
							<img
								className='w-8 h-8 rounded transition-transform duration-300 group-hover:scale-110'
								src='/small-logo.png'
								alt='Elevatr'
							/>
							<span className='text-lg font-semibold text-gray-900 hidden sm:block'>Elevatr</span>
						</Link>
					</div>
					<div className='flex items-center gap-1 md:gap-4'>
						{authUser ? (
							<>
								<Link
									to={"/"}
									className='text-gray-600 hover:text-teal-600 flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-300'
								>
									<Home size={20} />
									<span className='text-xs font-medium hidden md:block mt-1'>Home</span>
								</Link>
								<Link
									to='/network'
									className='text-gray-600 hover:text-teal-600 flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 relative'
								>
									<Users size={20} />
									<span className='text-xs font-medium hidden md:block mt-1'>Network</span>
									{unreadConnectionRequestsCount > 0 && (
										<span className='absolute -top-1 -right-1 md:-right-1 bg-teal-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white'>
											{unreadConnectionRequestsCount}
										</span>
									)}
								</Link>
								<Link
									to='/notifications'
									className='text-gray-600 hover:text-teal-600 flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 relative'
								>
									<Bell size={20} />
									<span className='text-xs font-medium hidden md:block mt-1'>Alerts</span>
									{unreadNotificationCount > 0 && (
										<span className='absolute -top-1 -right-1 md:-right-1 bg-teal-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white'>
											{unreadNotificationCount}
										</span>
									)}
								</Link>
								<Link
									to='/career-assessment'
									className='text-gray-600 hover:text-teal-600 flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 relative group'
								>
									<div className='relative'>
										<Brain size={20} className='transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300' />
										<span className='absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] px-1 rounded-full animate-pulse'>AI</span>
									</div>
									<span className='text-xs font-medium hidden md:block mt-1'>Career AI</span>
								</Link>
								<Link
									to={`/profile/${authUser.username}`}
									className='text-gray-600 hover:text-teal-600 flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-300'
								>
									<User size={20} />
									<span className='text-xs font-medium hidden md:block mt-1'>Profile</span>
								</Link>
								<button
									className='text-gray-600 hover:text-red-600 flex flex-col items-center p-2 rounded-lg hover:bg-red-50 transition-all duration-300'
									onClick={() => logout()}
								>
									<LogOut size={20} />
									<span className='text-xs font-medium hidden md:block mt-1'>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link
									to='/login'
									className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors duration-300'
								>
									Sign In
								</Link>
								<Link
									to='/signup'
									className='px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-full transition-colors duration-300'
								>
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
export default Navbar;
