'use client';

import { useParams } from 'next/navigation';
import { useShop } from '@/features/shops/hooks/useShop';
import { ShopProductsTable } from '@/features/shops/components/ShopProductsTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ShopProductsPage() {
  const { id } = useParams<{ id: string }>();
  const { shop } = useShop(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/shops/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {shop?.name ?? 'Shop'}
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Shop Products"
        description={`All products listed by ${shop?.name ?? 'this shop'} — read only`}
      />

      <ShopProductsTable shopId={id} />
    </div>
  );
}
