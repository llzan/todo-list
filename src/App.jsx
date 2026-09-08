import './App.css';
import Header from './shared/Header';
import TodosPage from './features/Todos/TodosPage';
import Logon from './features/Logon';
import { useAuth } from './contexts/AuthContext';

function App() {
  // get authentication status from AuthContext
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      {/* header gets authentication state from Context */}

      {/* show TodosPage when logged in, otherwise shows logon */}
      {isAuthenticated ? <TodosPage /> : <Logon />}
    </>
  );
}

export default App;
