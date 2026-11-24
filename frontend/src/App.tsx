
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'
import {createBrowserRouter} from "react-router"
import {ProfileGallery, LoadProfileGallery} from '@components/Galleries/ProfileGallery'
import {EditPage, EditPageLoader} from '@components/EditPage'
import {NewImageCreator} from '@components/Editor/NewImageCreator'
import { PaletteLoader } from '@components/Editor/EditorPaletteLoaders';
import MainLayout from '@components/Layout/MainLayout'
import { PatternDetail, PatternDetailLoader } from '@components/PatternDetail/PatternDetails';

const router=createBrowserRouter([{
  Component: MainLayout,
  children:[
    {index:true, Component: ProfileGallery, loader: LoadProfileGallery},
    {path:"/galeria", Component: ProfileGallery, loader: LoadProfileGallery},
    {path:"/galeria/:id", Component: PatternDetail, loader: PatternDetailLoader},
    {path:"/edytor/:id", Component: EditPage, loader: EditPageLoader},
    {path:"/edytor", Component: NewImageCreator, loader: PaletteLoader},
  ]
}])

export default router
