'use client';

import { useState } from 'react';
import { QtyStepper } from '@/components/ui/qty-stepper';

export { Button } from '@/components/ui/button';
export { Tag } from '@/components/ui/tag';
export { Container } from '@/components/ui/container';
export { Icon } from '@/components/ui/icon';
export { Stars } from '@/components/ui/stars';

export function QtyStepperDemo() {
  const [v, setV] = useState(1);
  return <QtyStepper value={v} onChange={setV} />;
}
