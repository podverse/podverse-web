import { redirect } from "next/navigation";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { MyProfileClient } from "./MyProfileClient";

export default async function MyProfilePage() {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  if (!isValidAuthSession) {
    redirect("/");
    return;
  }

  try {
    const ssrAccount = await ssrApiRequestService.reqAuthMe();
    
    if (!ssrAccount) {
      redirect("/");
      return;
    }

  return (
      <MyProfileClient ssrAccount={ssrAccount} />
  );
  } catch (error) {
    redirect("/");
  }
}
