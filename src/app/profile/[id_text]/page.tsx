import { redirect } from "next/navigation";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";

export type ProfilePageProps = {
  params: Promise<{ id_text: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id_text } = await params;
  
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  try {
    const ssrAccount = await ssrApiRequestService.reqAccountGetByIdText({ id_text });

    if (!ssrAccount) {
      // Account not found or not accessible
      redirect("/profiles");
      return;
    }

    // Check if user is viewing their own profile
    if (isValidAuthSession) {
      const ssrLoggedInAccount = await ssrApiRequestService.reqAuthMe();
      
      if (ssrLoggedInAccount) {
        if (ssrLoggedInAccount.id === ssrAccount.id) {
          // Redirect to my-profile if user views their own profile via public link
          redirect("/my-profile");
          return;
        }
      }
    }

    // Import ProfileClient dynamically to avoid circular dependencies
    const { ProfileClient } = await import("./ProfileClient");

    return (
      <ProfileClient ssrAccount={ssrAccount} />
    );
  } catch (error) {
    // Check if this is a Next.js redirect error - if so, re-throw it
    if (error && typeof error === 'object' && 'digest' in error) {
      const errorDigest = (error as { digest?: string }).digest;
      if (errorDigest && errorDigest.includes('NEXT_REDIRECT')) {
        throw error;
      }
    }
    
    // Account not found or error accessing account
    redirect("/profiles");
  }
}
