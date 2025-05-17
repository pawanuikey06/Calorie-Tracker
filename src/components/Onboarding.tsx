import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number()
    .min(15, "Age must be at least 15")
    .max(120, "Age must be less than 120"),
  weight: z.coerce.number()
    .min(30, "Weight must be at least 30kg")
    .max(300, "Weight must be less than 300kg"),
  height: z.coerce.number()
    .min(120, "Height must be at least 120cm")
    .max(250, "Height must be less than 250cm"),
  gender: z.enum(["male", "female"]),
  activityLevel: z.enum(["low", "medium", "high"]),
  goal: z.enum(["lose", "maintain", "gain"])
});

type FormValues = z.infer<typeof formSchema>;

const activityDescriptions = {
  low: "Little or no exercise, desk job",
  medium: "Moderate exercise 3-5 days/week",
  high: "Heavy exercise 6-7 days/week"
} as const;

const goalDescriptions = {
  lose: "Lose weight - 20% calorie deficit",
  maintain: "Maintain weight - balanced calories",
  gain: "Gain weight - 20% calorie surplus"
} as const;

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      weight: undefined,
      height: undefined,
      gender: "male",
      activityLevel: "medium",
      goal: "maintain"
    }
  });

  const onSubmit = (data: FormValues) => {
    // Store in localStorage
    localStorage.setItem('userProfile', JSON.stringify(data));
    // Redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background p-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Calorie Tracker</h1>
          <p className="text-muted-foreground">Let's personalize your experience</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            <CardDescription>
              This information helps us calculate your daily calorie needs accurately
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6">
                  {/* Name Input */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Age Input */}
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" min="15" max="120" placeholder="Years" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Gender Select */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Weight Input */}
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input type="number" min="30" max="300" placeholder="kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Height Input */}
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input type="number" min="120" max="250" placeholder="cm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Activity Level Select */}
                  <FormField
                    control={form.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(activityDescriptions).map(([key, description]) => (
                              <SelectItem key={key} value={key}>
                                {description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the option that best matches your weekly activity
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Goal Select */}
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(goalDescriptions).map(([key, description]) => (
                              <SelectItem key={key} value={key}>
                                {description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This will help us adjust your daily calorie target
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Track Your Calories
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding; 