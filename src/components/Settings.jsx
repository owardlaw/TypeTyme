import './styles.css'
import './settings.css'
import React, { useCallback, useEffect, useState } from 'react'

const Settings = (props) => {
  const { darkMode, setDarkMode } = props;

  const toggleDark = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  return (

    <div className='settings-container' style={{
      backgroundColor: darkMode ? 'rgb(36, 36, 36)' : 'rgb(200, 200, 200)',
      color: darkMode ? 'white' : 'black'
    }}>
      <div className="wrapper" >
        <input type="checkbox" id="hide-checkbox" />
        <label for="hide-checkbox" className="toggle" onClick={toggleDark} >
          <span className="toggle-button">
            <span className="crater crater-1"></span>
            <span className="crater crater-2"></span>
            <span className="crater crater-3"></span>
            <span className="crater crater-4"></span>
            <span className="crater crater-5"></span>
            <span className="crater crater-6"></span>
            <span className="crater crater-7"></span>
          </span>
          <span className="star star-1"></span>
          <span className="star star-2"></span>
          <span className="star star-3"></span>
          <span className="star star-4"></span>
          <span className="star star-5"></span>
          <span className="star star-6"></span>
          <span className="star star-7"></span>
          <span className="star star-8"></span>
        </label>
        <p className='settings-text'>Dark Mode</p>
      </div>
    </div>

  )
}

export default Settings 