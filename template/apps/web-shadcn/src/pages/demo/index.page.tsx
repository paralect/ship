import Link from 'next/link';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from 'components/ui/alert';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Checkbox } from 'components/ui/checkbox';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { PasswordInput } from 'components/ui/password-input';
import { Text, Title } from 'components/ui/typography';

const Demo = () => {
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
            <CardTitle>Input & PasswordInput</CardTitle>

            <CardDescription>Text input components with labels</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Text Input</Label>
              <Input id="text-input" placeholder="Type something..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-input">Email</Label>
              <Input id="email-input" type="email" placeholder="Email address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-input">Password (with toggle)</Label>
              <PasswordInput id="password-input" placeholder="Enter password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disabled-input">Disabled Input</Label>
              <Input id="disabled-input" disabled placeholder="Disabled input" />
            </div>
          </CardContent>
        </Card>

        {/* Checkbox Section */}
        <Card>
          <CardHeader>
            <CardTitle>Checkbox</CardTitle>

            <CardDescription>Checkbox component with label</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="disabled" disabled />
              <Label htmlFor="disabled" className="text-muted-foreground">
                Disabled checkbox
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="checked-disabled" disabled checked />
              <Label htmlFor="checked-disabled" className="text-muted-foreground">
                Disabled checked
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Alert Section */}
        <Card>
          <CardHeader>
            <CardTitle>Alert</CardTitle>

            <CardDescription>Alert component variants</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>This is a default informational alert.</AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Something went wrong. Please try again.</AlertDescription>
            </Alert>

            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your changes have been saved successfully.</AlertDescription>
            </Alert>
          </CardContent>
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

            <CardDescription>Title and Text components (Mantine replacement)</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Title order={1}>Title order 1</Title>
            <Title order={2}>Title order 2</Title>
            <Title order={3}>Title order 3</Title>
            <Title order={4}>Title order 4</Title>

            <Text>Regular text</Text>
            <Text size="sm" variant="muted">
              Muted small text
            </Text>
            <Text size="lg" weight="semibold">
              Large semibold text
            </Text>
            <Text variant="destructive">Destructive text</Text>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;
