type Props = {
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  children: React.ReactNode;
};

export default function QueryState({
  loading,
  error,
  errorMessage,
  children,
}: Props) {
  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        {errorMessage}
      </div>
    );
  }

  return <>{children}</>;
}