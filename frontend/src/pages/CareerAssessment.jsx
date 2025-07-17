import { useState } from 'react';
import { Brain } from 'lucide-react';

const CareerAssessment = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const questions = [
        {
            id: 1,
            question: 'What type of work environment do you thrive in?',
            options: ['Remote/WFH', 'Office-based', 'Hybrid', 'Field work', 'Flexible']
        },
        {
            id: 2,
            question: 'Which aspects of work motivate you the most?',
            options: ['Creative freedom', 'Financial rewards', 'Learning opportunities', 'Work-life balance', 'Career growth']
        },
        {
            id: 3,
            question: 'What are your strongest soft skills?',
            options: ['Communication', 'Leadership', 'Problem-solving', 'Teamwork', 'Time management']
        },
        {
            id: 4,
            question: 'Which industry interests you the most?',
            options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Creative arts']
        },
        {
            id: 5,
            question: 'What is your preferred work style?',
            options: ['Independent work', 'Team collaboration', 'Project-based', 'Client-facing', 'Research-oriented']
        }
    ];

    const handleAnswer = (answer) => {
        setAnswers({ ...answers, [step]: answer });
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            analyzeAnswers();
        }
    };

    // Local recommendation engine
    const generateRecommendations = (answers) => {
        // Define career path mappings based on answers
        const careerMappings = {
            // Work environment preferences
            'Remote/WFH': ['Digital Nomad', 'Freelancer', 'Remote Developer'],
            'Office-based': ['Corporate Manager', 'Office Administrator', 'Team Leader'],
            'Hybrid': ['Project Manager', 'Consultant', 'Hybrid Coordinator'],
            'Field work': ['Field Technician', 'Sales Representative', 'Construction Manager'],
            'Flexible': ['Entrepreneur', 'Consultant', 'Freelance Designer'],
            
            // Work motivations
            'Creative freedom': ['Designer', 'Artist', 'Content Creator'],
            'Financial rewards': ['Investment Banker', 'Sales Executive', 'Financial Advisor'],
            'Learning opportunities': ['Researcher', 'Academic', 'Training Specialist'],
            'Work-life balance': ['Human Resources', 'School Teacher', 'Wellness Coach'],
            'Career growth': ['Management Trainee', 'Tech Lead', 'Executive'],
            
            // Soft skills
            'Communication': ['Public Relations', 'Marketing', 'Customer Success'],
            'Leadership': ['Team Lead', 'Department Head', 'Executive'],
            'Problem-solving': ['Engineer', 'Data Scientist', 'Product Manager'],
            'Teamwork': ['HR Specialist', 'Project Coordinator', 'Team Manager'],
            'Time management': ['Operations Manager', 'Executive Assistant', 'Event Planner'],
            
            // Industries
            'Technology': ['Software Developer', 'Data Analyst', 'UX Designer'],
            'Healthcare': ['Doctor', 'Nurse', 'Medical Researcher'],
            'Finance': ['Accountant', 'Financial Analyst', 'Risk Manager'],
            'Education': ['Teacher', 'Academic Advisor', 'Curriculum Developer'],
            'Creative arts': ['Graphic Designer', 'Writer', 'Art Director'],
            
            // Work styles
            'Independent work': ['Writer', 'Researcher', 'Freelancer'],
            'Team collaboration': ['Team Lead', 'Scrum Master', 'HR Business Partner'],
            'Project-based': ['Project Manager', 'Consultant', 'Contractor'],
            'Client-facing': ['Account Manager', 'Sales Representative', 'Customer Success'],
            'Research-oriented': ['Scientist', 'Data Analyst', 'Market Researcher']
        };

        // Define skill recommendations
        const skillMappings = {
            'Remote/WFH': ['Time Management', 'Self-discipline', 'Digital Communication'],
            'Office-based': ['Team Collaboration', 'Corporate Etiquette', 'Presentations'],
            'Creative freedom': ['Design Thinking', 'Creativity', 'Visual Communication'],
            'Financial rewards': ['Negotiation', 'Financial Analysis', 'Sales Techniques'],
            'Problem-solving': ['Critical Thinking', 'Data Analysis', 'Decision Making'],
            'Technology': ['Programming', 'Cloud Computing', 'Agile Methodology'],
            'Healthcare': ['Medical Knowledge', 'Patient Care', 'Health Regulations'],
            'Communication': ['Public Speaking', 'Active Listening', 'Writing']
        };

        // Define industry advice
        const adviceMappings = {
            'Technology': 'Consider learning emerging technologies like AI and blockchain to stay competitive.',
            'Healthcare': 'Specializing in a medical niche can increase your career opportunities.',
            'Finance': 'Certifications like CFA or CPA can significantly boost your career.',
            'Education': 'Continuous learning and pedagogical training are essential in this field.',
            'Creative arts': 'Building a strong portfolio is crucial for success in creative fields.'
        };

        // Generate recommendations based on answers
        const recommendedRoles = [];
        const skills = new Set();
        const industries = new Set();

        // Add roles based on each answer
        Object.values(answers).forEach(answer => {
            if (careerMappings[answer]) {
                recommendedRoles.push(...careerMappings[answer]);
            }
            if (skillMappings[answer]) {
                skillMappings[answer].forEach(skill => skills.add(skill));
            }
            if (adviceMappings[answer]) {
                industries.add(answer);
            }
        });

        // Remove duplicates and limit to top recommendations
        const uniqueRoles = [...new Set(recommendedRoles)].slice(0, 5);
        const uniqueSkills = [...skills].slice(0, 5);
        const uniqueIndustries = [...industries].slice(0, 3);

        // Generate advice based on primary industry or default
        const primaryIndustry = answers[3] || 'General';
        const advice = adviceMappings[primaryIndustry] || 
            'Consider developing both technical and soft skills to advance your career.';

        return {
            recommendedRoles: uniqueRoles.length > 0 ? uniqueRoles : ['Project Manager', 'UX Designer', 'Data Analyst'],
            skills: uniqueSkills.length > 0 ? uniqueSkills : ['Agile Methodology', 'User Research', 'Data Visualization'],
            industries: uniqueIndustries.length > 0 ? uniqueIndustries : ['Technology', 'Finance', 'Healthcare'],
            advice
        };
    };

    const analyzeAnswers = () => {
        setLoading(true);
        setTimeout(() => {
            const recommendations = generateRecommendations(answers);
            setResult(recommendations);
            setLoading(false);
        }, 1500); // Simulate processing delay
    };

    const resetAssessment = () => {
        setStep(0);
        setAnswers({});
        setResult(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-6 group">
                    <Brain className="h-8 w-8 text-teal-500 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Career Assessment</h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                        <p className="text-gray-600">Analyzing your responses...</p>
                    </div>
                ) : !result ? (
                    <div className="space-y-6">
                        <div className="flex justify-between mb-4">
                            <span className="text-sm text-gray-500">Question {step + 1} of {questions.length}</span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full">
                                <div 
                                    className="h-2 bg-teal-500 rounded-full transition-all duration-300"
                                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            {questions[step].question}
                        </h2>

                        <div className="grid gap-3">
                            {questions[step].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option)}
                                    className="p-4 text-left border rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all duration-300"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-teal-700 mb-4">Recommended Career Paths</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {result.recommendedRoles.map((role, index) => (
                                    <li key={index} className="text-gray-700">{role}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-blue-700 mb-4">Recommended Skills</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {result.skills.map((skill, index) => (
                                    <li key={index} className="text-gray-700">{skill}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-purple-700 mb-4">Suitable Industries</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {result.industries.map((industry, index) => (
                                    <li key={index} className="text-gray-700">{industry}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Professional Advice</h3>
                            <p className="text-gray-600">{result.advice}</p>
                        </div>

                        <button
                            onClick={resetAssessment}
                            className="w-full py-3 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300"
                        >
                            Start New Assessment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerAssessment;