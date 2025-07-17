export default function PostAction({ icon, text, onClick, className = '' }) {
	return (
		<button
			className={`flex items-center gap-2 py-2 px-4 rounded-full hover:bg-gray-100 transition-all duration-300 ${className}`}
			onClick={onClick}
		>
			<span className='transition-transform duration-300 group-hover:scale-110'>{icon}</span>
			<span className='hidden sm:inline text-sm group-hover:text-gray-900 transition-colors duration-300'>
				{text}
			</span>
		</button>
	);
}
