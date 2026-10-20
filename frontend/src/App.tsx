
//import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Editor from '@components/Editor/Editor'
import ProfileGallery from '@components/ProfileGallery'
import EditPage from '@components/TestEditPage'

//tymczasowo edytor pokazuje pierwszy

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <div>
              <h1>Strony testowe</h1>
              <ul><li><Link to="/galeria">Test galerii - kanwy do odczytu różnej wielkości</Link></li>
              <li>Ścieżka /edytor wyłączona, aż zrobię dodawanie nowego</li></ul>
          </div>
        }/>
        <Route path="/galeria" element={<>
          <header>Test kanw</header>
          <ProfileGallery /></>}/>
        <Route path="/edytor/:id" element={<EditPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
