import LoginForm from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth/auth-utils";
import { getEnabledProviders } from "@/lib/auth/get-enabled-providers";

const Page = async () => {
	await requireUnauth();
	const enabledProviders = getEnabledProviders();

	return <LoginForm enabledProviders={enabledProviders} />;
};

export default Page;
