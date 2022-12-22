import { TestComponent } from '../src/app/test.component';
import { test, expect } from '../playwright-ct-angular';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  const component = await mount(TestComponent);

  await expect(component).toContainText('Test Works');
});