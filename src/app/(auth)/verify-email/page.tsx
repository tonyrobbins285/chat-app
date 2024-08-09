import { verifyEmailUseCase } from "@/use-cases/email-verification";
import VerifyFail from "../../../components/verify-email/verify-fail";

type VerifyEmailPageProps = {
  searchParams: { [key: string]: string | undefined };
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token, userId } = searchParams;

  if (!token || !userId) {
    return <VerifyFail />;
  }

  const result = await verifyEmailUseCase({ token, userId });

  return result ? (
    <div>
      <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
        {result.message}
      </h2>
    </div>
  ) : (
    <VerifyFail />
  );
}
