
//import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ReadOnlyCanvas from '@components/ReadOnlyCanvas'
import patterns from './placeholder_data/testpatterns'
import Editor from '@components/Editor/Editor'

function App() {

  var waskie = {
    width: '20%',
    display: 'inline-block',
    border: '2px solid black',
    padding: 0
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <div>
              <h1>Strony testowe</h1>
              <ul><li><Link to="/galeria">Test galerii - kanwy do odczytu różnej wielkości</Link></li>
              <li><Link to="/edytor">Test edytora</Link></li></ul>
          </div>
        }/>
        <Route path="/galeria" element={<>
          <header>Test kanw</header>
          <div id='panel'>
            <div style={waskie}><ReadOnlyCanvas pattern={patterns[0]}/></div>
            <div style={waskie}><ReadOnlyCanvas pattern={patterns[1]}/></div>
            <div style={waskie}><ReadOnlyCanvas pattern={patterns[2]}/></div>
            <div style={waskie}><ReadOnlyCanvas pattern={patterns[3]}/></div>
          </div></>}/>
        <Route path="/edytor" element={<>
           <header>Test edytora</header>
           <div style={{height: innerHeight}}><Editor pattern={patterns[3]}></Editor></div>
        </>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
