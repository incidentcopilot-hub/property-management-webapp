type TaskListProps = {
  title: string;
  tasks: string[];
};

function TaskList({ title, tasks }: TaskListProps) {
  return (
    <section className="card">
      <div className="section-heading">
        <h2>{title}</h2>
        <span className="pill">{tasks.length} tasks</span>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task}>
            <span className="dot" aria-hidden />
            {task}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TaskList;
