import BadgeIcon from '@/frontend/components/BadgeIcon.component';
import { renderWithTheme } from '@/test-utils/render-with-theme';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { FaAccusoft } from 'react-icons/fa';

describe('Page', () => {
  it('renders a badge icon', () => {
    renderWithTheme(<BadgeIcon count={1} icon={FaAccusoft} onClick={() => {}}  />)

    screen.getByText('1')
    screen.getByRole('icon')
  })
})