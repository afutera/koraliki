
//import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Editor from '@components/Editor/Editor'
import ProfileGallery from '@components/ProfileGallery'


function App() {

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
          <ProfileGallery /></>}/>
        <Route path="/edytor" element={<p>Otwórz edytor przez galerię</p>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
