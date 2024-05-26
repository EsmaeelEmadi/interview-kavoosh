import React, { forwardRef } from 'react';

import { Box, Divider, Grid, Paper, Typography } from '@material';
import { theme } from '@themes/material/mainTheme';

export interface IContainerProps {
  children: React.ReactNode;
  label?: string;
  placeholder?: boolean;
  onClick?(): void;
}

const Container = forwardRef<HTMLDivElement, IContainerProps>(
  ({ children, label, placeholder, ...props }, ref) => {
    return (
      <Grid
        lg={4}
        md={12}
        sm={12}
        xs={12}
        item
        padding={theme.spacing(2)}
        {...props}
        ref={ref}
        data-testid={`container-${label}`}
      >
        <Paper
          elevation={0}
          square={false}
          sx={{
            border: 3,
            borderColor: theme.palette.grey[200],
            background: theme.palette.grey[100],
          }}
        >
          <Box paddingY={2} paddingX={3} sx={{ background: theme.palette.background.paper }}>
            <Typography variant='h6' fontWeight={theme.typography.fontWeightBold}>
              {label}
            </Typography>
          </Box>
          <Divider sx={{ border: 2, borderColor: theme.palette.grey[200] }} />
          {placeholder ? (
            children
          ) : (
            <Box padding={2}>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  gap: theme.spacing(1),
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {children}
              </ul>
            </Box>
          )}
        </Paper>
      </Grid>
    );
  },
);

export default Container;
