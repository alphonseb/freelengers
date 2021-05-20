import { useContext } from "react";

import Link from "next/link";
import AppContext from "../../context/AppContext";
import { logout } from "../../lib/auth";

const Navbar = () => {
  const { user, setUser } = useContext(AppContext);

  return (
    <>
      {/* The actual navbar */ }
      <nav className='navbar-container'>
        <Link href='/[[...slug]]' as='/'>
          <a>Freelengers</a>
        </Link>
        {/* List of links on desktop */ }
        { user ? (
          <ul className=''>
            <li>
              <Link href='/projects'>
                <a className=''>Projets</a>
              </Link>
            </li>
            <li>
              <Link href='/user/network'>
                <a className=''>Mon réseau</a>
              </Link>
            </li>
            <li>
              <Link href='/user/recommendations'>
                <a className=''>Mes recommendations</a>
              </Link>
            </li>
            <li>
              <Link href='/'>
                <a
                  className=''
                  onClick={ () => {
                    logout();
                    setUser(null);
                  } }
                >
                  Se déconnecter
                </a>
              </Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link href='/login'>
                <a className='nav-link'>Se connecter</a>
              </Link>
            </li>
          </ul>
        ) }
      </nav>
    </>
  );
};

export default Navbar;
