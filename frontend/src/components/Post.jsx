import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostAction from "./PostAction";

const Post = ({ post }) => {
	const { postId } = useParams();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState(post.comments || []);
	const isOwner = authUser._id === post.author._id;
	const isLiked = post.likes.includes(authUser._id);

	const queryClient = useQueryClient();

	const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.delete(`/posts/delete/${post._id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Post deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: createComment, isPending: isAddingComment } = useMutation({
		mutationFn: async (newComment) => {
			await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Comment added successfully");
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to add comment");
		},
	});

	const { mutate: likePost, isPending: isLikingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.post(`/posts/${post._id}/like`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
		},
	});

	const handleDeletePost = () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		deletePost();
	};

	const handleLikePost = async () => {
		if (isLikingPost) return;
		likePost();
	};

	const handleAddComment = async (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			createComment(newComment);
			setNewComment("");
			setComments([
				...comments,
				{
					content: newComment,
					user: {
						_id: authUser._id,
						name: authUser.name,
						profilePicture: authUser.profilePicture,
					},
					createdAt: new Date(),
				},
			]);
		}
	};

	return (
		<div className='bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 mb-6 overflow-hidden border border-gray-100'>
			<div className='p-5'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center group'>
						<Link to={`/profile/${post?.author?.username}`} className='relative'>
							<img
								src={post.author.profilePicture || "/avatar.png"}
								alt={post.author.name}
								className='size-12 rounded-full mr-3 ring-2 ring-gray-100 group-hover:ring-teal-100 transition-all duration-300'
							/>
						</Link>

						<div>
							<Link to={`/profile/${post?.author?.username}`}>
								<h3 className='font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300'>
									{post.author.name}
								</h3>
							</Link>
							<p className='text-sm text-gray-600'>{post.author.headline}</p>
							<p className='text-xs text-gray-500'>
								{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
							</p>
						</div>
					</div>
					{isOwner && (
						<button
							onClick={handleDeletePost}
							className='text-gray-400 hover:text-red-500 transition-colors duration-300 p-2 rounded-full hover:bg-red-50'
						>
							{isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
						</button>
					)}
				</div>
				<p className='mb-4 text-gray-800 whitespace-pre-wrap'>{post.content}</p>
				{post.image && (
					<div className='relative rounded-xl overflow-hidden mb-4 bg-gray-100'>
						<img
							src={post.image}
							alt='Post content'
							className='w-full object-cover hover:scale-105 transition-transform duration-300'
						/>
					</div>
				)}

				<div className='flex justify-between text-gray-500 border-t border-gray-100 pt-4'>
					<PostAction
						icon={
							<ThumbsUp
								size={18}
								className={isLiked ? 'text-teal-500 fill-teal-200' : 'group-hover:text-teal-500 transition-colors duration-300'}
							/>
						}
						text={`${post.likes.length} ${post.likes.length === 1 ? 'Like' : 'Likes'}`}
						onClick={handleLikePost}
						className='group'
					/>

					<PostAction
						icon={<MessageCircle size={18} className='group-hover:text-teal-500 transition-colors duration-300' />}
						text={`${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`}
						onClick={() => setShowComments(!showComments)}
						className='group'
					/>
					<PostAction
						icon={<Share2 size={18} className='group-hover:text-teal-500 transition-colors duration-300' />}
						text='Share'
						className='group'
					/>
				</div>
			</div>

			{showComments && (
				<div className='bg-gray-50 px-5 py-4'>
					<div className='mb-4 max-h-80 overflow-y-auto custom-scrollbar'>
						{comments.map((comment) => (
							<div
								key={comment._id}
								className='mb-3 bg-white p-3 rounded-lg shadow-sm flex items-start group hover:shadow-md transition-shadow duration-300'
							>
								<img
									src={comment.user.profilePicture || "/avatar.png"}
									alt={comment.user.name}
									className='w-8 h-8 rounded-full mr-3 ring-1 ring-gray-100 group-hover:ring-teal-100 transition-all duration-300'
								/>
								<div className='flex-grow'>
									<div className='flex items-center mb-1'>
										<span className='font-medium text-gray-900 mr-2'>{comment.user.name}</span>
										<span className='text-xs text-gray-500'>
											{formatDistanceToNow(new Date(comment.createdAt))}
										</span>
									</div>
									<p className='text-gray-800'>{comment.content}</p>
								</div>
							</div>
						))}
					</div>

					<form onSubmit={handleAddComment} className='flex items-center gap-2'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Write a comment...'
							className='flex-grow p-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 placeholder:text-gray-400'
						/>

						<button
							type='submit'
							className='bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-12'
							disabled={isAddingComment || !newComment.trim()}
						>
							{isAddingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
						</button>
					</form>
				</div>
			)}
		</div>
	);
};
export default Post;
