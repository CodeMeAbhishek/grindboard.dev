export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <h1 className="text-4xl md:text-5xl font-display-xl text-[#1A1A1A] tracking-tight">Privacy Policy</h1>
      <p className="text-[#6B7280]">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-lg text-[#1A1A1A]">
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
        <p className="text-[#6B7280] mb-4">
          When you create an account on Grindboard, we collect your email address, username, and authentication information provided by our authentication provider (Supabase). We also collect the activity data you explicitly log, such as your study hours, LeetCode progress, and contest participation.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Data</h2>
        <p className="text-[#6B7280] mb-4">
          Your data is used solely to provide the core functionality of the platform: computing your XP, updating your streak, ranking you on the community leaderboard, and providing analytics on your personal dashboard.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Sharing</h2>
        <p className="text-[#6B7280] mb-4">
          We do not sell or share your personal data with third parties. Your public profile, including your XP, streak, and badges, is visible to other users on the platform leaderboard unless you choose to make your account private.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Deletion</h2>
        <p className="text-[#6B7280] mb-4">
          You may request the complete deletion of your account and associated data at any time by contacting us at hello@grindboard.dev or using the delete option in your account settings.
        </p>
      </div>
    </div>
  );
}
