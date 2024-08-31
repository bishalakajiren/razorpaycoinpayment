import React from 'react';
import Payment from './Payment';

const App = () => {
    const userId = '10'; // Replace with actual user ID
    const packageId = '2'; // Replace with actual plan ID
  
    return (
        <div>
            <h1>Subscription Page</h1>
            <Payment userId={userId} packageId={packageId}  />
        </div>
    );
};

export default App;
