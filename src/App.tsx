import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from "react-router-dom";
import Logo from './assets/grayv.png'

import Contact from './view/Contact';
import Main from './view/Main';
import VGraph from './view/graph'

import { FiltersState } from "./api/types";
import { SigmaContainer, useSigma } from 'react-sigma-v2';
<<<<<<< HEAD
import Icon from './components/icon';

=======
import './static/css/App.css';
import Header from './components/header';
import Search from './components/search';
import Graph from './components/graph';
import Comments from './components/comments';
>>>>>>> d0042f81fc99a4b7c22e0faef8bf46dbaaca06c8


function App() {


  const [path, setPath] = useState("");

  window.addEventListener("load", () => {

    if (window.location.pathname === "/contact") {
      setPath(window.location.pathname);
    }
  });


  /* const checkPath = () => {
     history.((location) => {
       setPath(location.pathname);
     });
   }*/


  const showContact = path;
  /*let _contact;
  if (showContact !== "/contact") {
    _contact = (<li><Link to="/contact">Contact Us</Link></li>)
  }
  let _graph;
  if (showContact !== "/graph") {
    _graph = (<li><Link to="/graph">Graph</Link></li>)
  }
  let _about;
  if (showContact !== "/about") {
    _about = (<li><Link to="/about" >About Us</Link></li>)
  }*/



  let _home = ((path != '/') ? <li><Link to="/" >  <Icon libraryName='home' /> Home</Link></li> : null)

  let _graph = ((path != '/graph') ? <li><Link to="/graph"><Icon libraryName='desktop' /> Graph</Link></li> : null)
  let _contact = ((path != '/contact') ? <li><Link to="/contact"><Icon libraryName='phone' /> Contact Us</Link></li> : null)
  let _about = ((path != '/about') ? <li><Link to="/about" >About Us</Link></li> : null)

  return (
<<<<<<< HEAD
    <div className="App">


      <nav>
        <ul>
          <li><Link to="/"> <img src={Logo} height="100" width="auto" /> </Link></li>
        </ul>
        <ul style={{ display: 'rows' }}>
          <b>
          {_home}
          <li className="vertical-separator" />
          {_graph}
          <li className="vertical-separator" />
          {_contact}
        
          </b>
        </ul>
      </nav>


      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/graph" element={<VGraph />} />
      </Routes>

    </div>
=======
    <>
      <Header title={_infoProject.name} desc={_infoProject.desc} sBC={(data:any) => {setDataBC(data)}} data={dataBC} sigmaData={currentSigma} sigma={sigma} />
      <SigmaContainer>
        <Search filters={filtersState} />
        <Graph data={dataBC} sBC={(data:any) => {setDataBC(data)}} sCS={(data:any) => setCurrentSigma(data)} sSigma={(data:any) => setSigma(data)} />
      </SigmaContainer>
      <Comments/>
    </>
>>>>>>> d0042f81fc99a4b7c22e0faef8bf46dbaaca06c8
  );

}


export default App;


// <Route path="/main" element={<Main/>} /> 