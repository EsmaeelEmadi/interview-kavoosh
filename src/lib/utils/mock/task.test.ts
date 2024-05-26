import mockDataProvider, { init } from './task';

// TYPES
import { TaskStatus } from '@types_/models/task';

describe('test mock provider test', () => {
  beforeAll(() => {
    init('cache-test');
  });

  afterEach(() => {
    // Clear localStorage before each test
    mockDataProvider.clear();
  });

  it('Initialize with empty data', async () => {
    const data = await mockDataProvider.get();
    const cacheData = mockDataProvider.getCache();

    expect(data.length).toEqual(1);
    expect(cacheData).toEqual(cacheData);
  });

  it('should add a task', async () => {
    const newTask = await mockDataProvider.post({
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.TODO,
    });

    const data = await mockDataProvider.get();
    const cache = mockDataProvider.getCache();

    expect(data.find((task) => task.id === newTask.id)).toBeTruthy();
    expect(cache).toBeTruthy();
    expect(cache?.length).toEqual(data.length);
  });

  it('should update a task', async () => {
    const newTask = await mockDataProvider.post({
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.TODO,
    });

    const updatedTask = await mockDataProvider.update({
      id: newTask.id,
      title: 'Updated Task',
      description: 'Updated Description',
      status: TaskStatus.DONE,
    });

    const cache = mockDataProvider.getCache();
    const newTaskFromCache = cache?.find((task) => task.id === newTask.id);

    expect(cache).toBeTruthy();
    expect(newTaskFromCache).toBeTruthy();
    expect(newTaskFromCache).toEqual({
      id: newTask.id,
      title: 'Updated Task',
      description: 'Updated Description',
      status: TaskStatus.DONE,
    });
    expect(updatedTask).toEqual({
      id: newTask.id,
      title: 'Updated Task',
      description: 'Updated Description',
      status: TaskStatus.DONE,
    });
  });

  it('should remove a task', async () => {
    const newTask = await mockDataProvider.post({
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.TODO,
    });

    const sizeAfterAdd = (await mockDataProvider.get()).length;

    await mockDataProvider.remove(newTask.id);

    const cache = mockDataProvider.getCache();
    const data = await mockDataProvider.get();

    expect(data.length).toEqual(sizeAfterAdd - 1);
    expect(cache?.length).toEqual(data.length);
  });
});
