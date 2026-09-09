import './App.css';
import Header from './shared/Header';
import TodosPage from './features/Todos/TodosPage';
import Logon from './features/Logon';
import Logoff from './features/Logoff';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />

      {isAuthenticated ? (
        <>
          <Logoff />
          <TodosPage />
        </>
      ) : (
        <Logon />
      )}
    </>
  );
}

export default App;