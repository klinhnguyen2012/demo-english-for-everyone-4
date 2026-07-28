import { expect, test } from '@playwright/test';

test.describe('Ami Connect complete lesson journey', () => {
  test('teacher can complete every lesson stage at 1366×768', async ({
    page,
  }) => {
    const consoleProblems: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') {
        consoleProblems.push(`${message.type()}: ${message.text()}`);
      }
    });
    page.on('pageerror', (error) => consoleProblems.push(error.message));

    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Let’s get started!' }),
    ).toBeVisible();
    await expect(page.getByRole('img', { name: 'Ami Connect' })).toBeVisible();
    await expect(page.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '1',
    );
    await expect(page.getByLabel('20-minute lesson timer')).toContainText(
      '20:00',
    );

    const documentFits = async () =>
      page.evaluate(
        () => document.documentElement.scrollHeight <= window.innerHeight + 1,
      );
    expect(await documentFits()).toBe(true);

    await page.getByRole('button', { name: 'Enter fullscreen' }).click();
    const exitFullscreen = page.getByRole('button', {
      name: 'Exit fullscreen',
    });
    const fullscreenFallback = page
      .getByRole('status')
      .filter({ hasText: /Fullscreen/ });
    await expect
      .poll(async () => {
        const fullscreenOpened = await exitFullscreen
          .isVisible()
          .catch(() => false);
        const fullscreenFallbackVisible = await fullscreenFallback
          .isVisible()
          .catch(() => false);

        return fullscreenOpened || fullscreenFallbackVisible;
      })
      .toBe(true);

    if (await exitFullscreen.isVisible().catch(() => false)) {
      await exitFullscreen.click();
    }

    await page.getByRole('button', { name: 'Show teacher notes' }).click();
    await expect(
      page.getByRole('complementary', { name: 'Teacher notes' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Hide teacher notes' }).click();

    await page.getByRole('button', { name: 'Great' }).click();
    await expect(
      page.getByText('How has your day been so far?'),
    ).toBeVisible();
    await expect(
      page.getByLabel('20-second speaking timer'),
    ).not.toBeVisible();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Listen carefully' }),
    ).toBeVisible();
    await expect(
      page.getByLabel('Think and speak timer', { exact: true }),
    ).not.toBeVisible();
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Let’s get started!' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(
      page.getByText(
        'Hi, I’m Alex. I recently joined a new school, and at first I felt nervous because I didn’t know anyone. A few days later, I met someone who also enjoys basketball. We now practise together twice a week. Joining the team has helped me feel more confident and has made it easier to make new friends.',
      ),
    ).not.toBeVisible();
    await page.getByRole('button', { name: 'Show transcript' }).click();
    await expect(page.getByText(/Hi, I’m Alex/)).toBeVisible();
    await page.getByLabel('Playback speed').selectOption('1.25');
    const playListening = page.getByRole('button', { name: 'Play', exact: true });
    if (await playListening.isEnabled()) {
      await playListening.click();
      await page.getByRole('button', { name: 'Pause', exact: true }).click();
      await page.getByRole('button', { name: 'Replay', exact: true }).click();
    }
    await page
      .getByLabel('He did not know anyone at the new school.')
      .check();
    await expect(page.getByText('That’s correct.')).not.toBeVisible();
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.getByText('That’s correct.')).toBeVisible();
    await page.getByRole('button', { name: 'Next question' }).click();
    await page.getByLabel('False').check();
    await page.getByRole('button', { name: 'Check answer' }).click();
    await page.getByRole('button', { name: 'Next question' }).click();
    await expect(
      page.getByLabel('30-second speaking timer', { exact: true }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Technology' }).click();
    await expect(
      page.getByText('How does technology make your daily life easier?'),
    ).toBeVisible();
    await expect(
      page.getByText(
        'What to do? Give the student 2 minutes to think, then 1 minute to speak. Restart for each follow-up question.',
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByLabel('Think and speak timer', { exact: true }),
    ).toContainText(/Think\s*2:00/);
    await page.getByRole('button', { name: 'Start think timer' }).click();
    await page.getByRole('button', { name: 'Pause think timer' }).click();
    await page.getByRole('button', { name: 'Need some words?' }).click();
    await expect(page.getByText('communicate')).toBeVisible();
    await page.getByRole('button', { name: 'Next question' }).click();
    await expect(page.getByText('Can you give me an example?')).toBeVisible();
    await expect(
      page.getByLabel('Think and speak timer', { exact: true }),
    ).toContainText(/Think\s*2:00/);

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    for (const step of ['Answer', 'Reason', 'Example', 'Ask Back']) {
      await page.getByRole('button', { name: `Reveal ${step}` }).click();
    }
    const answerItem = page.locator('.order-list li').filter({
      hasText: 'Answer',
    });
    const reasonItem = page.locator('.order-list li').filter({
      hasText: 'Reason',
    });
    await answerItem.dragTo(reasonItem);
    const exampleItem = page.locator('.order-list li').filter({
      hasText: 'Example',
    });
    const askBackItem = page.locator('.order-list li').filter({
      hasText: 'Ask Back',
    });
    await exampleItem.dragTo(askBackItem);
    await page.getByRole('button', { name: 'Check order' }).click();
    await expect(page.getByText('Excellent order!')).toBeVisible();
    await expect(
      page.getByText(
        'Is learning English online better than learning in a classroom?',
      ),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Show follow-up' }).click();
    await expect(
      page.getByText('Why is that important to you?'),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Completed' }).click();
    await expect(page.getByText('Question 2 of 6')).toBeVisible();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(
      page.getByLabel('Think and speak timer', { exact: true }),
    ).not.toBeVisible();
    await page
      .getByRole('button', { name: 'Visit a science museum' })
      .click();
    for (const checkpoint of [
      'State a preference',
      'Give a reason',
      'Respond to a different opinion',
      'Suggest another option',
      'Reach a final decision',
    ]) {
      await page.getByRole('button', { name: checkpoint }).click();
    }
    await expect(page.getByText('Mission completed!')).toBeVisible();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(
      page.getByLabel('90-second speaking timer', { exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Show keywords' }).click();
    await expect(page.getByText('currently')).toBeVisible();
    await page
      .getByRole('button', { name: 'Start 90-second speaking timer' })
      .click();
    await page
      .getByRole('button', { name: 'Pause 90-second speaking timer' })
      .click();
    await page
      .getByRole('button', { name: 'Reset 90-second speaking timer' })
      .click();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    const handoffGuidance = page.getByRole('note', {
      name: 'Teacher handoff instructions',
    });
    await expect(handoffGuidance).toContainText(
      'send the summary to Ms. Soan',
    );
    await page
      .locator('.rating-table fieldset')
      .filter({ hasText: 'Listening' })
      .getByText('Strong', { exact: true })
      .click();
    await page
      .locator('.rating-table fieldset')
      .filter({ hasText: 'Fluency' })
      .getByText('Developing', { exact: true })
      .click();
    await page
      .getByLabel('Strength 1')
      .fill('Explained ideas clearly and gave useful examples.');
    await page
      .getByLabel('Next learning step')
      .fill('Use more linking phrases.');
    await page.getByRole('button', { name: 'Generate summary' }).click();
    await expect(handoffGuidance).toBeVisible();
    await expect(page.getByLabel('Generated summary')).toHaveValue(
      /Listening: Strong/,
    );
    await page.getByRole('button', { name: 'Copy summary' }).click();
    await expect(page.getByRole('status')).toContainText(
      /copied|selected/i,
    );

    expect(await documentFits()).toBe(true);
    expect(consoleProblems).toEqual([]);

    page.once('dialog', (dialog) => void dialog.accept());
    await page.getByRole('button', { name: 'Restart lesson' }).click();
    await expect(
      page.getByRole('heading', { name: 'Let’s get started!' }),
    ).toBeVisible();
  });

  test('microphone denial does not block the final speaking task', async ({
    context,
    page,
  }) => {
    await context.clearPermissions();
    await page.goto('/');
    for (let index = 0; index < 6; index += 1) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }
    await page.getByRole('button', { name: 'Record' }).click();
    await expect(page.getByRole('status')).toContainText(
      /not allowed|could not start|not available/i,
    );
    await expect(
      page.getByRole('button', { name: 'Next', exact: true }),
    ).toBeEnabled();
  });
});
