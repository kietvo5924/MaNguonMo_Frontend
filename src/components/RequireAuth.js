import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({ roles = [], children }) => {
    const navigate = useNavigate();
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    useEffect(() => {
        if (!user) {
            navigate("/login"); // Redirect to login if no user is logged in
        } else if (!roles.some(role => user.roles.includes(role))) {
            navigate("/home"); // Redirect to home if user doesn't have required role
        }
    }, [user, navigate, roles]);

    if (!user) return null; // Prevent rendering the children until the check is complete

    return children; // Render children if the user is authenticated and has the correct role
};

export default RequireAuth;
