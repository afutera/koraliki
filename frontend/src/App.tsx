
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'
import {createBrowserRouter} from "react-router"
import ProfileGallery from '@components/ProfileGallery'
import EditPage from '@components/TestEditPage'
import NewImageCreator from '@components/Editor/NewImageCreator'
import MainLayout from '@components/Layout/MainLayout'

const router=createBrowserRouter([{
  Component: MainLayout,
  children:[
    {index:true, Component: ProfileGallery},
    {path:"/galeria", Component: ProfileGallery},
    {path:"/edytor/:id", Component: EditPage},
    {path:"/edytor", Component: NewImageCreator},
  ]
}])

export default router
