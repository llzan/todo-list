import styles from './AboutPage.module.css';

// ABOUT PAGE

function AboutPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>
        About Todo App
      </h1>

      <p className={styles.description}>
        Todo App helps you organize your tasks, keep track of what needs
        to be done, and stay productive.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Features
        </h2>

        <ul className={styles.list}>
          <li className={styles.listItem}>
            Create and manage todo items
          </li>
          <li className={styles.listItem}>
            Track your tasks in one convenient place
          </li>
          <li className={styles.listItem}>
            User authentication and protected pages
          </li>
          <li className={styles.listItem}>
            Responsive and easy-to-use interface
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Technologies Used
        </h2>

        <ul className={styles.list}>
          <li className={styles.listItem}>
            React - for building the user interface
          </li>
          <li className={styles.listItem}>
            React Router - for navigation and routing
          </li>
          <li className={styles.listItem}>
            Vite - for development and building the application
          </li>
        </ul>
      </section>
    </main>
  );
}

export default AboutPage;
