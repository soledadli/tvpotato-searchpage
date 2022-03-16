import styled from 'styled-components'
import Searchbar from './Components/Searchbar';
import './App.css';

const AppContainer = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content: center;
margin-top: 8em;
`


function App() {
  return (
    <AppContainer>
      <Searchbar />
    </AppContainer>
  );
}

export default App;
