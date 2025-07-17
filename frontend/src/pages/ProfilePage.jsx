import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import toast from "react-hot-toast";

const ProfilePage = () => {
	const { username } = useParams();
	const queryClient = useQueryClient();

	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
	});

	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", username],
		queryFn: () => axiosInstance.get(`/users/${username}`),
	});

	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
		},
	});

	if (isLoading || isUserProfileLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<Loader size={40} className="animate-spin text-teal-500 mx-auto mb-4" />
					<p className="text-gray-600 font-medium">Loading profile...</p>
				</div>
			</div>
		);
	}

	const isOwnProfile = authUser.username === userProfile.data.username;
	const userData = isOwnProfile ? authUser : userProfile.data;

	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4 space-y-6">
				<div className="bg-white rounded-xl shadow-sm overflow-hidden">
					<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
				</div>

				<div className="bg-white rounded-xl shadow-sm p-6">
					<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
				</div>

				<div className="bg-white rounded-xl shadow-sm p-6">
					<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
				</div>

				<div className="bg-white rounded-xl shadow-sm p-6">
					<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
				</div>

				<div className="bg-white rounded-xl shadow-sm p-6">
					<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
