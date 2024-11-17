WorldWise
WorldWise is a web application that helps you keep track of your travel adventures. It allows you to mark cities you have visited on a map, add notes about your trips, and view weather information for those cities.

Features
User Authentication: Sign up, log in, and log out using Firebase Authentication.
City Management: Add, view, and delete cities you have visited.
Country Management: View a list of countries you have visited based on the cities you have added.
Map Integration: Use Leaflet to display a map where you can click to add cities.
Weather Information: Fetch and display current weather information for the cities you have added.
Responsive Design: The application is designed to work well on both desktop and mobile devices.
Project Structure
The project is organized as follows:

.eslintrc.json
.gitignore
bun.lockb
data/
index.html
package.json
public/
src/
  App.jsx
  components/
    AppNav.jsx
    AppNav.module.css
    BackButton.jsx
    Button.jsx
    Button.module.css
    City.jsx
    City.module.css
    CityItem.jsx
    CityItem.module.css
    CityList.jsx
    CityList.module.css
    CountryItem.jsx
    CountryItem.module.css
    CountryList.jsx
    CountryList.module.css
    Form.jsx
    Form.module.css
    Logo.jsx
    ...
  config/
    ...
  contexts/
    AuthContext.jsx
    CitiesContext.jsx
  hooks/
    useGeolocation.js
    useUrlPosition.js
  index.css
  main.jsx
  pages/
    AppLayout.jsx
    AppLayout.module.css
    Homepage.jsx
    Homepage.module.css
    Login.jsx
    Login.module.css
    PageNotFound.jsx
    Pricing.jsx
    Product.jsx
    Register.jsx
    Register.module.css
vite.config.js

Key Components
App.jsx: The main application component that sets up routing and context providers.
components/: Contains reusable components such as buttons, forms, and navigation elements.
contexts/: Contains context providers for authentication and city management.
hooks/: Contains custom hooks for geolocation and URL position management.
pages/: Contains page components for different routes such as login, register, homepage, and more.
