"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Store, Clock } from "lucide-react";
import {
  OnboardingSchema,
  type OnboardingFormValues,
  generateSlug,
} from "@/features/onboarding/validation/onboarding.schema";
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
import { Separator } from "@/shared/components/ui/separator";

export function OnboardingForm() {
  const { createShop, isLoading } = useOnboarding();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      displayName: "",
      legalName:   "",
      slug:        "",
      description: "",
      email:       "",
      phone:       "",
    },
  });

  // Auto-generate slug from displayName (user can override)
  const displayName = form.watch("displayName");
  useEffect(() => {
    if (displayName) {
      form.setValue("slug", generateSlug(displayName), { shouldValidate: false });
    }
  }, [displayName, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createShop)} className="space-y-6">

        {/* ── Shop Identity ── */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Display Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Maison de Parfum" {...field} />
                </FormControl>
                <FormDescription>
                  The public name customers will see on the marketplace.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal / Business Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Maison de Parfum Pvt Ltd" {...field} />
                </FormControl>
                <FormDescription>
                  Registered legal name of your business (used for invoicing and compliance).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop URL Slug <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring">
                    <span className="px-3 text-sm text-muted-foreground select-none border-r border-input bg-muted rounded-l-md h-9 flex items-center">
                      insens.com/
                    </span>
                    <Input
                      className="border-0 focus-visible:ring-0 rounded-l-none"
                      placeholder="maison-de-parfum"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Lowercase letters, numbers and hyphens only. Auto-generated from your shop name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* ── About ── */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Your Shop</FormLabel>
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

        {/* ── Contact (optional) ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="shop@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+971 50 000 0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Submit ── */}
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating your shop…</>
          ) : (
            <><Store className="mr-2 h-4 w-4" /> Create My Shop</>
          )}
        </Button>

        {/* ── Approval notice ── */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 pt-4">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Pending Review</p>
              <p className="text-xs text-amber-700">
                Your shop will be reviewed by the Insens team before going live. This usually
                takes 1–2 business days.
              </p>
            </div>
          </CardContent>
        </Card>

      </form>
    </Form>
  );
}
