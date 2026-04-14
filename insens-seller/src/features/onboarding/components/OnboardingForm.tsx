"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Store, Clock } from "lucide-react";
import Image from "next/image";
import { OnboardingSchema, type OnboardingFormValues } from "@/features/onboarding/validation/onboarding.schema";
import { useOnboarding } from "@/features/onboarding/hooks/useOnboarding";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Card, CardContent } from "@/shared/components/ui/card";
import { isValidUrl } from "@/shared/lib/utils";

export function OnboardingForm() {
  const { createShop, isLoading } = useOnboarding();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name:        "",
      description: "",
      city:        "",
      address:     "",
      logoUrl:     "",
    },
  });

  const logoUrl = form.watch("logoUrl");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createShop)} className="space-y-6">
        {/* Shop Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. Maison de Parfum" {...field} />
              </FormControl>
              <FormDescription>This is the public name of your shop.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell buyers about your shop, your story, and what makes your fragrances unique…"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City + Address row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Dubai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Luxury Ave, Sheikh Zayed Rd" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Logo URL + preview */}
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://yoursite.com/logo.png" {...field} />
              </FormControl>
              <FormDescription>Paste a direct link to your shop logo image.</FormDescription>
              <FormMessage />
              {logoUrl && isValidUrl(logoUrl) && (
                <div className="mt-2 h-16 w-16 overflow-hidden rounded-lg border border-cream-200">
                  <Image
                    src={logoUrl}
                    alt="Logo preview"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating your shop…</>
          ) : (
            <><Store className="mr-2 h-4 w-4" /> Create My Shop</>
          )}
        </Button>

        {/* Approval notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 pt-4">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Pending Review</p>
              <p className="text-xs text-amber-700">
                Your shop will be reviewed by the Insens team before going live. This usually takes
                1–2 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
