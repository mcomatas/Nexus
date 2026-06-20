type GamePageProps = {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params

  return (
    <div>
      This is the {slug} page
    </div>
  );
}
