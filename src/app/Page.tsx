import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// THEMES
import { theme } from '@themes/material/mainTheme';

// COMPONENTS
import TodoBoard from '@features/todoBoard/TodoBoard';

// TYPES
import type { FC } from 'react';

const Page: FC = () => {
  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TodoBoard />
      </ThemeProvider>
    </div>
  );
};

export default Page;
