import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'components/ui/card';
import { Input } from 'components/ui/input';

const Demo = () => {
  const [inputValue, setInputValue] = useState('');

  const handleToast = () => {
    toast.success('This is a success toast!');
  };

  const handleErrorToast = () => {
    toast.error('This is an error toast!');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Component Demo</h1>

          <Link href="/">
            <Button variant="outline">← Back Home</Button>
          </Link>
        </div>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>

            <CardDescription>Different button variants and sizes</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>

            <CardDescription>Text input component</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input placeholder="Type something..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <Input type="email" placeholder="Email address" />
            <Input type="password" placeholder="Password" />
            <Input disabled placeholder="Disabled input" />
          </CardContent>

          <CardFooter>
            <p className="text-sm text-muted-foreground">Current value: {inputValue || '(empty)'}</p>
          </CardFooter>
        </Card>

        {/* Toast Section */}
        <Card>
          <CardHeader>
            <CardTitle>Toasts (Sonner)</CardTitle>

            <CardDescription>Notification system using Sonner</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex gap-4">
              <Button onClick={handleToast}>Show Success Toast</Button>
              <Button variant="destructive" onClick={handleErrorToast}>
                Show Error Toast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Typography Section */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>

            <CardDescription>Text styles using Tailwind</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-semibold">Heading 2</h2>
            <h3 className="text-2xl font-medium">Heading 3</h3>

            <p className="text-base">Regular paragraph text</p>
            <p className="text-sm text-muted-foreground">Muted text for descriptions</p>
            <p className="text-xs text-muted-foreground">Small helper text</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;
