import { verifyEmailUseCase } from "@/use-cases/email-verification-token/verify";

type VerifyEmailPageProps = {
  searchParams: { [key: string]: string | undefined };
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  if (!searchParams?.token) {
    return <div>Invalid Token.</div>;
  }
  try {
    await verifyEmailUseCase({
      token: searchParams?.token,
    });
  } catch (error) {
    return <div>Invalid Token.</div>;
  }

  return <div>Your email is verified.</div>;
}
