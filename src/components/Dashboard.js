import React from "react";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Welcome to the Dashboard</h1>
            <p>This is a protected route. Only accessible to logged-in users.</p>
            {/* Add more content or components here, such as user data, statistics, etc. */}
        </div>
    );
};

export default Dashboard;
