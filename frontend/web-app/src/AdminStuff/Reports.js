import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
    const [reports, setReports] = useState({});

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/reports');
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    return (
        <div>
            <h1>Reports</h1>
            {/* Render reports and analytics here */}
        </div>
    );
};

export default Reports;
