import { faker } from '@faker-js/faker';
import { ITask, TaskStatus } from '@types_/models/task';

// NOTE: it is store the storage on env
export const STORAGE_PATH = 'kavoosh';

export class TaskMockDataProvider {
  private lastId: number;
  private data: Map<number, ITask>;
  private storagePath: string;

  constructor(storagePath?: string) {
    this.storagePath = storagePath ?? STORAGE_PATH;

    this.lastId = 0;
    this.data = new Map();
    this.read();
  }

  // just for test
  public clear() {
    this.data = new Map();
    this.store();
  }

  // just for test
  public getCache(): ITask[] {
    const cache = localStorage.getItem(this.storagePath);
    if (cache) {
      return JSON.parse(cache);
    }

    return [];
  }

  private store() {
    const arrayFromData = Array.from(this.data.values());
    const strignData = arrayFromData.length ? JSON.stringify(arrayFromData) : '';
    localStorage.setItem(this.storagePath, strignData);
  }

  private read() {
    const cache = localStorage.getItem(this.storagePath);
    if (cache && cache.length) {
      (JSON.parse(cache) as ITask[]).forEach((task) => {
        if (task.id > this.lastId) {
          this.lastId = task.id;
        }
        this.data.set(task.id, task);
      });
    } else {
      // create one sample data if cache is empty
      this.data.set(++this.lastId, {
        id: this.lastId,
        title: faker.word.noun(),
        description: faker.word.words(50),
        status: TaskStatus.TODO,
      });
      this.store();
    }
  }

  public async get(): Promise<ITask[]> {
    return new Promise<ITask[]>((resolve) => {
      setTimeout(() => {
        resolve(Array.from(this.data.values()));
      }, 500);
    });
  }

  public async post(task: Omit<ITask, 'id'>): Promise<ITask> {
    return new Promise<ITask>((resolve) => {
      (task as ITask).id = ++this.lastId;

      this.data.set(this.lastId, task as ITask);
      this.store();
      setTimeout(() => {
        resolve(task as ITask);
      }, 500);
    });
  }

  // public async patch(fields: Omit<Partial<ITask>, 'id'>, id: number): Promise<ITask> {
  //   return new Promise<ITask>((resolve, reject) => {
  //     setTimeout(() => {
  //       const taskFromData = this.data.get(id);
  //
  //       if (!taskFromData) {
  //         reject(new Error(`No item with id ${id} is available`));
  //       } else {
  //         const newTask = { ...taskFromData, ...fields };
  //         this.data.set(id, newTask);
  //         resolve(newTask);
  //       }
  //     }, 500);
  //   });
  // }

  public async update(fields: ITask): Promise<ITask> {
    return new Promise<ITask>((resolve, reject) => {
      const taskFromData = this.data.get(fields.id);
      let updatedTask: ITask;

      if (taskFromData) {
        updatedTask = { ...taskFromData, ...fields };
        this.data.set(fields.id, updatedTask);
        this.store();
      }

      setTimeout(() => {
        if (!taskFromData) {
          reject(new Error(`No item with id ${fields.id} is available`));
        } else {
          resolve(updatedTask);
        }
      }, 500);
    });
  }

  public async remove(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const taskFromData = this.data.get(id);

      if (taskFromData) {
        this.data.delete(id);
        this.store();
      }

      setTimeout(() => {
        if (!taskFromData) {
          reject(new Error(`No item with id ${id} is available`));
        } else {
          resolve();
        }
      }, 500);
    });
  }
}

let singleton = new TaskMockDataProvider();

export default singleton;

// for test
export const init = (storagePath?: string) => {
  singleton = new TaskMockDataProvider(storagePath);
};
