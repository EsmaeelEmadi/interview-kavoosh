import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// THEMES
import { theme } from '@themes/material/mainTheme';

// COMPONENTS
import TodoBoard from '@features/todoBoard/TodoBoard';

import { Typography } from '@material/index';

// TYPES
import type { FC } from 'react';

const Page: FC = () => {
    return (
        <div className='App'>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Typography variant='h3'>Kavoosh</Typography>
                <TodoBoard name='hello' />
            </ThemeProvider>
        </div>
    );
};

export default Page;
