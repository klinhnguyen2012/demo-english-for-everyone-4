import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App classroom shell', () => {
  it('moves forward, backward, and by arrow keys without leaving bounds', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Let’s get started!' }),
    ).toBeVisible();
    expect(screen.getAllByText('Stage 1 of 8')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(
      screen.getByRole('heading', { name: 'Listen carefully' }),
    ).toBeVisible();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(
      screen.getByRole('heading', { name: 'Let’s get started!' }),
    ).toBeVisible();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(
      screen.getByRole('heading', { name: 'Let’s get started!' }),
    ).toBeVisible();
  });

  it('does not use arrow navigation while a form field has focus', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /next/i }));
    const safeField = screen.getByLabelText('Playback speed');
    await user.click(safeField);
    fireEvent.keyDown(safeField, { key: 'ArrowRight' });

    expect(
      screen.getByRole('heading', { name: 'Listen carefully' }),
    ).toBeVisible();
  });

  it('shows the original Ami Connect logo and progress', () => {
    render(<App />);

    expect(
      screen.getByRole('img', { name: 'Ami Connect' }),
    ).toHaveAttribute(
      'src',
      expect.stringContaining('assets/ami_connect_logo.jpeg'),
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '1',
    );
    expect(screen.getByLabelText('20-minute lesson timer')).toHaveTextContent(
      '20:00',
    );
  });

  it('keeps teacher guidance hidden until the teacher opens it', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByText(/Start with a relaxed/)).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Show teacher notes' }),
    );
    expect(screen.getByText(/Start with a relaxed/)).toBeVisible();
  });
});
