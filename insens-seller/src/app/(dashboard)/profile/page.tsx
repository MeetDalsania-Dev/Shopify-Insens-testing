import type { Metadata } from "next";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { PageHeader } from "@/shared/components/PageHeader";

export const metadata: Metadata = { title: "Profile Settings — Insens Seller" };

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile Settings"
        description="Manage your personal account information."
      />
      <div className="max-w-2xl">
        <ProfileForm />
      </div>
    </div>
  );
}
