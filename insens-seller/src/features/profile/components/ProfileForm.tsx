"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import useSWR from "swr";
import swrFetcher from "@/shared/lib/swr-fetcher";
import { ProfileSchema, type ProfileFormValues } from "@/features/profile/validation/profile.schema";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { UserProfile } from "@/features/profile/types/profile.types";

export function ProfileForm() {
  const { data: user, isLoading } = useSWR<UserProfile>("/api/v1/users/me", swrFetcher);
  const { updateProfile, isUpdating } = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName ?? "",
        lastName:  user.lastName  ?? "",
        email:     user.email     ?? "",
      });
    }
  }, [user, form]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  async function onSubmit(values: ProfileFormValues) {
    await updateProfile({
      firstName: values.firstName,
      lastName:  values.lastName,
      email:     values.email,
    });
  }

  return (
    <div className="space-y-6">
      {/* Card 1 – Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name <span className="text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdating} className="min-w-36">
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Card 2 – Change Password (Coming Soon) */}
      <Card className="opacity-60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>
            Password change will be available in the next update.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Current Password", "New Password", "Confirm Password"].map((label) => (
            <div key={label} className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{label}</label>
              <Input type="password" disabled placeholder="••••••••" className="cursor-not-allowed" />
            </div>
          ))}
          <Button disabled variant="outline" className="cursor-not-allowed">
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
