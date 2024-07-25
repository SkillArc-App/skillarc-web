import BadgeIcon from '@/app/components/BadgeIcon';
import { renderWithTheme } from '@/app/test-utils/render-with-theme';
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