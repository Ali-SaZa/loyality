'use client';

import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Loyalty Program
          </h1>
          <p className="text-xl text-default-600">
            Modern loyalty system for traditional businesses in Iran
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <CardHeader className="pb-4">
              <h2 className="text-2xl font-semibold">For Customers</h2>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 mb-4">
                Earn points, discover stores, and enjoy rewards across multiple businesses.
              </p>
              <Button color="primary" className="w-full">
                Get Started
              </Button>
            </CardBody>
          </Card>

          <Card className="p-6">
            <CardHeader className="pb-4">
              <h2 className="text-2xl font-semibold">For Store Owners</h2>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 mb-4">
                Build customer loyalty, manage rewards, and grow your business.
              </p>
              <Button color="secondary" className="w-full">
                Join Now
              </Button>
            </CardBody>
          </Card>
        </div>

        <Card className="p-6">
          <CardHeader className="pb-4">
            <h2 className="text-2xl font-semibold">Quick Demo</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Input
                label="Phone Number"
                placeholder="09123456789"
                variant="bordered"
              />
              <Button color="primary">
                Send OTP
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
