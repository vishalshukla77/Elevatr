import { useState } from "react";
import { Pencil, X } from "lucide-react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [about, setAbout] = useState(userData.about || "");

	const handleSave = () => {
		setIsEditing(false);
		onSave({ about });
	};

	return (
		<div className='relative'>
			<div className='flex items-center justify-between mb-6'>
				<h2 className='text-xl font-semibold text-gray-900'>About</h2>
				{isOwnProfile && !isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className='p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-all duration-300 group'
					>
						<Pencil size={18} className='group-hover:scale-110 transition-transform duration-300' />
					</button>
				)}
			</div>

			{isEditing ? (
				<div className='space-y-4'>
					<textarea
						value={about}
						onChange={(e) => setAbout(e.target.value)}
						className='w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 min-h-[120px] text-gray-700 placeholder-gray-400'
						rows='4'
						placeholder='Write something about yourself...'
					/>
					<div className='flex justify-end gap-2'>
						<button
							onClick={() => setIsEditing(false)}
							className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2'
						>
							<X size={16} />
							Cancel
						</button>
						<button
							onClick={handleSave}
							className='px-4 py-2 text-white bg-teal-500 rounded-full hover:bg-teal-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
							disabled={!about.trim()}
						>
							Save
						</button>
					</div>
				</div>
			) : (
				<div className='prose prose-sm max-w-none text-gray-600'>
					{userData.about ? (
						<p className='whitespace-pre-wrap'>{userData.about}</p>
					) : isOwnProfile ? (
						<p className='text-gray-400 italic'>
							Add a summary about yourself to help others understand your background and expertise.
						</p>
					) : (
						<p className='text-gray-400 italic'>No information available.</p>
					)}
				</div>
			)}
		</div>
	);
};

export default AboutSection;
