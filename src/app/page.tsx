import { TrendsClient } from './trends-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  return (
    <main>
      <TrendsClient />
    </main>
  );
}
