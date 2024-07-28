type VerifyEmailPageProps = {
  searchParams: { [key: string]: string | undefined };
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  if (!searchParams?.token) {
    return;
  }
  const result = await verifyEmailUseCase({
    token: searchParams?.token,
  });

  return <div>Your email </div>;
}
