import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
	return (
		<div className='bg-white rounded-xl shadow-sm'>
			<div className='relative'>
				<div
					className='h-24 rounded-t-xl bg-cover bg-center'
					style={{
						backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
					}}
				/>
				<div className='p-6 text-center'>
					<Link to={`/profile/${user.username}`} className='block'>
						<img
							src={user.profilePicture || "/avatar.png"}
							alt={user.name}
							className='w-24 h-24 rounded-full mx-auto mt-[-48px] border-4 border-white shadow-md transition-transform hover:scale-105'
						/>
						<h2 className='text-xl font-bold mt-4 text-gray-900 hover:text-primary transition-colors'>{user.name}</h2>
					</Link>
					<p className='text-gray-600 mt-2'>{user.headline}</p>
					<div className='mt-4 py-2 px-4 bg-gray-50 rounded-full inline-block'>
						<p className='text-sm text-gray-600'>
							<span className='font-semibold text-primary'>{user.connections.length}</span> connections
						</p>
					</div>
				</div>
			</div>

			<div className='border-t border-gray-100 p-4'>
				<nav>
					<ul className='space-y-1'>
						<li>
							<Link
								to='/'
								className='flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary transition-all group'
							>
								<Home className='mr-3 group-hover:scale-110 transition-transform' size={20} />
								<span className='font-medium'>Home</span>
							</Link>
						</li>
						<li>
							<Link
								to='/network'
								className='flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary transition-all group'
							>
								<UserPlus className='mr-3 group-hover:scale-110 transition-transform' size={20} />
								<span className='font-medium'>My Network</span>
							</Link>
						</li>
						<li>
							<Link
								to='/notifications'
								className='flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary transition-all group'
							>
								<Bell className='mr-3 group-hover:scale-110 transition-transform' size={20} />
								<span className='font-medium'>Notifications</span>
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			<div className='border-t border-gray-100 p-6'>
				<Link 
					to={`/profile/${user.username}`} 
					className='inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors'
				>
					View Full Profile
					<svg className='w-4 h-4 ml-1' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7'/>
					</svg>
				</Link>
			</div>
		</div>
	);
}
