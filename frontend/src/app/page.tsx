'use client';

import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-primary">
            Loyalty Program
          </h1>
          <p className="text-xl text-foreground-secondary mb-6">
            Modern loyalty system for traditional businesses in Iran
          </p>
          <div className="w-24 h-1 mx-auto rounded-full bg-secondary"></div>
        </div>

        {/* Main Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Customer Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <h2 className="text-2xl font-semibold text-primary">
                For Customers
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-foreground-secondary mb-6">
                Earn points, discover stores, and enjoy rewards across multiple businesses.
              </p>
              <Button 
                color="primary"
                className="w-full"
                size="lg"
              >
                Get Started
              </Button>
            </CardBody>
          </Card>

          {/* Store Owner Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <h2 className="text-2xl font-semibold text-secondary">
                For Store Owners
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-foreground-secondary mb-6">
                Build customer loyalty, manage rewards, and grow your business.
              </p>
              <Button 
                color="secondary"
                className="w-full"
                size="lg"
              >
                Join Now
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Demo Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Quick Demo
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Input
                label="Phone Number"
                placeholder="09123456789"
                className="max-w-md"
                color="primary"
                variant="bordered"
              />
              <Button 
                color="primary"
                size="lg"
              >
                Send OTP
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Color Palette Showcase */}
        <div className="mt-16 p-6 rounded-lg bg-background-secondary">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Our Beautiful Color Palette
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg mx-auto mb-2 bg-primary"></div>
              <p className="text-xs font-medium">Caribbean</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg mx-auto mb-2 bg-secondary"></div>
              <p className="text-xs font-medium">Tiffany</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg mx-auto mb-2 bg-background"></div>
              <p className="text-xs font-medium">Alice Blue</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg mx-auto mb-2 bg-background-secondary"></div>
              <p className="text-xs font-medium">Anti-Flash</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg mx-auto mb-2 bg-foreground"></div>
              <p className="text-xs font-medium">Onyx</p>
            </div>
          </div>
        </div>

        {/* Test Section - Show Tailwind Classes Working */}
        <div className="mt-16 p-6 rounded-lg bg-primary-50 border border-primary-200">
          <h3 className="text-lg font-semibold mb-4 text-primary-700">
            Tailwind v4 Color Classes Test
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-primary text-primary-foreground rounded">Primary Button Style</div>
            <div className="p-3 bg-secondary text-secondary-foreground rounded">Secondary Button Style</div>
            <div className="p-3 bg-success text-success-foreground rounded">Success Style</div>
            <div className="p-3 bg-warning text-warning-foreground rounded">Warning Style</div>
            <div className="p-3 bg-danger text-danger-foreground rounded">Danger Style</div>
            <div className="p-3 bg-background text-foreground border border-foreground-muted rounded">Background Style</div>
          </div>
        </div>
      </div>
    </div>
  );
}
