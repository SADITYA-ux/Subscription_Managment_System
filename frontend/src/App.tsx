import Home from "./pages/Home"
import Login from "./pages/Login"
import Navbar from "./components/Navbar"
import { Route, Routes, useLocation } from "react-router-dom"
import SignIn from "./pages/SignIn";
import AdminPlan from "./pages/admin/AdminPlans";
import RoleRoute from "./components/RoleRoute";
import AdminLayout from "./components/layout/AdminLayout";
import StaffLayout from "./components/layout/StaffLayout";
import ClientLayout from "./components/layout/ClientLayout";
import AdminClient from "./pages/admin/AdminClients";
import AdminSubscriptions from "./pages/admin/AdminSubscription";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminStaff from "./pages/admin/AdminStaff";
import Plans from "./pages/Plans";

export default function App()
{
  const location = useLocation();
  
  const NoIncludes = [
    "/login"
  ]

  const hideNavbar = NoIncludes.includes(location.pathname)

  return(
    <div>
      {!hideNavbar && <Navbar/>}
        <Routes>
            <Route path ="/" element = {<Home/>} />
            <Route path ="/plans" element = {<Plans/>} />
            <Route path= "/login" element = {<Login/>} />
            <Route path = "/register" element = {<SignIn/>}/>

            <Route element = { <RoleRoute allowedRoles={["Admin"]} />} >
              <Route element = {<AdminLayout/>}>
                <Route path = "/admin/plans" element = { <AdminPlan/>} />
                <Route path = "/admin/clients" element = {<AdminClient/>} />
                <Route path = "/admin/subscriptions" element = {<AdminSubscriptions/>} />
                <Route path = "/admin/payments" element = { <AdminPayments/>}/>
                <Route path = "/admin/staff" element = { <AdminStaff/>}/>
              </Route>
            </Route> 

            <Route element={<RoleRoute allowedRoles={["Staff"]} />}>
                  <Route element={<StaffLayout />}>
                      <Route path="/staff/clients" element={<AdminClient />} />
                      <Route path="/staff/subscriptions" element={<AdminSubscriptions />} />
                      <Route path="/staff/payments" element={<AdminPayments />} />
                  </Route>
              </Route>

            <Route element = { <RoleRoute allowedRoles = {["Client"]} />} >
              <Route element = {<ClientLayout/>}>
                
              </Route>
            </Route>

        </Routes>
    </div>
  )
}