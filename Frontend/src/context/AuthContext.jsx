// src/context/AuthContext.jsx - Update the login function
const login = (accessToken, refreshToken, userData) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  
  // Make sure userData has all necessary fields
  const completeUserData = {
    ...userData,
    id: userData.id || userData.user_id || userData.pk || null
  };
  
  localStorage.setItem('user', JSON.stringify(completeUserData));
  setUser(completeUserData);
  return completeUserData;
};

// Also update the useEffect to load user from localStorage
useEffect(() => {
  const access = localStorage.getItem('access_token');
  const storedUser = localStorage.getItem('user');
  
  if (access && !isTokenExpired(access)) {
    const decoded = jwtDecode(access);
    
    // Try to get user from localStorage first, then from token
    let userData;
    if (storedUser) {
      try {
        userData = JSON.parse(storedUser);
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
    
    if (!userData) {
      // Extract user data from token
      userData = {
        username: decoded.username || decoded.sub,
        email: decoded.email || '',
        role: decoded.role || 'user',
        id: decoded.user_id || decoded.id || null
      };
    }
    
    setUser(userData);
  } else if (access) {
    // Try refresh
    refreshToken().then(success => {
      if (!success) setUser(null);
    });
  }
  setLoading(false);
}, []);