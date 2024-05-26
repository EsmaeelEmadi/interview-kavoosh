import { theme } from '@themes/material/mainTheme';
import getColor from './getColor';

// TYPES
import { TaskStatus } from '@types_/models/task';

describe('getColor function', () => {
  it('returns correct color for TODO status', () => {
    expect(getColor(TaskStatus.TODO)).toBe(theme.palette.warning.light);
  });

  it('returns correct color for DOING status', () => {
    expect(getColor(TaskStatus.DOING)).toBe(theme.palette.info.light);
  });

  it('returns correct color for DONE status', () => {
    expect(getColor(TaskStatus.DONE)).toBe(theme.palette.success.light);
  });

  it('returns undefined for unknown status', () => {
    expect(getColor()).toBeUndefined();
  });
});
