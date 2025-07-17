import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

const PostCreation = ({ user }) => {
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	const queryClient = useQueryClient();

	const { mutate: createPostMutation, isPending } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.post("/posts/create", postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to create post");
		},
	});

	const handlePostCreation = async () => {
		try {
			const postData = { content };
			if (image) postData.image = await readFileAsDataURL(image);

			createPostMutation(postData);
		} catch (error) {
			console.error("Error in handlePostCreation:", error);
		}
	};

	const resetForm = () => {
		setContent("");
		setImage(null);
		setImagePreview(null);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			readFileAsDataURL(file).then(setImagePreview);
		} else {
			setImagePreview(null);
		}
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	return (
		<div className='bg-white rounded-xl p-6'>
			<div className='flex items-start space-x-4'>
				<img 
					src={user.profilePicture || "/avatar.png"} 
					alt={user.name} 
					className='w-12 h-12 rounded-full border-2 border-gray-100'
				/>
				<div className='flex-1'>
					<textarea
						placeholder="What's on your mind?"
						className='w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all duration-200 min-h-[120px] text-gray-700 placeholder-gray-500'
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>

					{imagePreview && (
						<div className='mt-4 relative group'>
							<img 
								src={imagePreview} 
								alt='Selected' 
								className='w-full h-auto rounded-xl shadow-sm' 
							/>
							<button 
								onClick={() => setImagePreview(null)} 
								className='absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70'
							>
								<svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'/>
								</svg>
							</button>
						</div>
					)}

					<div className='flex justify-between items-center mt-4 pt-4 border-t border-gray-100'>
						<label className='flex items-center px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group'>
							<Image size={20} className='mr-2 text-gray-600 group-hover:text-primary transition-colors' />
							<span className='text-gray-600 group-hover:text-gray-900 font-medium transition-colors'>Add Photo</span>
							<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
						</label>

						<button
							className='px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2'
							onClick={handlePostCreation}
							disabled={isPending || !content.trim()}
						>
							{isPending ? (
								<>
									<Loader className='w-4 h-4 animate-spin' />
									<span>Posting...</span>
								</>
							) : (
								<>
									<span>Share Post</span>
									<svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 12h14m-4-4l4 4-4 4'/>
									</svg>
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PostCreation;
