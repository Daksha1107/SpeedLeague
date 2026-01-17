'use client';

import { Card, CardBody } from '@nextui-org/react';

interface AttemptCounterProps {
  used: number;
  total: number;
}

export default function AttemptCounter({ used, total }: AttemptCounterProps) {
  return (
    <Card className="w-full">
      <CardBody className="flex flex-row items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Attempts Today
          </p>
          <p className="text-2xl font-bold">
            {total - used} / {total}
          </p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-8 rounded ${
                i < used
                  ? 'bg-gray-300 dark:bg-gray-700'
                  : 'bg-primary'
              }`}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
