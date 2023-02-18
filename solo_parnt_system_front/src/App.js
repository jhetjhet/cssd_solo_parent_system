import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AnnouncementForm from './pages/AnnouncementForm';
import AppFormSP from './pages/AppFormSP';
import BarangayPresidents from './pages/BarangayPresidents';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Reports from './pages/Reports';
import Root from './pages/Root';

import {
  loader as formLoader,
} from "./pages/AppFormSP";

import {
  loader as reportsLoader,
} from "./pages/Reports";
import LoginPage from './pages/LoginPage';
import { AuthenticationProvider, RequireAuth } from './components/Authentication';
import { CookiesProvider } from 'react-cookie';

const PERSONAL_INFO = {
  "first_name": "ostin",
  "mid_name": "villasana",
  "last_name": "mallari",
  "birth_date": "01/01/1999",
  "birth_place": "earth",
  "civil_status": "singol",
  "complete_present_address": "b1 l2 PH",
  "age": "23",
  "contact_number": "09999999999",
  "gender": "M",
  "highest_educ_attain": "Bachelors Degree",
  "occup_emp": "Dunno",
  "occup_address": "ASDASDASD",
  "monthly_income": "10000000",
  "status_of_emp": "RG",
  "other_incom_src": "None",
  "current_org_pos": "None",
  "pos_if_offcr": "None",

  "classifications": "",
  "needs_of_solor_parent": "",
  "family_composition": [
    {
      "first_name": "ostin",
      "mid_name": "villasana",
      "last_name": "mallari",
      "birth_date": "",
      "relationship": "",
      "age": "",
      "status": "",
      "educ_attainment": "",
      "school_name": "",
      "occupation": "",
    },
  ],
  "progs_srvcs_availed": {
    "ppp_benf": false,
    "slp_benf": false,
    "other_benf": false,
    "prnt_leader": false,
    "slp_officer": false,
    "skills": false,
  },
  "health_cards": {
    "blue_card": "",
    "phil_health": "",
    "hmo": "",
    "phil_health_masa_num": "",
    "indiv_player": "",
    "family_benf": "",
  },
  "tenurial_status": {
    "owned": false,
    "sharer": false,
    "priv_prop": false,
    "rent": false,
    "gov_prop": false,
    "riv_side": false,
    "pnr_site": false,
    "rent_per_month": 41231
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RequireAuth>
      <Root />
    </RequireAuth>,
    errorElement: <NotFound />,  
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/dashboard/",
        element: <Dashboard />,
      },
      {
        path: "/form/",
        element: <AppFormSP />,
        loader: formLoader,
      },
      {
        path: "/form/:parentID/",
        element: <AppFormSP />,
        loader: formLoader,
      },
      {
        path: "/presidents/",
        element: <BarangayPresidents />,
      },
      {
        path: "/announcements/",
        element: <AnnouncementForm />,
      },
      {
        path: "/records/",
        element: <Reports />,
        loader: reportsLoader,
      },
    ]
  },
  {
    path: "/login/",
    element: <LoginPage />,
  }
]);

function App() {
  return (
    <AuthenticationProvider>
      <CookiesProvider>
        <RouterProvider router={router} />
      </CookiesProvider>
    </AuthenticationProvider>
  );
}

export default App;
