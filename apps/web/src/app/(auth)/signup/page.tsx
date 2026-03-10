import RegisterForm from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth/auth-utils";
import { getEnabledProviders } from "@/lib/auth/get-enabled-providers";

const Page = async () => {
	await requireUnauth();
	const enabledProviders = getEnabledProviders();

	return <RegisterForm enabledProviders={enabledProviders} />;
};

export default Page;
