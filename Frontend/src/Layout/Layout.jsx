import { useContext } from "react";
import Header from "../components/Header/Header";
import Footer from '../components/Footer/Footer';
import Routers from '../../routes/Routers';
import { authContext } from '../context/AuthContext';


const Layout = () => {
  const { role } = useContext(authContext);
  return <>
   <Header />
   <main>
    <Routers />
   </main>
   {role !== 'admin' && <Footer />}
  </>
}

export default Layout
