import React, {useState} from "react";
import "./App.css";
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";
import todoList from "./TodoList";
import {Simulate} from "react-dom/test-utils";

export type FilterValuesType = "all" | "active" | "completed"

type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

type TasksStateType = {
    [todoListId: string]: Array<TaskType>
}

function App(): JSX.Element {

    const todoListId_1 = v1();
    const todoListId_2 = v1();

    const [todolists, setTodolists] = useState<Array<TodoListType>>([
        {id: todoListId_1, title: "What to learn", filter: "all"},
        {id: todoListId_2, title: "What to buy", filter: "active"},
    ]);


    const [tasksState, setTasksState] = useState<TasksStateType>({
        [todoListId_1]: [
            {id: v1(), title: "HTML", isDone: true},
            {id: v1(), title: "CSS", isDone: false},
            {id: v1(), title: "JS", isDone: false},
        ],
        [todoListId_2]: [
            {id: v1(), title: "Ice cream", isDone: true},
            {id: v1(), title: "Apple", isDone: true},
            {id: v1(), title: "Banana", isDone: false},
        ],
    });


    const changeTodolistFilter = (nextFilterValue: FilterValuesType, todoListId: string) => {
        const updatedTodoLists: Array<TodoListType> = todolists.map(tl => tl.id === todoListId
            ? {...tl, filter: nextFilterValue}
            : tl
        )
        setTodolists(updatedTodoLists)
    };
    const removeTask = (taskId: string, todoListId: string) => {
        // const tasksForTodolist: Array<TaskType> = tasksState[todoListId];
        // const updatedTasks: Array<TaskType> = tasksForTodolist.filter(t => t.id !== taskId)
        // const copyTasks: TasksStateType = {...tasksState}
        // copyTasks[todoListId] = updatedTasks
        // setTasksState(copyTasks)


        setTasksState({...tasksState, [todoListId]: tasksState[todoListId].filter(t => t.id !== taskId)})
    };
    const addTask = (title: string, todoListId: string) => {
        const newTask: TaskType = {
            id: v1(), title: title, isDone: false
        }

        // const tasksForTodolist: Array<TaskType> = tasksState[todoListId]
        //
        // const updatedTasks: Array<TaskType> = [newTask, ... tasksForTodolist]
        // const copyTasks: TasksStateType = {...tasksState}
        // copyTasks[todoListId] = updatedTasks
        // setTasksState(copyTasks)
        //

        setTasksState({...tasksState, [todoListId]: [newTask, ...tasksState[todoListId]]})
    };
    const changeTaskStatus = (taskId: string, newIsDoneValue: boolean, todoListId: string) => {
        // const tasksForTodolist: Array<TaskType> = tasksState[todoListId]
        // const updatedTasks: Array<TaskType> = tasksForTodolist.map(t => t.id === taskId
        // ? {...t, isDone: newIsDoneValue}
        // : t)
        // const copyTasks: TasksStateType = {...tasksState}
        // copyTasks[todoListId] = updatedTasks
        //
        // setTasksState(copyTasks)

        setTasksState({...tasksState, [todoListId]: tasksState[todoListId].map(t => t.id === taskId
        ? {...t, isDone: newIsDoneValue}
        : t)})
    };

    const removeTodoLists = (todoListId: string) => {
    const updatedTodoLists: Array<TodoListType> = todolists.filter(tl => tl.id !== todoListId)
        setTodolists(updatedTodoLists)
        delete tasksState[todoListId]
    }

    const getFilteredTasks =
        (allTasks: Array<TaskType>, currentFilterValue: FilterValuesType): Array<TaskType> => {
            switch (currentFilterValue) {
                case "completed":
                    return allTasks.filter(t => t.isDone);
                case "active":
                    return allTasks.filter(t => !t.isDone);
                default:
                    return allTasks;
            }
        };


    const todoListsComponents: Array<JSX.Element> = todolists.map(tl => {
        const filteredTasks: Array<TaskType> = getFilteredTasks(tasksState[tl.id], tl.filter);
        return (
            <TodoList
                key={tl.id}
                todoListId={tl.id}
                title={tl.title}
                filter={tl.filter}
                tasks={filteredTasks}
                addTask={addTask}
                removeTask={removeTask}
                changeFilter={changeTodolistFilter}
                removeTodoLists={removeTodoLists}
                changeTaskStatus={changeTaskStatus}
            />
        )
    })




    return (
        <div className="App">
            {todoListsComponents}
        </div>
    );
}

export default App;
