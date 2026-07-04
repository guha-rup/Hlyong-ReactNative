export default (to, from, next) => {
    // Define the paths that are allowed without authentication
    const noAuthRequired = ['Login', 'emailverification', 'otp', 'resetpassword'];
    
    const permit = localStorage.getItem("permit");

    // Check if the route is in the list of no-auth-required paths
    if (noAuthRequired.includes(to.name)) {
        return next();
    }

    // If the user is not permitted and the route is not login, redirect to login
    if ((permit === null || permit.length <= 0) && to.name !== 'Login') {
        localStorage.removeItem("permit");
        return next("/login");
    }

    // If the user is permitted and trying to access login, redirect to dashboard
    if (permit && to.name === 'Login') {
        return next('/dashboard');
    }

    // Otherwise, allow access
    return next();
};
