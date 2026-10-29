
//import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ProfileGallery from '@components/ProfileGallery'
import EditPage from '@components/TestEditPage'
import NewImageCreator from '@components/Editor/NewImageCreator'

//tymczasowo edytor pokazuje pierwszy

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <div>
              <h1>Strony testowe</h1>
              <ul><li><Link to="/galeria">Test galerii - kanwy do odczytu różnej wielkości, edycja, usuwanie, kopiowanie</Link></li>
              <li><Link to="/edytor">Dodawanie nowego obrazu</Link>, w galerii jest edycja istniejących</li></ul>
          </div>
        }/>
        <Route path="/galeria" element={<>
          <header>Test kanw</header>
          <ProfileGallery /></>}/>
        <Route path="/edytor/:id" element={<EditPage/>}/>
        <Route path="/edytor" element={<NewImageCreator/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
