import React from 'react';
import './index.css'

const Homepage: React.FC = () => (
  <main className="homepage">
    <p>
      Welcome to BaseTerm! BaseTerm supports importing, exporting, creating, and editing TermBase eXchange (TBX) termbases that follow the ISO 30042 (v3) standard. 
    </p>
    <p>
      Currently, BaseTerm is only compatible with the TBX-Basic module; however, there is an option in the termbase settings to depart from TBX-Basic and have manual control over data categories. For more information, checkout the TBX <a href="https://www.tbxinfo.net/" target="_blank" rel="noreferrer">website</a>.
    </p>
  </main>
);

export default Homepage;