// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CaseSimulation } from './CaseSimulation';

afterEach(cleanup);

describe('CaseSimulation', () => {
  it('labels synthetic behavior and exposes failure outcomes', () => {
    render(<CaseSimulation />);
    expect(screen.getByText('SIMULATION · NOT LIVE TRAFFIC')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'INCIDENT' }));
    expect(screen.getByText('503 · FAIL CLOSED')).toBeTruthy();
    expect(screen.getByText('dependency failure → no false success')).toBeTruthy();
  });
});
