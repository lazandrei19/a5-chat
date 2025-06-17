import React from 'react';
import type { FC } from 'react';
// @ts-ignore
import { usePage, useForm } from '@inertiajs/react';
import AuthLayout from '../Layout';
import { ChatLayout } from '@/components/chat/ChatLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

interface SettingsProps {
  api_key: string;
}

const Settings: FC<SettingsProps> = () => {
  const { props } = usePage<SettingsProps & { errors?: Record<string, any> }>();
  const initialKey = props.api_key || '';

  const form = useForm({ api_key: initialKey });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.patch('/settings', {
      preserveScroll: true,
      onSuccess: () => {
        // Optionally show a success notification
      },
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium text-gray-700">
              OpenRouter API Key
            </label>
            <Input
              id="api-key"
              type="password"
              value={form.data.api_key}
              onChange={(e) => form.setData('api_key', e.target.value)}
              placeholder="Enter your API Key"
            />
            {form.errors.api_key && (
              <div className="text-red-500 text-sm">{form.errors.api_key}</div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={handleSubmit} disabled={form.processing || !form.isDirty}>
            {form.processing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : !form.isDirty && form.recentlySuccessful ? (
              <div className="flex items-center space-x-1">
                <Check className="h-4 w-4 text-green-500" />
                <span>Saved</span>
              </div>
            ) : (
              'Save'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// @ts-ignore - Inertia allows assigning a layout function at runtime
Settings.layout = (page) => (
  <AuthLayout>
    <ChatLayout>{page}</ChatLayout>
  </AuthLayout>
);

export default Settings; 