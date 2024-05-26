export enum TaskStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
}

export interface ITask {
  position?: number;
  id: number;
  status: keyof typeof TaskStatus;
  title: string;
  description?: string;
}
