// import { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from '../common/Header';
// import Home from './Home';

// function App() {
//   const [isSidenavOpen, setIsSidenavOpen] = useState(false);
//   // const [searchText, setSearchText] = useState(''); 
//   const [searchTerm, setSearchTerm] = useState<string>('');


//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const toggleSidenav = () => {
//     setIsSidenavOpen(!isSidenavOpen);
//   };

//   const toggleForm = () => {
//     setIsDialogOpen(!isDialogOpen);
//   };
//   // const handleSearchTextChange = (text: string) => {
//   //   setSearchText(text);
//   //   console.log('searchtext ',searchText);
    
//   // };


//   return (
//     <div className="app-container overflow-hidden">
//      <Header 
//   toggleSidenav={toggleSidenav} 
//   isSidenavOpen={isSidenavOpen} 
//   toggleForm={toggleForm} 
//   setSearchTerm={setSearchTerm}
//   // onSearchTextChange={handleSearchTextChange}
// />

//       {/* Pass searchText to Outlet through context */}
//       <div className={`content ${isSidenavOpen ? 'lg:ml-64' : 'lg:ml-0'} transition-all duration-300`}>
//         <Outlet
//         // context={{ searchText  }} 
//         /> {/* Provide context with searchText */}
//          {/* <Home searchTerm={searchTerm} /> */}
//       </div>
//     </div>
//   );
// }

// export default App;
