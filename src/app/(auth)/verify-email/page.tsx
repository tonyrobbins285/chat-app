import { verifyEmailUseCase } from "@/use-cases/email-verification";
import VerifyFail from "../../../components/verify-email/verify-fail";

type VerifyEmailPageProps = {
  searchParams: { [key: string]: string | undefined };
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const result = await verifyEmailUseCase({ token: searchParams?.token });

  return result ? (
    <div>
      <h2>{result.message}</h2>
    </div>
  ) : (
    <VerifyFail />
  );
}
