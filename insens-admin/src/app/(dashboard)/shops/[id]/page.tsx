'use client';

import { useParams, useRouter } from 'next/navigation';
import { useShop } from '@/features/shops/hooks/useShop';
import { ShopDetailCard } from '@/features/shops/components/ShopDetailCard';
import { ShopActionButtons } from '@/features/shops/components/ShopActionButtons';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/components/ui/button';
import { FullPageLoader } from '@/shared/components/LoadingSpinner';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { shop, isLoading, mutate } = useShop(id);

  if (isLoading) return <FullPageLoader />;
  if (!shop) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Shop not found.</p>
        <Button variant="ghost" onClick={() => router.push('/shops')} className="mt-4">
          Back to Shops
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/shops">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Shops
          </Link>
        </Button>
      </div>

      <PageHeader
        title={shop.name}
        description={`Shop detail — ${shop.status.toLowerCase()} status`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/shops/${id}/products`}>
                <Package className="h-4 w-4 mr-1.5" />
                View Products
              </Link>
            </Button>
            <ShopActionButtons shopId={id} status={shop.status} onSuccess={mutate} />
          </div>
        }
      />

      <ShopDetailCard shop={shop} />
    </div>
  );
}
