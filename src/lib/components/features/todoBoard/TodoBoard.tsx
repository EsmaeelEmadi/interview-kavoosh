// TYPES
import type { FC } from 'react';

interface ITodoBoardProps {
    name: string;
}

const TodoBoard: FC<ITodoBoardProps> = () => {
    return <h1>TodoBoard</h1>;
};

export default TodoBoard;
