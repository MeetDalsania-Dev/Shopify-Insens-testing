import { Shop } from '../types/shops.types';
import { ShopStatusBadge } from './ShopStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { formatDate } from '@/shared/lib/utils';
import { MapPin, Calendar, Hash, User, Mail } from 'lucide-react';

interface ShopDetailCardProps {
  shop: Shop;
}

export function ShopDetailCard({ shop }: ShopDetailCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">Shop Information</CardTitle>
            <ShopStatusBadge status={shop.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{shop.name}</h2>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">{shop.slug}</p>
          </div>

          {shop.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{shop.description}</p>
          )}

          <Separator />

          <div className="space-y-3">
            {shop.city && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{shop.city}</span>
                {shop.address && <span className="text-muted-foreground">— {shop.address}</span>}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              Registered {formatDate(shop.createdAt)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-4 w-4 shrink-0" />
              <span className="font-mono text-xs">{shop.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Owner Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {shop.owner.firstName || shop.owner.lastName
                  ? [shop.owner.firstName, shop.owner.lastName].filter(Boolean).join(' ')
                  : 'Shop Owner'}
              </p>
              <p className="text-sm text-muted-foreground">{shop.owner.email}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              {shop.owner.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-4 w-4 shrink-0" />
              <span className="font-mono text-xs">{shop.owner.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
